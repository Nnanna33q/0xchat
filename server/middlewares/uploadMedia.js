import cloudinary from 'cloudinary';
import { User } from '../models/userModel.js';

function uploadBuffer(buffer, resourceType) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream({
            resource_type: resourceType,
            folder: 'media'
        }, (err, result) => {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
        uploadStream.end(buffer);
    })
}

export default async function uploadMedia(req, res) {
    try {
        const { buffer } = req.file;
        const resourceType = req.file.mimetype.includes('image') ? 'image' : 'video';
        const result = await uploadBuffer(buffer, resourceType);
        console.log(result.secure_url);
        res.status(201).json({ success: true, url: result.secure_url });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, errorMessage: e.message });
    }
}

export async function uploadAvatar(req, res) {
    try {
        const { buffer } = req.file;
        const resourceType = 'image';
        const result = await uploadBuffer(buffer, resourceType);
        const avatar = result.secure_url;
        await User.updateOne({ address: req.session._address }, { avatar: avatar });
        res.status(201).json({ success: true, url: result.secure_url });
    } catch(e) {
        console.error(e);
        res.status(500).json({ success: false, errorMessage: e.message });
    }
}