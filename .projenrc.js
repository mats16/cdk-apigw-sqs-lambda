const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.67.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-apigw-sqs-timestream',
  description: 'Example CDK app for API Gateway with SQS and Timestream',
  deps: [
    '@aws-lambda-powertools/logger@1.6.0',
    '@aws-lambda-powertools/metrics@1.6.0',
    '@aws-lambda-powertools/tracer@1.6.0',
    '@types/aws-lambda',
  ],
  devDeps: [
  ],
  tsconfig: {
    compilerOptions: {
      noUnusedLocals: false,
      noUnusedParameters: false,
    },
  },
  depsUpgrade: false,
});
project.synth();
