import {Router} from "express";
import SessionRoute from 'api/session'
import CoursesRoute from 'api/courses'

const router = Router()

router.use('/session', SessionRoute)
router.use('/courses', CoursesRoute)

module.exports = router