import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  ResourceOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  photoDeployerLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  private api: RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.initializeApi(props);

    this.addPhotoDeployerResource(props.photoDeployerLambdaIntegration);
  }

  private initializeApi(props: ApiStackProps) {
    this.api = new RestApi(this, "PhotoDeployerApi");
  }

  private addPhotoDeployerResource(
    photoDeployerLambdaIntegration: LambdaIntegration
  ) {
    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    };

    const photoDeployerResource = this.api.root.addResource(
      "photo-deployer",
      optionsWithCors
    );

    photoDeployerResource.addMethod("POST", photoDeployerLambdaIntegration, {
      authorizationType: AuthorizationType.NONE,
    });
  }
}
