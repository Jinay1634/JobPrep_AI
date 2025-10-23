import express from 'express'
import morgan from 'morgan'
import { router as userrouter } from './routes/userroutes'
import { router as rolerouter } from './routes/rolesroutes'
import { HttpError } from './modules/error'
import dotenv from 'dotenv'
import { comparePasswords, generateJWT, protect } from './modules/auth'
import { z } from 'zod'
import prisma from './db'
import { Server } from 'socket.io';
import { createServer } from 'node:http'
import cors from "cors";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()
export const app = express()
export const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    path: "/session"
});

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

io.on('connection', async (socket) => {
    let roleId = socket.handshake.query.roleId as string

    const role = await prisma.role.findFirst({ where: { id: roleId } });
    let position = role.position;
    let job_description = role.description;
    let num_questions = 0
    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",         
        apiKey: process.env.GOOGLE_API_KEY!,
        temperature: 0.7, 
    });
    
    const callModel = async (state: typeof MessagesAnnotation.State) => {
        const systemPrompt = `You are an AI interview assistant with memory. 

Your task:
- Conduct an interview for the position: ${position}.
- Use the job description: ${job_description}.
- Generate a total of 10 questions.
- Keep track of previous questions and answers. Never repeat questions.
- Each new question should consider the previous answers to guide the interview naturally.
- Ask questions in a conversational, friendly tone.

Instructions for each turn:
1. You have already greeted user.
2. Ask one question at a time.
3. Wait for the candidate's answer.
4. Use your memory of previous answers to generate the next question.
5. After 10 questions are completed, evaluate the candidate's performance based on their answers.

Variables:
- ${job_description}: Full job description.
- ${position}: Job title.
- Current question number: ${num_questions}/10`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...state.messages,
        ];
        const response = await llm.invoke(messages);
        return { messages: response };
    };

    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("model", callModel)
        .addEdge(START, "model")
        .addEdge("model", END);

    const memory = new MemorySaver();
    const app = workflow.compile({ checkpointer: memory });

    socket.emit("welcome", `Welcome! Let's begin your interview for the ${position} position.`)
    
    socket.on('disconnect', () => console.log('User disconnected'));
    
    socket.on("reponse", async (r) => {
        const reply = await app.invoke(
            {
                messages: [
                    {
                        role: "user",
                        content: r,
                    },
                ],
            },
            {
                configurable: { thread_id: "1" },
            }
        );
        
        num_questions++
        
        
        const lastMessage = reply.messages[reply.messages.length - 1];
        const content = lastMessage.content;
        
        if (num_questions >= 10) {
            socket.emit("aireply", content)
            
            setTimeout(async () => {
                const evaluationReply = await app.invoke(
                    {
                        messages: [
                            {
                                role: "user",
                                content: "Based on all the answers provided during this interview, evaluate the candidate's performance. Respond with ONLY one word: either 'PASSED' if the candidate performed well and is suitable for the role, or 'FAILED' if they did not meet the requirements. Consider their technical knowledge, communication skills, and overall fit for the position.",
                            },
                        ],
                    },
                    {
                        configurable: { thread_id: "1" },
                    }
                );
                
                const evalMessage = evaluationReply.messages[evaluationReply.messages.length - 1];
                const evalContent = evalMessage.content;
                
              
                
                socket.emit("aireply", `Interview Complete. Result: ${evalContent}`)
            }, 1000);
        } else {
            socket.emit("aireply", content)
        }
    })
});

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

const createUserBody = z.object({
    name: z.string().min(1, "Name Must be Provided"),
    email: z.email(),
    password: z.string().min(8, "Password be 8 character long")
})

const loginUserBody = z.object({
    email: z.email(),
    password: z.string().min(8, "Password be 8 character long")
})

app.get("/", () => {
   
})

app.post("/createuser", async (req, res, next) => {
    try {
        const safeBodyUser = createUserBody.safeParse(req.body)
        if (!safeBodyUser.error) {
            let user;
            let jwt;
            try {
                user = await prisma.user.create({
                    data: safeBodyUser.data
                })
                jwt = await generateJWT(user)
            }
            catch (e) {
                
                throw new HttpError("Problem with creating", 400)
            }
            res.status(200).json({ token: jwt, data: user })
        } else {
            throw new HttpError("Invalid Data Format", 400)
        }
    } catch (e) {
        next(e)
    }
})

app.post("/login", async (req, res, next) => {
    try {
        const safeLoginUser = loginUserBody.safeParse(req.body)
      
        if (!safeLoginUser.error) {
            let user;
            let jwt;
            try {
                const user = await prisma.user.findFirst({
                    where: { email: safeLoginUser.data.email }
                })
                if (!user) {
                    throw new HttpError("User dont exist", 400)
                }
                const isValid = comparePasswords(user.password, safeLoginUser.data.password)
                if (isValid) {
                    jwt = await generateJWT(user)
                } else {
                    throw new HttpError("User dont exist", 400)
                }
                res.status(200).json({ token: jwt, data: user })
            } catch (e) {
                throw new HttpError("Problem with Database", 400)
            }
        }
        else {
            throw new HttpError("Invalid Data Format", 400)
        }
    } catch (e) {
        next(e)
    }
})

app.use("/role", protect, rolerouter)
app.use((err, req, res, next) => {
    const status = err instanceof HttpError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        success: false,
        status,
        message,
    });
})