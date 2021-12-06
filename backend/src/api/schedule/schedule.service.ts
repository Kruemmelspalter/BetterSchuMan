import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
    if (!userInfo.body.isAuthenticated) throw new UnauthorizedException();

    const { body: lessons } = await calls(
      'schedules',
      'get-actual-lessons',
      {
        student: {
          id:
            userInfo.body.user.associatedParents.length > 0
              ? userInfo.body.user.associatedParents[0].student.id
              : userInfo.body.user.associatedStudent.id,
        },
        start: scheduleId.start,
        end: scheduleId.end,
      },
      scheduleId.jwt,
      requestId,
    );

    const data = lessons.map((x) => {
      const lesson = x.isCancelled ? x.originalLessons[0] : x.actualLesson;
      if (x.event)
        return {
          date: x.date,
          hour: x.classHour.id,
          room: '',
          event: true,
          text: x.event.text,
          teachers: x.event.teachers,
        };
      if (lesson === undefined) {
        throw new InternalServerErrorException();
      }
      return {
        date: x.date,
        hour: x.classHour.id,
        room: lesson.room.name || '',
        cancelled: x.isCancelled || false,
        subject: {
          abbreviation: lesson.subject.abbreviation,
          name: lesson.subject.name,
          label: lesson.subjectLabel,
        },
        teachers: lesson.teachers,
        substitute: x.originalLessons !== undefined && !x.isCancelled,
        substituted:
          x.originalLessons !== undefined && !x.isCancelled
            ? {
                room: x.originalLessons[0].room.name,
                subject: {
                  abbreviation: x.originalLessons[0].subject.abbreviation,
                  name: x.originalLessons[0].subject.name,
                  label: x.originalLessons[0].subjectLabel,
                },
                teachers: x.originalLessons[0].teachers,
              }
            : undefined,
        event: false,
      };
    });

    return { hours: data };
  }

  async getHours(token: string, requestId: string | string[]) {
    this.logger.log({ id: requestId });
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
      token,
      requestId,
    );

    if (hours.status !== 200 || !hours.data) {
      throw new BadGatewayException();
    }
    return hours.data;
  }
}
