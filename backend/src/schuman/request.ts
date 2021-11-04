import * as superagent from 'superagent';
import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  Logger,
} from '@nestjs/common';
import * as Joi from 'joi';

const CallsResponseSchema = Joi.object({
  results: [
    {
      status: Joi.number().min(100).max(599),
      data: Joi.object(),
    },
  ],
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
  logger.log({ id: requestId });
  let res = undefined;
  try {
    res = await superagent(method, api + url)
      .timeout(5000)
      .ok((_) => true)
      .auth(token, { type: 'bearer' })
      .send(data);
  } catch (e) {
    if (e.code === 'ECONNABORTED' && e.errno == 'ETIME') {
      logger.error({ id: requestId, status: 504 });
      throw new GatewayTimeoutException();
    } else {
      logger.error({ id: requestId, exception: e });
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
      bundleVersion: '28287e3340013f090349',
      requests: [
        {
          moduleName: module,
          endpointName: endpoint,
          parameters: parameters,
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
  if (!(await CallsResponseSchema.validateAsync(res.body))) {
    logger.error({ id: requestId, status: 502, body: res.body });
    throw new BadGatewayException();
  }

  if (res.body.results[0].status >= 400) {
    logger.error({ id: requestId, status: res.statusCode, body: res.body });
    throw new HttpException(res.body, res.statusCode);
  }
  return { body: res.body.results[0].data, res };
}
