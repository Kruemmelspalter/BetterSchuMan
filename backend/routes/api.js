import {Router} from "express";
import * as SessionRoute from './api/session.js'
import * as CoursesRoute from './api/courses.js'
import * as ScheduleRoute from './api/schedule.js'
import * as MessagesRoute from './api/messages.js'

export const router = Router()

router.use('/session', SessionRoute.router)
router.use('/courses', CoursesRoute.router)
router.use('/schedule', ScheduleRoute.router)
router.use('/mesages', MessagesRoute.router)
