import express from 'express';
import uniqid from 'uniqid';
import compression from 'compression';
import logger from '../logger.mjs';
import constants from '../constants.mjs';
import { register, prometheusExpressMiddleware } from '../prometheus.mjs';

const MODULE_NAME = 'WEBUI';

const listenPort = constants.webuiListenPort;

const initWebUI = () => new Promise((resolve) => {
  const app = express();

  logger.verbose(`${MODULE_NAME}: Initializing`);

  app.use(compression());
  app.use((req, res, next) => {
    res.locals.traceId = uniqid();
    res.locals.requestStartTime = new Date();
    next();
  });

  logger.debug(`${MODULE_NAME}: Registering prometheus middleware`);

  app.use(prometheusExpressMiddleware);
  app.use('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  app
    .listen(listenPort, () => {
      logger.info(`${MODULE_NAME} 9FAC0825: Listening HTTP request`, {
        listenPort
      });

      resolve();
    })
    .on('error', (e) => {
      logger.warn(`${MODULE_NAME} 28C108C7: Exception on listening`, {
        eCode: e.code,
        eMessage: e.message || e.toString()
      });

      process.exit(1);
    });
});

export {
  listenPort,
  initWebUI
};
