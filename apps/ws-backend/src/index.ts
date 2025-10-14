import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {jwtsecret} from './config';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
  ws.on('error', console.error);

  const url = request.url;
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token')||"";

  const decode = jwt.verify(token, jwtsecret);
  if(!decode || !(decode as JwtPayload).userId){
    wss.close();
    return;
  }

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});
