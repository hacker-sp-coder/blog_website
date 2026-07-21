// src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// You will need to get these keys from a free Cloudinary account and add them to your .env file
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // File has been uploaded successfully, now delete it from our local server
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // If upload fails, remove the locally saved temporary file
        fs.unlinkSync(localFilePath); 
        return null;
    }
}