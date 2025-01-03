import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  photoDeployerBucket: IBucket;
}

export class LambdaStack extends Stack {
  public readonly photoDeployerLambdaIntegration: LambdaIntegration;

  private photoDeployerLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.initializeLambda(props);

    this.addRoleToLambda(props);

    this.photoDeployerLambdaIntegration = this.lambdaIntegration();
  }

  private initializeLambda(props: LambdaStackProps) {
    this.photoDeployerLambda = new NodejsFunction(this, "PhotoDeployerLambda", {
      runtime: Runtime.NODEJS_LATEST,
      handler: "handler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "photoDeployer",
        "handler.ts"
      ),
      environment: {
        BUCKET_NAME: props.photoDeployerBucket.bucketName,
        REGION: this.region,
      },
    });
  }

  private addRoleToLambda(props: LambdaStackProps) {
    this.photoDeployerLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [`${props.photoDeployerBucket.bucketArn}/*`],
        actions: [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObjectAcl",
        ],
      })
    );
  }

  private lambdaIntegration(): LambdaIntegration {
    return new LambdaIntegration(this.photoDeployerLambda);
  }
}
