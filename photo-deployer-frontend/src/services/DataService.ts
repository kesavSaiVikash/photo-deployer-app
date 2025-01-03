import { PhotoDeployerApiStack } from "../../../photo-deployer/outputs.json";

const photoDeployerUrl =
  PhotoDeployerApiStack.PhotoDeployerApiEndpoint3BDF35DC + "photo-deployer";

export class DataService {
  // Method to get a pre-signed URL from the backend
  private async getPreSignedUrl(
    fileName: string,
    fileType: string
  ): Promise<string> {
    const response = await fetch(`${photoDeployerUrl}`, {
      method: "POST",
      body: JSON.stringify({
        fileName: fileName,
        fileType: fileType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to get pre-signed URL: ${errorData.error || "Unknown error"}`
      );
    }

    const { signedUrl } = await response.json();
    return signedUrl;
  }

  // Method to upload the file to S3 using the pre-signed URL
  public async uploadPhoto(file: File): Promise<string> {
    try {
      // Step 1: Get a pre-signed URL from the backend
      const signedUrl = await this.getPreSignedUrl(file.name, file.type);

      console.log("Signed URL:", signedUrl);

      // Step 2: Upload the file directly to S3 using the pre-signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (uploadResponse.ok) {
        console.log("File uploaded successfully");
        const publicUrl = signedUrl.split("?")[0]; // Extract the public URL (remove query params)
        return publicUrl;
      } else {
        const errorData = await uploadResponse.json();
        throw new Error(
          `Failed to upload file: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error("Upload failed");
    }
  }
}
