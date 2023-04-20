import { createLogger, format, transports } from 'winston';
import WinstonCloudwatch from 'winston-cloudwatch';

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new WinstonCloudwatch({
            level: 'info',
            logGroupName: 'BucketCTF',
            logStreamName: 'info',
            awsRegion: 'us-east-1',
            awsOptions: {
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SECRET_KEY!,
                },
            },
        }),
        new transports.Console(),
    ],
});

export { logger };
