import {
  Counter,
  Gauge,
  Histogram,
  collectDefaultMetrics,
  register
} from 'prom-client';

import urlJoin from 'url-join';
import onFinished from 'on-finished';

import constants from './constants.mjs';

register.setDefaultLabels({
  appName: constants.appName.toLowerCase()
});

collectDefaultMetrics({
  register
});

new Gauge({
  name: 'app_up',
  help: 'Always 1 on running.'
}).set(1);

new Gauge({
  name: 'app_info',
  help: 'Application information.',
  labelNames: [
    'version',
    'copyright',
    'webuiListenPort',
    'pid',
    'ppid'
  ]
}).set({
  version: constants.appVersion,
  copyright: constants.copyright,
  webuiListenPort: constants.webuiListenPort,
  pid: process.pid,
  ppid: process.ppid
}, 1);

// eslint-disable-next-line no-new
new Gauge({
  name: 'uptime',
  help: 'Application uptime in seconds.',
  labelNames: ['app'],
  collect () {
    this.set(process.uptime());
  }
});

const httpRequestCounter = new Counter({
  name: 'http_request_count',
  help: 'Count HTTP request.',
  labelNames: [
    'method',
    'route',
    'code'
  ]
});

const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds.',
  labelNames: [
    'method',
    'route',
    'code'
  ]
});

const normalizeUrl = (url) => url
  .replace(/\?.*$/, '')
  .replace(/^\/metrics\/.*$/, '/metrics');

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const prometheusExpressMiddleware = (req, res, next) => {
  onFinished(res, (e, resOnFinished) => {
    if (resOnFinished.statusCode === 404) return;

    httpRequestCounter
      .labels({
        method: req.method,
        route: normalizeUrl(urlJoin(req.baseUrl || '/', req.url || '')),
        code: resOnFinished.statusCode
      })
      .inc();

    httpRequestDurationSeconds
      .labels({
        method: req.method,
        route: normalizeUrl(urlJoin(req.baseUrl || '/', req.url || '')),
        code: resOnFinished.statusCode
      })
      .observe((Number(new Date() - res.locals.requestStartTime)) / 1000);
  });

  next();
};

export {
  register,
  prometheusExpressMiddleware
};
