import { HttpException, Injectable } from '@nestjs/common';
import { ScheduleIdDto } from './dto/scheduleId.dto';
import * as superagent from 'superagent';

@Injectable()
export class ScheduleService {
  async getSchedule(scheduleId: ScheduleIdDto) {
    const userInfo = await superagent
      .post('https://login.schulmanager-online.de/api/login-status')
      .ok((_) => true)
      .auth(scheduleId.jwt, { type: 'bearer' })
      .send();
    if (!userInfo) throw new HttpException('Gateway Error', 502);
    if (!userInfo.body.isAuthenticated || userInfo.statusCode === 401)
      throw new HttpException('Unauthorized', 401);
    if (userInfo.statusCode !== 200)
      throw new HttpException('Error', userInfo.statusCode);

    const res = await superagent
      .post('https://login.schulmanager-online.de/api/calls')
      .auth(scheduleId.jwt, { type: 'bearer' })
      .ok((_) => true)
      .send({
        bundleVersion: '8cf3afc6db26e4699250',

        requests: [
          {
            moduleName: 'schedules',
            endpointName: 'get-actual-lessons',
            parameters: {
              student: {
                id: userInfo.body.user.associatedStudent.id,
              },
              start: scheduleId.start,
              end: scheduleId.end,
            },
          },
        ],
      });
    if (!res) throw new HttpException('Gateway Error', 502);
    if (res.statusCode === 401) throw new HttpException('Unauthorized', 401);
    if (res.statusCode !== 200)
      throw new HttpException('Error', res.statusCode);

    const hours = await superagent
      .post('https://login.schulmanager-online.de/api/calls')
      .auth(scheduleId.jwt, { type: 'bearer' })
      .ok((_) => true)
      .send({
        bundleVersion: '8cf3afc6db26e4699250',
        requests: [
          {
            moduleName: 'schedules',
            endpointName: 'poqa',
            parameters: {
              action: {
                action: 'findAll',
                model: 'main/class-hour',
                parameters: [{ attributes: ['id', 'number', 'from', 'until'] }],
              },
            },
          },
        ],
      });

    if (!hours) throw new HttpException('Gateway Error', 502);
    if (hours.statusCode === 401 || hours.body.results[0].status === 403)
      throw new HttpException('Unauthorized', 401);
    if (hours.statusCode !== 200)
      throw new HttpException('Error', hours.statusCode);
    const rawData = res.body.results[0].data;

    const data = rawData.map((x) => {
      const hour = hours.body.results[0].data.data.filter(
        (y) => y.id === x.classHour.id,
      )[0];
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
