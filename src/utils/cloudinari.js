import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

//     const response = async function uploadVideos (){
//         try {
//             const result = await new Promise((resolve,reject)=>{
//                 cloudinary.uploader.upload_large(localFilePath,{
//                     resource_type : "video"
//                 },
//                 (error,result)=>{
//                     if(error){
//                         reject(error)
//                     }
//                     resolve(result)
//                 }
//             )
//         })
//         console.log(result);
        
//     } catch (error) {
//         console.log(error); 
        
//     }
// }
// console.log("Uploading:", localFilePath); 
// response()
// console.log("✅ Upload Success:", response);


    const response = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto", // let cloudinary detect video
        timeout: 600000,       // 10 min timeout for large video
      }
    );


    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;

  } catch (error) {

    console.error("❌ Cloudinary upload failed FULL ERROR:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};


export { uploadOnCloudinary };
