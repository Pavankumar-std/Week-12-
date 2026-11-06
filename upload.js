const express=require('express'),multer=require('multer'),cloudinary=require('cloudinary').v2;
const router=express.Router();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:10*1024*1024},fileFilter:(_r,f,cb)=>{
 const ok=['image/jpeg','image/png','image/webp','video/mp4'].includes(f.mimetype); cb(ok?null:new Error('Unsupported file type'),ok);
}});
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
router.post('/media',upload.single('file'),async(req,res)=>{
 if(!req.file)return res.status(400).json({error:'Select an image or MP4 video.'});
 if(!process.env.CLOUDINARY_CLOUD_NAME)return res.status(503).json({error:'Configure Cloudinary in .env.'});
 try{
  const data=`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const result=await cloudinary.uploader.upload(data,{resource_type:req.file.mimetype.startsWith('video/')?'video':'image',folder:'week12-social-platform'});
  res.status(201).json({url:result.secure_url,publicId:result.public_id});
 }catch(e){res.status(502).json({error:'Cloudinary upload failed.'})}
});
module.exports=router;
