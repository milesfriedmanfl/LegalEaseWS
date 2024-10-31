import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LogParamsMiddleware implements NestMiddleware {
    private readonly logger = new Logger('LogParamsMiddleware');

    use(req: Request, res: Response, next: () => void) {
        this.logger.log(`Request URL: ${req.url}`);
        this.logger.log(`Request Body: ${JSON.stringify(req.body)}`);
        this.logger.log(`Request Headers: ${JSON.stringify(req.headers)}`);
        this.logger.log(
            `Request Query Params: ${JSON.stringify((req as any).query)}`,
        );
        next();
    }
}
