require('dotenv').config();
const http=require('http');
const {Server}=require('socket.io');
const app=require('./app');
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:process.env.FRONTEND_URL||'http://localhost:5173',credentials:true}});
// Demo only: add socket authentication and room authorization before production.
io.on('connection',socket=>{
 socket.on('join-user',id=>{if(typeof id==='string'&&id.length<=80)socket.join(`user-${id}`)});
 socket.on('join-chat',id=>{if(typeof id==='string'&&id.length<=80)socket.join(`chat-${id}`)});
 socket.on('send-message',data=>{
  const {chatId,content,sender,receiverId}=data||{};
  if(![chatId,content,sender,receiverId].every(v=>typeof v==='string')||!content.trim()||content.length>2000)return;
  const message={chatId,content:content.trim(),sender,timestamp:new Date().toISOString()};
  socket.to(`chat-${chatId}`).emit('new-message',message);
  io.to(`user-${receiverId}`).emit('notification',{type:'new_message',from:sender,preview:content.slice(0,50)});
 });
 socket.on('typing',data=>{if(data&&typeof data.chatId==='string'&&typeof data.userId==='string')socket.to(`chat-${data.chatId}`).emit('user-typing',{userId:data.userId,isTyping:!!data.isTyping})});
});
server.listen(process.env.PORT||5000,()=>console.log('Week 12 server running'));
