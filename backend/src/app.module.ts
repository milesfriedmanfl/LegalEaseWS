import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './search/search.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Load .env config globally
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            username: process.env.MYSQL_APP_USER,
            password: process.env.MYSQL_APP_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            autoLoadModels: true,
            synchronize: process.env.DB_SYNC === 'true', // Use only in development to auto-sync models to DB
        }),
        SearchModule,
    ],
})
export class AppModule {}
