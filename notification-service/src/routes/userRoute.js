import {Router} from 'express'
import signupUser from '../controllers/authenticationController.js'

const router=new Router()

router.post('/signup',signupUser) 

export default router
