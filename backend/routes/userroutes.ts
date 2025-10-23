import {Router} from 'express'

export const router = new Router()

router.get("/",(req,res)=>{
    const user = req.user
    res.json({"data":user})
})
