import {server} from './server'
import * as dotenv from 'dotenv'
dotenv.config()
const port = 5000



server.listen(port,'0.0.0.0' ,()=>{
    console.log(`Working app.. on ${port} port` )
})

