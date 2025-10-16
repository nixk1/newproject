import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {jwtsecret} from '@repo/backend-common/config';

const wss = new WebSocketServer({ port: 8080 });


function checkuser(token:string): string|null{
    const decode = jwt.verify(token, jwtsecret);
    if(typeof decode=="string"){
      return null;
    }

    if(!decode||!decode.userId){
      return null;
    }
    return decode.userId;
}

wss.on('connection', function connection(ws, request) {
  ws.on('error', console.error);

  const url = request.url;
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token')||"";
  const userAuthenticated=checkuser(token);
  if(!userAuthenticated){
    ws.close();
  }
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});
