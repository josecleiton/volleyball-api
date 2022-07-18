require('dotenv/config');

import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from '../configs/database.config';

export const dataSource = new DataSource(databaseConfig() as DataSourceOptions);
