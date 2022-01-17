import * as superagent from 'superagent';
import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  Logger,
} from '@nestjs/common';
import * as Joi from 'joi';

const CallsResponseSchema = Joi.object({
  results: Joi.array().items(
    Joi.object({
      status: Joi.number().min(100).max(599),
      data: Joi.any().required(),
    }),
  ),
  systemStatusMessages: Joi.array().optional(),
});

export async function request(
  method: string,
  url: string,
  data: Record<string, unknown> = {},
  token: string,
  requestId: string | string[],
  api = 'https://login.schulmanager-online.de/api',
) {
  const logger = new Logger('request');
  logger.log({
    id: requestId,
    type: 'request',
  });
  let res = undefined;
  try {
    res = await superagent(method, api + url)
      .timeout(6000)
      .ok((_) => true)
      .auth(token, { type: 'bearer' })
      .send(data);
  } catch (e) {
    if (e.code === 'ECONNABORTED' && e.errno == 'ETIME') {
      logger.error({
        id: requestId,
        status: 504,
        path: url,
        method: method,
        data: data,
      });
      throw new GatewayTimeoutException();
    } else {
      logger.error({
        id: requestId,
        exception: e,
        path: url,
        method: method,
        data: data,
      });
      throw e;
    }
  }
  if (res.statusCode >= 400) {
    logger.error({ id: requestId, status: res.statusCode, body: res.body });
    throw new HttpException(res.body, res.statusCode);
  }
  return res;
}

export async function calls(
  module: string,
  endpoint: string,
  parameters: Record<string, unknown>,
  token: string,
  requestId: string | string[],
  api = 'https://login.schulmanager-online.de/api',
) {
  const logger = new Logger('calls');
  logger.log({ id: requestId });
  const res = await request(
    'POST',
    '/calls',
    {
      bundleVersion: '138baca5f4c6fb8d92ce',
      requests: [
        {
          moduleName: module,
          endpointName: endpoint,
          parameters: parameters === {} ? null : parameters,
        },
      ],
    },
    token,
    requestId,
    api,
  );

  if (!res.body) {
    logger.error({ id: requestId, status: 502 });
    throw new BadGatewayException();
  }
  try {
    await CallsResponseSchema.validateAsync(res.body);
  } catch (e) {
    if (res.body.results[0] && res.body.results[0].status >= 400) {
      logger.error({
        id: requestId,
        status: res.body.results[0].status,
        error: res.body.results[0].error || ' ',
        body: res.body,
      });
      throw new HttpException(
        res.body.results[0].error,
        res.body.results[0].status || ' ',
      );
    }
    logger.error({
      id: requestId,
      status: 502,
      error: e.details.map((x) => x.message),
      body: res.body,
    });
    throw new BadGatewayException();
  }

  if (parseInt(res.body.results[0].status) >= 400) {
    logger.error({ id: requestId, status: res.statusCode, body: res.body });
    throw new HttpException(res.body, res.statusCode);
  }
  return { body: res.body.results[0].data, res };
}

export async function uploadFile(
  f: Express.Multer.File,
  token: string,
  api = 'https://login.schulmanager-online.de/api',
) {
  const res = await superagent
    .post(`${api}/upload-file`)
    .query({
      scope: 'messenger',
      extension: f.originalname.split('.')[0],
      size: f.size,
      type: f.mimetype,
      name: f.originalname,
    })
    .auth(token, { type: 'bearer' })
    .set('Content-Type', 'application/octet-stream')
    .send(f.buffer);
  return res.body;
}
