
import express from 'express'
import { buldingController } from './controller'


const router = express.Router()


router.post('/create-building',buldingController.createBuilding)


export const buildingRoutes = router