import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { addCorsHeader } from "../Utils";
import { JsonError, MissingFieldError } from "../Validator";
import { GetPreSignedUrl } from "./GetPreSignedUrl";
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case "POST":
        const postResponse = await GetPreSignedUrl(event, context, s3Client);
        response = postResponse;
        break;

      default:
        break;
    }

    addCorsHeader(response);

    return response;
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }
    return {
      statusCode: 500,
      body: error.message,
    };
  }
}

export { handler };
