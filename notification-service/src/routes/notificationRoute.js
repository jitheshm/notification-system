
import {Router} from 'express'
import { broadcastController, targetNotificationController } from '../controllers/notificationController.js'

const router=new Router()

router.post('/broadcast',broadcastController)
router.post('/target',targetNotificationController)


export default router


