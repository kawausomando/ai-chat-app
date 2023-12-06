import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecrAssets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecrDeploy from 'cdk-ecr-deployment';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // App Runner
    const repository = new ecr.Repository(this, 'ai-chat-app-repo', {
      repositoryName: 'ai-chat-app-repo',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
    });

   const ecrAsset = new ecrAssets.DockerImageAsset(this, 'AppRunnerImage', {
      directory: '../app',
    });

    const development = new ecrDeploy.ECRDeployment(this, 'DeployChatApp', {
      src: new ecrDeploy.DockerImageName(ecrAsset.imageUri),
      dest: new ecrDeploy.DockerImageName(repository.repositoryUri),
    });

    // IAM
    const accessRole = new iam.Role(this, 'AppRunnerAccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
    })

    const secretsDB = secretsmanager.Secret.fromSecretNameV2(scope, 'AiChatAppDbSecret', 'ai-chat-app-secret')
  
    const appRunner = new apprunner.CfnService(this, 'ai-chat-app', {
        sourceConfiguration: {
          authenticationConfiguration: {
            accessRoleArn: accessRole.roleArn,
            // instanceRoleArn: instanceRole.roleArn,
          },
          autoDeploymentsEnabled: false,
          imageRepository: {
            imageIdentifier: repository.repositoryUriForTag('latest'),
            imageRepositoryType: 'ECR',
            imageConfiguration: {
              port: '3000',
              runtimeEnvironmentVariables: [
                {
                  name: 'OPENAI_API_KEY',
                  value: secretsDB.secretValueFromJson('host').toString(),
                },
              ]
            }
          },
        },
      },
    );
  }
}
