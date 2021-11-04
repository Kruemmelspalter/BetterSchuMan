import { Injectable, Logger } from '@nestjs/common';
import { ScheduleIdDto } from './dto/scheduleId.dto';
import { calls, request } from '../../schuman';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  async getSchedule(scheduleId: ScheduleIdDto, requestId: string | string[]) {
    this.logger.log({ id: requestId });
    const userInfo = await request(
      'POST',
      '/login-status',
      {},
      scheduleId.jwt,
      requestId,
    );

    const { body: lessons } = await calls(
      'schedules',
      'get-actual-lessons',
      {
        student: {
          id: userInfo.body.user.associatedStudent.id,
        },
        start: scheduleId.start,
        end: scheduleId.end,
      },
      scheduleId.jwt,
      requestId,
    );

    const { body: hours } = await calls(
      'schedules',
      'poqa',
      {
        action: {
          action: 'findAll',
          model: 'main/class-hour',
          parameters: [{ attributes: ['id', 'number', 'from', 'until'] }],
        },
      },
      scheduleId.jwt,
      requestId,
    );

    const data = lessons.map((x) => {
      const hour = hours.data.filter((y) => {
        return y.id === x.classHour.id;
      })[0];
      return {
        date: x.date,
        from: hour.from,
        to: hour.until,
        hour: hour.number,
        room: x.actualLesson.room.name,
        subject: {
          abbreviation: x.actualLesson.subject.abbreviation,
          name: x.actualLesson.subject.abbreviation,
          label: x.actualLesson.subjectLabel,
        },
        teachers: x.actualLesson.teachers,
      };
    });

    return { hours: data };
  }
}
