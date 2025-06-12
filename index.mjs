import 'dotenv/config';
import logger from './lib/logger.mjs';
import { initWebUI } from './lib/webui/index.mjs';
import './lib/model/feeds.mjs';
import './lib/scheduler.mjs';

const MODULE_NAME = 'MAIN';

logger.info(`${MODULE_NAME} 3CB79FBE: Starting`);
await initWebUI();
