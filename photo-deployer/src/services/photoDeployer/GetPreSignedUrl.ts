import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export async function GetPreSignedUrl(
  event: APIGatewayProxyEvent,
  context: Context,
  s3Client: S3Client
): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || "{}");
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing fileName or fileType" }),
      };
    }

    const bucketName =
      process.env.BUCKET_NAME || "photo-deployer-photos-06b95d3423f5";

    const awsRegion = process.env.REGION || "ca-central-1";

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: fileType,
      ACL: "public-read",
    });

    // Generate the pre-signed URL
    const expiresIn = 3600; // URL expiration time in seconds (e.g., 1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    // Return the pre-signed URL in the response
    return {
      statusCode: 201,
      body: JSON.stringify({
        signedUrl,
        publicUrl: `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${fileName}`,
      }),
    };
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
