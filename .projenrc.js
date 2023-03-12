const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.67.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-apigw-sqs-lambda',
  description: 'Example CDK app for API Gateway with SQS and Lambda',
  deps: [
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
