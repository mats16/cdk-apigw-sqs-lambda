import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { SQSHandler } from 'aws-lambda';

const region = process.env.AWS_REGION;

const logging = new Logger();
const tracer = new Tracer();

/** SQS を処理する Lambda Handler  */
export const handler: SQSHandler = async (event, context, callback) => {

  event.Records.map(record => {
    console.log(record.body);
  });

};