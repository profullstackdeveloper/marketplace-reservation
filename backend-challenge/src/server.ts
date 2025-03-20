import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import Paths from '@src/common/Paths';
import ENV from '@src/common/ENV';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/route-errors';
import { NodeEnvs } from '@src/common/constants';
import router from './api/routes';

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

if (ENV.NodeEnv === NodeEnvs.Production) {
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.use('/health', (req, res) => {
  res.json(`Server: ${new Date().getTime()}`)
})
app.use(Paths.Base, router);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

// Only start the server if we're not in test mode
if (ENV.NodeEnv !== 'test') {
  const SERVER_START_MSG = ('Express server started on port: ' + ENV.Port.toString());
  app.listen(ENV.Port, () => logger.info(SERVER_START_MSG));
}

export default app;