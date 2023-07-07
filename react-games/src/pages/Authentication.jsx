import AuthForm from "../components/AuthForm";
import {json, redirect} from "react-router-dom"
const AuthenticationPage = () =>{
    return <AuthForm/>
}
export default AuthenticationPage


export async function action({request}){

    const searchParams = new URL(request.URL).searchParams
    const mode= searchParams.get("mode") || "login"

    if(!mode ==="login" || !mode=== "register"){
        throw json({message:"Unsupported mode"}, {status: 422})
    }

    const data = await request.formData();
    const authData = {
        username : data.get("username"),
        password: data.get("password")
    }
  

    const response = await fetch("http://localhost:3001/" + mode, {
        method: "POST",
        headers:{
            "Content-type": "application/json"
    },
    body: JSON.stringify(authData)
})



 if(response.status === 422 || response.status === 401){
    return response
 }

 if(!response.ok){
    throw json({message: "Could not authenticate user"}, {status: 500})
 }

 return  redirect("/")
}