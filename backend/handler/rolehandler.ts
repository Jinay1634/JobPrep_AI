import { z } from 'zod'
import { HttpError } from '../modules/error'
import prisma from '../db'

const createRoleBody = z.object({
    position: z.string().min(1, "Position must be provided"),
    description: z.string().min(1, "Description must be provided")
})


const getRoleParams = z.object({
    id: z.uuid(),
})

export const createRole = async (req, res, next) => {
    try {
        const createBodySafe = createRoleBody.safeParse(req.body)
        if (!createBodySafe.error) {
            let role
            try {
                role = await prisma.role.create({
                    data:{
                        userid:req.user.id,
                        position:createBodySafe.data.position,
                        description:createBodySafe.data.description
                    }
                })
                res.status(200).json({ data: role })
            } catch (e) {
                throw new HttpError("Problem with Database", 400)
            }
        } else {
            throw new HttpError("Invalid Data Format", 400)
        }
    } catch (e) {
        next(e)
    }
}
export const getRole = async (req, res, next) => {
    try {
        const safeRoleParams = getRoleParams.safeParse(req.params)
        if (!safeRoleParams.error) {
            let role
            try {
                role = await prisma.role.findFirst({
                    where: {
                        id: safeRoleParams.data.id,
                        userid: req.user.id
                    }
                })
                if (!role) {
                    res.status(404).json({ msg: "Data not exist" })
                }
                res.status(200).json({ data: role })
            } catch (e) {
                throw new HttpError("Database Problem", 400)
            }
        }
        else {
            throw new HttpError("Invalid Data Format", 400)
        }
    } catch (e) {
        next(e)
    }
}
export const getRoles = async (req, res, next) => {
    try {
        const roles = await prisma.role.findMany({
            where: {
                userid: req.user.id
            }
        })
        res.status(200).json({ data: roles })
    } catch (e) {
        next(e)
    }
}
export const deleteRole = async (req, res, next) => {
    try {
        const safeRoleParams = getRoleParams.safeParse(req.params)
        if (!safeRoleParams.error) {
            let role
            try {
                role = await prisma.role.delete({
                    where: {
                        id: safeRoleParams.data.id
                    }
                })
                res.status(200).json({ msg:"Deleted Successfully" })
            } catch (e) {
                throw new HttpError("Database Issue", 400)
            }
        } else {
            throw new HttpError("Invalid Data Format", 400)
        }
    } catch (e) {
        next(e)
    }
}