import { APIGatewayProxyResult } from "aws-lambda";

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {};
  }
  arg.headers["Access-Control-Allow-Origin"] = "*";
  arg.headers["Access-Control-Allow-Methods"] = "*";
  arg.headers["Access-Control-Allow-Headers"] = "*";
  // arg.headers["Access-Control-Allow-Credentials"] = true; 
}
