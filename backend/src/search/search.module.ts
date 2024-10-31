import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import { SearchHistory } from './search.model';
import { LogParamsMiddleware } from 'src/log-params.middleware';

@Module({
    imports: [
        HttpModule.register({ timeout: 10000 }),
        SequelizeModule.forFeature([SearchHistory]), // Register the model with Sequelize
    ],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LogParamsMiddleware).forRoutes(SearchController);
    }
}
