import {Router} from 'express'
import { loginUser, signupUser } from '../controllers/authenticationController.js'

const router=new Router()

router.post('/signup',signupUser) 
router.post('/login',loginUser) 

export default router
