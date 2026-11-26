import { cloudinaryClient } from '../config/cloudinary.js';

export const uploadController = {
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        // Return simulated sample URL if upload was text / placeholder
        return res.status(200).json({
          success: true,
          url: req.body.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
        });
      }

      // If Cloudinary credentials are provided, stream upload
      if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== '123456789') {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResponse = await cloudinaryClient.uploader.upload(dataURI, {
          folder: 'nammafix/issues',
          resource_type: 'image',
        });
        return res.status(200).json({
          success: true,
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
        });
      }

      // Local Data URI fallback for development
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      return res.status(200).json({
        success: true,
        url: dataURI,
      });
    } catch (err) {
      next(err);
    }
  },
};
