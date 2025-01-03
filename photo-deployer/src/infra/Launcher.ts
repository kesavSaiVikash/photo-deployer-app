import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App();

const dataStack = new DataStack(app, "PhotoDeployerDataStack");

const lambdaStack = new LambdaStack(app, "PhotoDeployerLambdaStack", {
  photoDeployerBucket: dataStack.photoDeployerBucket,
});

new ApiStack(app, "PhotoDeployerApiStack", {
  photoDeployerLambdaIntegration: lambdaStack.photoDeployerLambdaIntegration,
});

new UiDeploymentStack(app, "PhotoDeployerUiDeploymentStack", {});
