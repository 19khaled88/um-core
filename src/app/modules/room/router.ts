
import express from 'express'
import { roomController } from './controller'



const router = express.Router()


router.post('/create-room',roomController.createRoom)


export const roomRoutes = router