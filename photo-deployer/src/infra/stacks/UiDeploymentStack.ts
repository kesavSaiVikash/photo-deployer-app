// tbh

import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  AccessLevel,
  CachePolicy,
  Distribution,
} from "aws-cdk-lib/aws-cloudfront";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  HttpMethods,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { existsSync } from "fs";
import { join } from "path";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { getSuffixFromStack } from "../Utils";

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, "PhotoDeployerFrontend", {
      bucketName: `photo-deployer-ui-bucket-${suffix}`,
      websiteIndexDocument: "index.html"
    });

    const uiDir = join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "photo-deployer-frontend",
      "dist"
    );

    if (existsSync(uiDir)) {
      new BucketDeployment(this, "PhotoDeployerUiDeployment", {
        destinationBucket: deploymentBucket,
        sources: [Source.asset(uiDir)],
      });

      const s3Origin = S3BucketOrigin.withOriginAccessControl(
        deploymentBucket,
        {
          originAccessLevels: [AccessLevel.READ],
        }
      );

      const distribution = new Distribution(this, "PhotoDeployerDistribution", {
        defaultRootObject: "index.html",
        defaultBehavior: {
          origin: s3Origin,
        },

        errorResponses: [
          {
            httpStatus: 403,
            responsePagePath: "/index.html", // Serve index.html for non-existing routes
            responseHttpStatus: 200, // Treat as a successful response (200)
            ttl: Duration.minutes(5), // Cache for 5 minutes (can adjust as needed)
          },
        ],
      });

      new CfnOutput(this, "PhotoDeployerUiDeploymentS3Url", {
        value: distribution.distributionDomainName,
      });
    } else {
      console.warn("Ui directory not found: " + uiDir);
    }
  }
}
