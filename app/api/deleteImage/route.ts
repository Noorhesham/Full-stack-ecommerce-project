// pages/api/cloudinary/delete.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: any, res: any) {
  if (req.method === 'DELETE') {
    const { publicId } = req.query;

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === 'ok') {
        return res.status(200).json({ success: true, result });
      }
      return res.status(400).json({ success: false, error: 'Failed to delete image' });
    } catch (error:any) {
      console.error('Error deleting image from Cloudinary:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
