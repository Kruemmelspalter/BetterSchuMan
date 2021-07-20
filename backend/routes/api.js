import {Router} from "express";
import * as SessionRoute from './api/session.js'
import * as CoursesRoute from './api/courses.js'

export const router = Router()

router.use('/session', SessionRoute.router)
router.use('/courses', CoursesRoute.router)
