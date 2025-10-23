import { Flex, Box, Heading, VStack, Input, Button, Text, HStack, Spacer, Tag, InputGroup, InputRightElement, IconButton, Badge, Fade, ScaleFade, useToast } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ArrowForwardIcon, CloseIcon, CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

let socket: Socket;

export const Interview = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<"passed" | "failed" | null>(null);
  const toast = useToast();

  useEffect(() => {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      path: "/session",
      query: { roleId }
    });

    socket.on("connect", () => {
      console.log("Connected to server with id:", socket.id);
    });

    socket.on("aireply", (content: string) => {
      console.log("AI Reply:", content);
      const lower = content.toLowerCase();
      
      if (lower.includes("interview complete") || lower.includes("result:")) {
        setIsFinished(true);
        
        const isPassed = lower.includes("passed");
        const newResult = isPassed ? "passed" : "failed";
        setResult(newResult);
        
        setMessages((prev) => [...prev, `AI: ${content}`]);
        setIsTyping(false);
        
        toast({
          title: isPassed ? "Congratulations!" : "Interview Complete",
          description: isPassed ? "You have passed the interview!" : "Thank you for participating.",
          status: isPassed ? "success" : "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        
        try { 
          setTimeout(() => socket.close(), 500);
        } catch {}
      } else {
        setMessages((prev) => [...prev, `AI: ${content}`]);
        setIsTyping(false);
      }
    });

    socket.on("welcome", (mes: string) => {
      setMessages((prev) => [...prev, `AI: ${mes}`]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roleId, toast]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, `You: ${input}`]);
    socket.emit("reponse", input);
    setInput("");
    setIsTyping(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const endSession = () => {
    try {
      socket?.close();
    } catch {}
    navigate(-1);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Flex
      h="100vh"
      w="100%"
      bgGradient={
        isFinished && result
          ? result === "passed"
            ? "linear(to-br, #064e3b, #0f766e, #134e4a)"
            : "linear(to-br, #7f1d1d, #991b1b, #7c2d12)"
          : "linear(to-br, #0f172a, #1e293b, #334155)"
      }
      align="center"
      justify="center"
      p={4}
      position="relative"
      overflow="hidden"
      transition="background 1s ease-in-out"
    >
      <Box
        position="absolute"
        top="-20%"
        left="50%"
        transform="translateX(-50%)"
        w="800px"
        h="800px"
        borderRadius="full"
        bgGradient={
          isFinished && result
            ? result === "passed"
              ? "radial(circle, rgba(34, 197, 94, 0.2), transparent 70%)"
              : "radial(circle, rgba(239, 68, 68, 0.2), transparent 70%)"
            : "radial(circle, rgba(56, 189, 248, 0.1), transparent 70%)"
        }
        filter="blur(80px)"
        pointerEvents="none"
        animation="pulse 8s ease-in-out infinite"
        transition="background 1s ease-in-out"
      />

      {isFinished && result && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          pointerEvents="none"
          zIndex={0}
        >
          {result === "passed" ? (
            <CheckCircleIcon
              boxSize="400px"
              color="green.500"
              opacity={0.05}
              animation="scaleIn 1s ease-out"
            />
          ) : (
            <WarningIcon
              boxSize="400px"
              color="red.500"
              opacity={0.05}
              animation="scaleIn 1s ease-out"
            />
          )}
        </Box>
      )}

      <ScaleFade in={true} initialScale={0.9}>
        <Box
          w="100%"
          maxW="1000px"
          h={{ base: "92vh", md: "88vh" }}
          bg={
            isFinished && result
              ? result === "passed"
                ? "rgba(6, 78, 59, 0.7)"
                : "rgba(127, 29, 29, 0.7)"
              : "rgba(30, 41, 59, 0.7)"
          }
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          boxShadow={
            isFinished && result
              ? result === "passed"
                ? "0 20px 80px rgba(34, 197, 94, 0.5)"
                : "0 20px 80px rgba(239, 68, 68, 0.5)"
              : "0 20px 80px rgba(0, 0, 0, 0.5)"
          }
          border="1px solid"
          borderColor={
            isFinished && result
              ? result === "passed"
                ? "rgba(34, 197, 94, 0.3)"
                : "rgba(239, 68, 68, 0.3)"
              : "rgba(148, 163, 184, 0.1)"
          }
          display="flex"
          flexDirection="column"
          overflow="hidden"
          transition="all 1s ease-in-out"
        >
          <HStack 
            p={5} 
            bg={
              isFinished && result
                ? result === "passed"
                  ? "rgba(6, 78, 59, 0.9)"
                  : "rgba(127, 29, 29, 0.9)"
                : "rgba(15, 23, 42, 0.8)"
            }
            backdropFilter="blur(10px)"
            color="white" 
            borderTopRadius="3xl" 
            spacing={4}
            borderBottom="1px solid"
            borderBottomColor={
              isFinished && result
                ? result === "passed"
                  ? "rgba(34, 197, 94, 0.3)"
                  : "rgba(239, 68, 68, 0.3)"
                : "rgba(148, 163, 184, 0.1)"
            }
            transition="all 1s ease-in-out"
          >
            <Box>
              <Heading 
                size="md" 
                bgGradient={
                  isFinished && result
                    ? result === "passed"
                      ? "linear(to-r, green.300, teal.300)"
                      : "linear(to-r, red.300, pink.300)"
                    : "linear(to-r, cyan.300, purple.400)"
                }
                bgClip="text"
                transition="all 0.5s ease-in-out"
              >
                {isFinished && result
                  ? result === "passed"
                    ? "Interview Passed!"
                    : "Interview Failed"
                  : "AI Interview Session"}
              </Heading>
              <Text fontSize="xs" color="gray.400" mt={1}>
                {isFinished 
                  ? result === "passed"
                    ? "Great job! You've successfully completed the interview"
                    : "Keep practicing and try again"
                  : "Answer thoughtfully and professionally"}
              </Text>
            </Box>
            <Spacer />
            {isFinished && result && (
              <ScaleFade in={true}>
                <Tag 
                  size="lg"
                  bgGradient={result === "passed" ? "linear(to-r, green.500, teal.500)" : "linear(to-r, red.500, pink.500)"}
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="xl"
                  fontWeight="bold"
                  boxShadow={result === "passed" ? "0 4px 20px rgba(34, 197, 94, 0.6)" : "0 4px 20px rgba(239, 68, 68, 0.6)"}
                  animation="pulseTag 2s ease-in-out infinite"
                >
                  {result === "passed" ? "✓ PASSED" : "✗ FAILED"}
                </Tag>
              </ScaleFade>
            )}
            <IconButton 
              aria-label="End session" 
              icon={<CloseIcon />} 
              size="sm" 
              variant="ghost"
              onClick={endSession}
              _hover={{ bg: "rgba(239, 68, 68, 0.2)", transform: "scale(1.1)" }}
              transition="all 0.2s"
            />
          </HStack>

          <VStack
            flex="1"
            p={6}
            spacing={4}
            align="stretch"
            overflowY="auto"
            bg={
              isFinished && result
                ? result === "passed"
                  ? "rgba(6, 78, 59, 0.4)"
                  : "rgba(127, 29, 29, 0.4)"
                : "rgba(15, 23, 42, 0.4)"
            }
            transition="all 1s ease-in-out"
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(30, 41, 59, 0.3)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(148, 163, 184, 0.3)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(148, 163, 184, 0.5)',
              },
            }}
          >
            {messages.map((m, i) => {
              const isUser = m.startsWith("You:");
              const text = isUser ? m.replace(/^You:\s*/, "") : m.replace(/^AI:\s*/, "");
              const isFinalResult = text.toLowerCase().includes("interview complete");
              
              return (
                <Fade key={i} in={true}>
                  <Box
                    bg={isUser 
                      ? "linear-gradient(135deg, rgba(34, 211, 238, 0.8) 0%, rgba(20, 184, 166, 0.8) 100%)"
                      : isFinalResult
                        ? result === "passed"
                          ? "linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)"
                          : "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)"
                        : "rgba(51, 65, 85, 0.8)"
                    }
                    backdropFilter="blur(10px)"
                    color="white"
                    px={5}
                    py={4}
                    borderRadius="2xl"
                    alignSelf={isUser ? "flex-end" : "flex-start"}
                    maxW="75%"
                    wordBreak="break-word"
                    boxShadow={isUser 
                      ? "0 4px 20px rgba(34, 211, 238, 0.3)"
                      : isFinalResult
                        ? result === "passed"
                          ? "0 4px 30px rgba(34, 197, 94, 0.7)"
                          : "0 4px 30px rgba(239, 68, 68, 0.7)"
                        : "0 4px 20px rgba(0, 0, 0, 0.2)"
                    }
                    border="2px solid"
                    borderColor={isUser 
                      ? "rgba(34, 211, 238, 0.3)"
                      : isFinalResult
                        ? result === "passed"
                          ? "rgba(34, 197, 94, 0.5)"
                          : "rgba(239, 68, 68, 0.5)"
                        : "rgba(148, 163, 184, 0.1)"
                    }
                    _hover={{ transform: "translateY(-2px)", boxShadow: isUser 
                      ? "0 8px 30px rgba(34, 211, 238, 0.4)"
                      : isFinalResult
                        ? result === "passed"
                          ? "0 8px 40px rgba(34, 197, 94, 0.8)"
                          : "0 8px 40px rgba(239, 68, 68, 0.8)"
                        : "0 8px 30px rgba(0, 0, 0, 0.3)"
                    }}
                    transition="all 0.2s"
                    animation={isFinalResult ? "pulseMessage 2s ease-in-out infinite" : "none"}
                  >
                    <Badge 
                      mb={2} 
                      colorScheme={isUser ? "cyan" : isFinalResult ? (result === "passed" ? "green" : "red") : "purple"} 
                      variant="solid"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="md"
                    >
                      {isUser ? "You" : isFinalResult ? "FINAL RESULT" : "AI Interviewer"}
                    </Badge>
                    <Text fontSize="sm" lineHeight="1.6" fontWeight={isFinalResult ? "bold" : "normal"}>
                      {text}
                    </Text>
                  </Box>
                </Fade>
              );
            })}
            
            {isTyping && (
              <Fade in={true}>
                <Box 
                  bg="rgba(51, 65, 85, 0.8)"
                  backdropFilter="blur(10px)"
                  color="white" 
                  px={5} 
                  py={4} 
                  borderRadius="2xl" 
                  alignSelf="flex-start" 
                  maxW="60%"
                  boxShadow="0 4px 20px rgba(0, 0, 0, 0.2)"
                  border="1px solid rgba(148, 163, 184, 0.1)"
                >
                  <HStack spacing={3}>
                    <Badge colorScheme="purple" variant="subtle" fontSize="xs" px={2} py={1} borderRadius="md">
                      AI Interviewer
                    </Badge>
                    <HStack spacing={1}>
                      <Box 
                        w="8px" 
                        h="8px"
                        bg="cyan.400"
                        borderRadius="full"
                        animation="bounce 1.4s ease-in-out infinite"
                      />
                      <Box 
                        w="8px" 
                        h="8px"
                        bg="cyan.400"
                        borderRadius="full"
                        animation="bounce 1.4s ease-in-out 0.2s infinite"
                      />
                      <Box 
                        w="8px" 
                        h="8px"
                        bg="cyan.400"
                        borderRadius="full"
                        animation="bounce 1.4s ease-in-out 0.4s infinite"
                      />
                    </HStack>
                  </HStack>
                </Box>
              </Fade>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          {isFinished ? (
            <Box 
              p={6} 
              bg={
                result === "passed"
                  ? "rgba(6, 78, 59, 0.9)"
                  : "rgba(127, 29, 29, 0.9)"
              }
              backdropFilter="blur(10px)"
              borderTop="2px solid"
              borderTopColor={
                result === "passed"
                  ? "rgba(34, 197, 94, 0.5)"
                  : "rgba(239, 68, 68, 0.5)"
              }
              transition="all 1s ease-in-out"
            >
              <Flex 
                gap={4} 
                align="center" 
                justify="space-between"
                flexDir={{ base: "column", md: "row" }}
              >
                <HStack 
                  spacing={3}
                  flex={1}
                  justify={{ base: "center", md: "flex-start" }}
                >
                  <Box
                    w="16px"
                    h="16px"
                    borderRadius="full"
                    bg={result === "passed" ? "green.400" : "red.400"}
                    boxShadow={result === "passed" 
                      ? "0 0 30px rgba(34, 197, 94, 0.8)" 
                      : "0 0 30px rgba(239, 68, 68, 0.8)"
                    }
                    animation="pulseGlow 1.5s ease-in-out infinite"
                  />
                  <Text 
                    color={result === "passed" ? "green.200" : "red.200"} 
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    {result === "passed" 
                      ? "🎉 Congratulations! You passed the interview!" 
                      : "⚠️ Interview not passed. Keep practicing!"}
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Button 
                    bgGradient={result === "passed" ? "linear(to-r, green.500, teal.500)" : "linear(to-r, cyan.500, teal.500)"}
                    color="white"
                    onClick={() => navigate(-1)}
                    _hover={{ 
                      bgGradient: result === "passed" ? "linear(to-r, green.600, teal.600)" : "linear(to-r, cyan.600, teal.600)", 
                      transform: "translateY(-2px)" 
                    }}
                    _active={{ transform: "translateY(0)" }}
                    boxShadow={result === "passed" ? "0 4px 20px rgba(34, 197, 94, 0.4)" : "0 4px 20px rgba(34, 211, 238, 0.3)"}
                    transition="all 0.2s"
                    size="lg"
                  >
                    Back to Roles
                  </Button>
                  <Button 
                    variant="outline"
                    colorScheme="red"
                    leftIcon={<CloseIcon />} 
                    onClick={endSession}
                    _hover={{ bg: "rgba(239, 68, 68, 0.2)", transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                    size="lg"
                  >
                    Close
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ) : (
            <Box 
              p={5} 
              bg="rgba(15, 23, 42, 0.8)"
              backdropFilter="blur(10px)"
              borderTop="1px solid rgba(148, 163, 184, 0.1)"
            >
              <Flex gap={3} align="center">
                <InputGroup size="lg" flex={1}>
                  <Input
                    placeholder="Type your response and press Enter..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    bg="rgba(30, 41, 59, 0.6)"
                    border="1px solid rgba(148, 163, 184, 0.2)"
                    color="white"
                    _placeholder={{ color: "gray.500" }}
                    _hover={{ borderColor: "cyan.400" }}
                    _focus={{ 
                      borderColor: "cyan.400", 
                      boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.5)",
                      bg: "rgba(30, 41, 59, 0.8)"
                    }}
                    transition="all 0.2s"
                    disabled={isTyping}
                  />
                  <InputRightElement>
                    <IconButton 
                      aria-label="Send" 
                      icon={<ArrowForwardIcon />} 
                      size="sm" 
                      bgGradient="linear(to-r, cyan.500, teal.500)"
                      color="white"
                      onClick={handleSend} 
                      isDisabled={!input.trim() || isTyping}
                      _hover={{ 
                        bgGradient: "linear(to-r, cyan.600, teal.600)",
                        transform: "scale(1.1)"
                      }}
                      _active={{ transform: "scale(0.95)" }}
                      _disabled={{ 
                        opacity: 0.4,
                        cursor: "not-allowed",
                        transform: "none"
                      }}
                      transition="all 0.2s"
                      boxShadow="0 2px 10px rgba(34, 211, 238, 0.3)"
                    />
                  </InputRightElement>
                </InputGroup>
                <Button 
                  variant="outline"
                  colorScheme="red"
                  leftIcon={<CloseIcon />} 
                  onClick={endSession}
                  size="lg"
                  _hover={{ bg: "rgba(239, 68, 68, 0.1)", transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                  display={{ base: "none", md: "flex" }}
                >
                  End
                </Button>
                <IconButton
                  aria-label="End session"
                  icon={<CloseIcon />}
                  variant="outline"
                  colorScheme="red"
                  onClick={endSession}
                  size="lg"
                  _hover={{ bg: "rgba(239, 68, 68, 0.1)", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                  display={{ base: "flex", md: "none" }}
                />
              </Flex>
            </Box>
          )}
        </Box>
      </ScaleFade>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.4;
              transform: translateX(-50%) scale(1);
            }
            50% {
              opacity: 0.6;
              transform: translateX(-50%) scale(1.1);
            }
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }

          @keyframes pulseTag {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 4px 20px rgba(34, 197, 94, 0.6);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 6px 30px rgba(34, 197, 94, 0.8);
            }
          }

          @keyframes pulseMessage {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 0 0 30px rgba(34, 197, 94, 0.8);
            }
            50% {
              box-shadow: 0 0 40px rgba(34, 197, 94, 1);
            }
          }

          @keyframes scaleIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 0.05;
            }
          }
        `}
      </style>
    </Flex>
  );
};

export default Interview;