import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './database.config';

require('dotenv/config');

export const dataSource = new DataSource(databaseConfig() as DataSourceOptions);
