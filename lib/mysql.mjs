import MySQL from 'mysql-client-w-metrics';
import logger from './logger.mjs';

const MODULE_NAME = 'mysql';

/**
 * @type {import('mysql2').PoolOptions}
 */
const options = {
  socketPath: process.env.MYSQL_SOCKET_PATH,
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
};

const mysql = new MySQL(options);
const pool = mysql.pool;
const poolCallbackStyle = mysql.poolCallbackStyle;

logger.debug(`${MODULE_NAME} 6709783D: Database pool ready to use`, {
  poolId: mysql.poolId
});

export {
  pool,
  poolCallbackStyle,
  options
};
