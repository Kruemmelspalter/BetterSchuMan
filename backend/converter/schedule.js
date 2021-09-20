import {schuManClient} from '../client/SchuManClient.js'

export function getSchedule(startDate, endDate, client = schuManClient) {
    let rawData = client.schedule.getSchedule(startDate, endDate)

    return rawData.map(lesson => {
        if (lesson.isCancelled) {
            return {
                date: lesson.date,
                period: lesson.classHour.number,
                room: lesson.originalLessons[0].room.name,
                course: {
                    id: lesson.originalLessons[0].subject.id,
                    name: lesson.originalLessons[0].subject.name,
                    abbreviation: lesson.originalLessons[0].subject.abbreviation,
                    teacher: {
                        id: lesson.originalLessons[0].teachers[0].id,
                        abbreviation: lesson.originalLessons[0].teachers[0].abbreviation,
                        firstname: lesson.originalLessons[0].teachers[0].firstname,
                        lastname: lesson.originalLessons[0].teachers[0].lastname,
                    },
                    classes: lesson.originalLessons[0].classes.map(c => c.name),
                },
                isCancelled: true,
                comment: "",
            }
        }
        return {
            date: lesson.date,
            period: lesson.classHour.number,
            room: lesson.actualLesson.room.name,
            course: {
                id: lesson.actualLesson.subject.id,
                name: lesson.actualLesson.subject.name,
                abbreviation: lesson.actualLesson.subject.abbreviation,
                teacher: {
                    id: lesson.actualLesson.teachers[0].id,
                    abbreviation: lesson.actualLesson.teachers[0].abbreviation,
                    firstname: lesson.actualLesson.teachers[0].firstname,
                    lastname: lesson.actualLesson.teachers[0].lastname,
                },
                classes: lesson.actualLesson.classes.map(c => c.name),
            },
            isCancelled: false,
            comment: "",
        }
    })
}