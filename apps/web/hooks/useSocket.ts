import {useEffect,useState} from "react";
import { WEBSOCKET_URL } from "../app/config";

export function useSocket(){
    const [loading, setloading]=useState(true);
    const [socket ,setsocket]=useState<WebSocket>();

    useEffect(()=>{
       const ws= new WebSocket(`${WEBSOCKET_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NjVhYTMxNS04YWZiLTQxNGEtOGUyZC1jYmRjYjA0ZTMwOTYiLCJpYXQiOjE3NDU4NTM1OTl9.YIrYtS8pPTA8n9wdCJkT0zUrlbgRlZBrqM5EKoEWmWY`);
       ws.onopen=()=>{
         setloading(false);
         setsocket(ws);
       }
    },[]);

    return {
        socket,
        loading
    }
}