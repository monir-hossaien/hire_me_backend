import { Request } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const storage: StorageEngine = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

// 2. Add types to fileFilter parameters
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOCX files are allowed!'));
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter,
});

// Use UploadApiResponse for the Cloudinary return type
export const fileUpload = async (filePath: string, folder: string): Promise<UploadApiResponse> => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: "auto"
        });
        return result;
    } catch (err: any) {
        throw new Error("File upload to Cloudinary failed!");
    }
};

export const deleteFile = async (publicId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

        return result.result === "ok"
            ? { statusCode: 200, message: "Deleted successfully" }
            : { statusCode: 400, message: "Failed to delete" };
    } catch (error: unknown) {
        let errorMessage = "An unexpected error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            statusCode: 500,
            message: "Something went wrong!",
            error: errorMessage
        };
    }
};