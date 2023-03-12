import { SQSHandler } from 'aws-lambda';

const region = process.env.AWS_REGION;

/** SQS を処理する Lambda Handler  */
export const handler: SQSHandler = async (event, context, callback) => {

  event.Records.map(record => {
    console.log(record.body);
  });

};