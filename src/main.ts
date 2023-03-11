import { App } from 'aws-cdk-lib';
import { MyStack } from './my-stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'cdk-apigw-sqs-timestream-dev', { env: devEnv });
// new MyStack(app, 'cdk-apigw-sqs-timestream-prod', { env: prodEnv });

app.synth();