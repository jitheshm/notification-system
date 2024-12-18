
import {Router} from 'express'
import { broadcastController } from '../controllers/notificationController.js'

const router=new Router()

router.post('/broadcast',broadcastController)


export default router


