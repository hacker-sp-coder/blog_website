// src/middlewares/multer.middleware.js
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Creates a temporary 'public/temp' folder at your root (make sure to create this folder!)
        cb(null, "./public/temp") 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage: storage })