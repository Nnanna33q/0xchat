export default function validateMedia(req, res, next) {
    try {
        if(req.file) {
            if(req.file.mimetype.includes('image/') || req.file.mimetype.includes('video/')) {
                if(req.file.size / 1000000 <= 100) {
                    next();
                } else {
                    throw 'Media size must not be over 100MB'
                }
            } else {
                throw 'Invalid media mimetype'
            }
        } else {
            throw 'File not found';
        }
    } catch(e) {
        console.error(e);
        res.status(400).json({ success: false, errorMessage: e });
    }
}