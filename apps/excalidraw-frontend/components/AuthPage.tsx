"use client";

export function AuthPage({isSignin}:{isSignin:boolean}){
   return <div className="w-screen h-screen flex justify-center item-center">
    <div className="p-2 m-2 bg-white rounded">
        <input type="text" placeholder="Email"></input>
        <input type="password" placeholder="password"></input>
        <button onClick={()=>{

        }}>{isSignin?
            "signin":"sign up"
        }</button>
    </div>
   </div>
}