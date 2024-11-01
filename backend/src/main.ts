import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'debug', 'error', 'warn'], // Ensure all log levels are enabled
    });

    // Set up global validation pipe with error logging
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => {
                const logger = new Logger('ValidationPipe');
                logger.error('Validation failed:', JSON.stringify(errors));
                return errors;
            },
            transform: true, // Enable transformation of payloads to DTOs
            whitelist: true, // Automatically strip non-whitelisted properties
        }),
    );

    // Configure security features
    // const oneYearInSeconds = 60 * 60 * 24 * 365;
    // app.use(
    //     helmet({
    //         // Here in case HTML is returned and displayed from the Wiki API, to prevent XSS attacks
    //         contentSecurityPolicy: {
    //             directives: {
    //                 defaultSrc: ["'self'"], // Allow resources only from the same origin
    //                 scriptSrc: ["'self'"], // Allow scripts only from the same origin
    //                 objectSrc: ["'none'"], // Disallow plugins or external objects
    //                 styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from the same origin or inline if needed
    //                 imgSrc: ["'self'", 'https://*.wikipedia.org'], // Allow images from Wikipedia if needed
    //                 connectSrc: ["'self'", 'https://en.wikipedia.org'], // Allow connections to Wikipedia's API
    //                 upgradeInsecureRequests: [], // Force all requests for embedded resources to be HTTPS
    //             },
    //         },
    //         // Prevents the API from being embedded in iframes. Clickjacking isn't a huge risk for this kind of app, but doesn't hurt.
    //         frameguard: { action: 'deny' },
    //         // Ensures clients only access the API over HTTPS in production
    //         hsts:
    //             process.env.NODE_ENV === 'production'
    //                 ? { maxAge: oneYearInSeconds, includeSubDomains: true }
    //                 : false,
    //         noSniff: true, // Prevents MIME-type sniffing, preventing potentail attack if the Wiki API were compromised and returned something that could be executed
    //         permittedCrossDomainPolicies: { permittedPolicies: 'none' }, // Disallows external apps from loading the API
    //     }),
    // );

    await app.listen(process.env.SERVER_PORT || 3000);
}

bootstrap();
