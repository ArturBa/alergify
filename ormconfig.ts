/* eslint-disable import/first */
process.env.NODE_CONFIG_DIR = `${__dirname}/src/configs`;

import { dbConnection } from './src/databases/index';

export default dbConnection;
