import React, { useState } from "react";
import { DataService } from "../services/DataService";
import logo from "../assets/logo.png";
import architectureDiagram from "../assets/aws-architecture-diagram.jpg";
import codeIcon from "../assets/code-icon.png";

const FileUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dataService = new DataService();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setUploadUrl(null); // Reset the upload URL
      setError(null); // Reset any previous errors

      // Generate an image preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await dataService.uploadPhoto(file);
      setUploadUrl(uploadedUrl);
      setImagePreview(null); // Reset image preview after upload
    } catch (err) {
      setError("Failed to upload the file. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 sm:p-12">
      <div className="max-w-2xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 space-y-6">
        {/* Logo and Heading Section (Logo next to App Name) */}
        <div className="flex items-center justify-start mb-6">
          <img
            src={logo}
            alt="Photo Deployer Logo"
            className="h-16 w-auto mr-4"
          />
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
              Photo Deployer
            </h1>
            <p className="text-lg sm:text-xl text-gray-400">
              Effortlessly upload your photos and deploy them to AWS, receiving
              a dedicated URL for development use.
            </p>
          </div>
        </div>

        {/* Icon to Open AWS Architecture Modal */}
        <div className="text-center mb-6">
          <button
            onClick={handleOpenModal}
            className="flex flex-col items-center text-white hover:text-gray-300 transition duration-300"
          >
            <img
              src={codeIcon}
              alt="Code Icon"
              className="h-12 sm:h-14 w-auto mb-3"
            />
            <span className="text-sm sm:text-base font-semibold">
              Click to view AWS Architecture
            </span>
          </button>
        </div>

        {/* File Upload Section */}
        <div className="w-full mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-4 bg-gray-700 border-2 border-gray-600 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>

        {/* Image Preview Section */}
        {imagePreview && (
          <div className="flex justify-center mb-6">
            <img
              src={imagePreview}
              alt="Selected Preview"
              className="w-full max-w-[300px] sm:max-w-[350px] rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Error Message Section */}
        {error && (
          <div className="p-4 bg-red-600 text-white text-lg rounded-xl shadow-md mb-6">
            {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleFileUpload}
          disabled={isUploading}
          className={`w-full py-4 text-lg font-semibold text-white rounded-xl shadow-lg transition duration-300 ${
            isUploading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
        </button>

        {/* Success Message Section */}
        {uploadUrl && (
          <div className="mt-6 bg-gray-700 p-6 rounded-xl shadow-md">
            <p className="text-green-400 font-semibold text-lg mb-4">
              Upload Successful!
            </p>
            <p className="text-white text-sm break-all">{uploadUrl}</p>
            <a
              href={uploadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              View the Uploaded Photo
            </a>
          </div>
        )}

        {/* Modal for AWS Architecture */}
        {/* Modal for AWS Architecture */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 space-y-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-semibold text-gray-800">
                  AWS Architecture Overview
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-2xl text-gray-600 hover:text-gray-800"
                >
                  &times;
                </button>
              </div>

              {/* Architecture Diagram */}
              <div className="flex justify-center mb-4">
                <img
                  src={architectureDiagram}
                  alt="AWS Architecture Diagram"
                  className="w-full max-w-[600px] rounded-md shadow-md"
                />
              </div>

              {/* Explanation with Scroll */}
              <div className="text-lg text-gray-500 max-h-96 overflow-y-auto">
                <p>
                  The app uses a modern, serverless architecture built on AWS to
                  enable seamless photo uploads and deployment. Here's a
                  breakdown of the core components and flow:
                </p>
                <ul className="mt-4 space-y-2 list-disc pl-6">
                  <li>
                    <strong>AWS Lambda:</strong>
                    <p>
                      Powers the backend logic, handling the photo upload
                      process and generating responses, ensuring that the system
                      operates without server management.
                    </p>
                  </li>
                  <li>
                    <strong>API Gateway:</strong>
                    <p>
                      Routes HTTP requests from the client to the corresponding
                      AWS Lambda functions. It acts as a bridge between the
                      front-end and the serverless backend.
                    </p>
                  </li>
                  <li>
                    <strong>AWS S3 (Simple Storage Service):</strong>
                    <p>
                      A public upload bucket is used to store photos. When users
                      upload photos, they are securely stored in S3, and the
                      application generates public URLs for access. The S3
                      bucket allows for scalable storage and automatic
                      management of file access.
                    </p>
                  </li>
                  <li>
                    <strong>Pre-signed URLs:</strong>
                    <p>
                      To enhance security and control over file uploads, the app
                      uses AWS pre-signed URLs. The Lambda function generates
                      these pre-signed URLs, which are sent to the front-end.
                      The front-end then uses these pre-signed URLs to directly
                      upload images to S3, eliminating the need for the photo to
                      pass through the server, making the process more efficient
                      and secure.
                    </p>
                  </li>
                  <li>
                    <strong>AWS IAM (Identity and Access Management):</strong>
                    <p>
                      Manages permissions for the app’s AWS resources, ensuring
                      that only authorized actions can be performed on S3 and
                      Lambda functions, and that the correct access controls are
                      in place.
                    </p>
                  </li>
                  <li>
                    <strong>Scalability & Security:</strong>
                    <p>
                      By leveraging serverless technologies and pre-signed URLs,
                      the architecture is scalable and secure. AWS automatically
                      handles scaling and provides a secure mechanism to manage
                      photo uploads directly to S3, reducing the load on the
                      backend.
                    </p>
                  </li>
                  <li>
                    <strong>S3 URL Generation:</strong>
                    <p>
                      After a successful upload, the Lambda function generates a
                      URL pointing to the photo in the S3 bucket, which can be
                      shared or used as needed. The use of pre-signed URLs
                      ensures secure access while maintaining a simple and
                      effective process.
                    </p>
                  </li>
                </ul>
                <p className="mt-4">
                  This architecture offers a secure, scalable, and efficient
                  solution for handling photo uploads in the cloud while
                  leveraging the best practices for AWS services and serverless
                  computing.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPage;
