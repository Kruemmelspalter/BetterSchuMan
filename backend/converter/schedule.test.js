import {getSchedule} from "./schedule.js"

import {assert} from "chai";

const csLesson = {
    room: {
        name: "A105",
    },
    subject: {
        id: 1,
        abbreviation: "CS",
        name: "Computer Science",
    },
    teachers: [
        {
            id: 2,
            abbreviation: "Do",
            firstname: "John",
            lastname: "Doe",
        },
    ],
    classes: [
        {
            name: "Example Class",
            id: 3,
        },
    ],
    studentGroups: [
        {
            id: 4,
            name: "Example Group",
            classId: 3,
        },
    ],
}

describe('Schedule converter', function () {
    it('should convert schedule', function (done) {
        let data = getSchedule("2021-09-14", "2021-09-14", {
            schedule: {
                getSchedule: (startDate, endDate) => {
                    return [
                        {
                            date: startDate,
                            classHour: {
                                number: "2",
                            },
                            actualLesson: csLesson,
                        },
                        {
                            date: startDate,
                            classHour: {
                                number: "1",
                            },
                            actualLesson: csLesson,
                        },
                        {
                            date: endDate,
                            classHour: {
                                number: "3",
                            },
                            originalLessons: [
                                csLesson,
                            ],
                            isCancelled: true,
                            comment: "Frei",
                        },
                        {
                            date: endDate,
                            classHour: {
                                number: "4",
                            },
                            actualLesson: csLesson,
                        },
                    ];
                },
            },
        });

        data.forEach(lesson => {
            assert.equal(lesson.date, "2021-09-14")
        })

        done()

    });
});