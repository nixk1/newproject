import { WebSocket,WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {jwtsecret} from '@repo/backend-common/config';
import {prismaClient} from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });
interface User{
  userId:string,
  room:string[],
  ws:WebSocket
}
const users:User[]=[];
function checkuser(token:string): string|null{
  try{
      const decode = jwt.verify(token, jwtsecret);
    if(typeof decode=="string"){
      return null;
    }

    if(!decode||!decode.userId){
      return null;
    }
    return decode.userId;
  }
  catch(e){
    return null;
  }
    
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token')||"";
  const userId=checkuser(token);
  if(!userId){
    ws.close();
    return null;
  }
  users.push({
    userId,
    room:[],
    ws
  })
  ws.on('message',async function message(data) {
    const parsedata=JSON.parse(data as unknown as string);
    if(parsedata.type==="join_room"){
      const user=users.find(x=>x.ws===ws);
      user?.room.push(parsedata.roomid);

    }
    if(parsedata.type==="leave_room"){
      const user=users.find(x=>x.ws===ws);
      if(!user){
        return;
      }
      user.room=user?.room.filter(x=>x===parsedata);
    }

    if(parsedata.type==="chat"){
      const RoomId=parsedata.roomId;
      const message=parsedata.message;

       await prismaClient.chat.create({
            data:{
                RoomId,
                message,
                userId

            }
        });


      users.forEach(users => {
        if(users.room.includes(RoomId)){
          users.ws.send(JSON.stringify({
            type:"chat",
            message:message,
            RoomId
          }))
        }
      });
    }
  });

  ws.send('something');
});
