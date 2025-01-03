import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import {
  Bucket,
  BucketAccessControl,
  HttpMethods,
  IBucket,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";

export class DataStack extends Stack {
  public readonly photoDeployerBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.photoDeployerBucket = new Bucket(this, "PhotoDeployerBucket", {
      bucketName: `photo-deployer-photos-${suffix}`,

      cors: [
        {
          allowedMethods: [
            HttpMethods.HEAD,
            HttpMethods.GET,
            HttpMethods.PUT,
            HttpMethods.POST,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],

      objectOwnership: ObjectOwnership.OBJECT_WRITER,

      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    new CfnOutput(this, "PhotoDeployerBucketName", {
      value: this.photoDeployerBucket.bucketName,
    });
  }
}
