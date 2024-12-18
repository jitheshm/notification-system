
import {Router} from 'express'
import { broadcastController, fetchActiveUsers, targetNotificationController } from '../controllers/notificationController.js'

const router=new Router()

router.post('/broadcast',broadcastController)
router.post('/target',targetNotificationController)
router.get('/users/active',fetchActiveUsers)


export default router


