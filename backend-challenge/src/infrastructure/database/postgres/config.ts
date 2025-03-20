import { DataSourceOptions } from "typeorm";

export const PostgreOptions: DataSourceOptions = {
    type: 'postgres',
    name: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'postgres',
    entities: ["src/domain/models/**/*.entity.ts"],
    synchronize: true,
    logging: false,
    migrations: ['src/infrastructure/migrations/**/*.ts'],
}