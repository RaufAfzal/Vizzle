import { v2 as cloudinary } from 'cloudinary';
import { error } from 'console';
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         console.log("Local file path is", localFilePath)
//         if (!localFilePath) return null

//         //upload file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         fs.unlinkSync(localFilePath)   //remove the locally saved file in case of successfull upload
//         return response
//     } catch (err) {
//         console.log("It is comming here", err)
//         fs.unlinkSync(localFilePath)   //remove the locally saved file in case of errors
//         return null
//     }
// }

const streamUploadToCloudinary = (localFilePath) => {
    return new Promise((resolve, reject) => {

        const fileStream = fs.createReadStream(localFilePath);              //create Read Steam for the local file

        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.log("Cloudinary stream uploaded error", error);
                    fs.unlink(localFilePath, (err) => {
                        if (err) {
                            console.error("Error while removing local file", err)
                        } else {
                            console.log("Local file removed after upload error")
                        }
                    })
                    return reject(error)
                }
                fs.unlink(localFilePath, (err) => {
                    if (err) {
                        console.error("Error while removing local file", err)
                    } else {
                        console.log("Local file removed after successfull upload")
                    }
                })
                // console.log("Result here will be", result)
                resolve(result)
            }
        )
        fileStream.pipe(uploadStream)     //pipe file stream to cloudinary upload stream 

        fileStream.on("error", (err) => {
            console.log("File stream error", err)
            fs.unlink(localFilePath, (err) => {
                if (err) {
                    console.error("Error removing local file", err);
                } else {
                    console.log("Local file removed after stream error")
                }
            })
            reject(err)
        })

    })
}

export { streamUploadToCloudinary }