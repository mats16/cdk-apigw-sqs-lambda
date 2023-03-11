import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    /** API Gateway からメッセージを受け取るキュー */
    const queue = new sqs.Queue(this, 'Queue', {
      encryption: sqs.QueueEncryption.KMS_MANAGED,
    });

    /** API Gateway が SQS にアクセスする際に利用する IAM Role */
    const integrationRole = new iam.Role(this, 'IntegrationRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    /** API Gateway にキューへの書き込み権限を付与 */
    queue.grantSendMessages(integrationRole);

    /** API Gateway と SQS の連携設定 */
    const sendMessageIntegration = new apigw.AwsIntegration({
      service: 'sqs',
      path: `${process.env.CDK_DEFAULT_ACCOUNT}/${queue.queueName}`,
      integrationHttpMethod: 'POST',
      options: {
        credentialsRole: integrationRole,
        requestParameters: {
          'integration.request.header.Content-Type': '\'application/x-www-form-urlencoded\'',
        },
        requestTemplates: {
          'application/json': 'Action=SendMessage&MessageBody=$input.body',
        },
        integrationResponses: [
          {
            statusCode: '200',
          },
          {
            statusCode: '400',
          },
          {
            statusCode: '500',
          },
        ],
      },
    });

    /** REST API */
    const api = new apigw.RestApi(this, 'API', {
      restApiName: cdk.Aws.STACK_NAME,
      endpointTypes: [apigw.EndpointType.REGIONAL],
      deployOptions: {
        tracingEnabled: true,
      },
    });

    /** イベントを受ける Path */
    const metrics = api.root.addResource('metrics');
    metrics.addMethod('POST', sendMessageIntegration, {
      methodResponses: [
        {
          statusCode: '400',
        },
        {
          statusCode: '200',
        },
        {
          statusCode: '500',
        },
      ],
    });

    /** 非同期で SQS Message を処理する Lambda Function */
    const queueProcessor = new NodejsFunction(this, 'QueueProcessor', {
      description: 'Message processor for Slack App',
      entry: './src/functions/queue-processor.ts',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(30), // Queue visibility timeout
      environment: {
      },
      initialPolicy: [
      ],
      events: [
        new SqsEventSource(queue, {
          maxConcurrency: 10,
          batchSize: 10,
        }),
      ],
      tracing: lambda.Tracing.ACTIVE,
    });

  }
}
