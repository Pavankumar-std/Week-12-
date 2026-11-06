const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
const app=express();
app.use(helmet());
app.use(cors({origin:process.env.FRONTEND_URL||'http://localhost:5173',credentials:true}));
app.use(express.json({limit:'1mb'}));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:100}));
app.get('/api/health',(_req,res)=>res.json({status:'ok'}));
app.post('/api/posts/validate',(req,res)=>{
 const caption=typeof req.body.caption==='string'?req.body.caption.trim():'';
 if(!caption||caption.length>500)return res.status(400).json({error:'Caption required; max 500 characters.'});
 res.json({valid:true,caption});
});
app.use('/api/upload',require('./upload'));
module.exports=app;
