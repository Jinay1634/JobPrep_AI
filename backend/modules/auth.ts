import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { HttpError } from './error'
export const convertPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

export const comparePasswords = async (password: string, hPassword: string) => {
    const isValid = await bcrypt.compare(password, hPassword)
    return isValid
}

export const generateJWT = async (user) => {
    const JWTToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 30 })
    console.log(JWTToken)
    return JWTToken
}

export const protect = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization

        if (!bearer) {
            throw new HttpError("Invalid Token", 404)
        }

        const [, token] = bearer.split(" ")

        if (!token) {
            throw new HttpError("Invalid Token", 404)
        }

        const user = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = user
        next()
    } catch (e) {
        next(e)
    }

}