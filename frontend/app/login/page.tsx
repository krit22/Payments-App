"use client"

import { useState } from "react";
import { signin } from "@/lib/api";



export default function LoginPage() {

    const [data, setData] = useState({
        username: "",
        password: ""
    })

    function handleChange(e: any) {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    async function handleSubmit() {
        try {
            const response = await signin(data)
            const token = response.data.token;
            localStorage.setItem("token", token);
            alert("Login successful")
            console.log(response)
        } catch (e) {
            alert("Login failed")
        }
    }

    return (
        <>
            <div className="p-10">
                <div className="text-2xl font-bold">Login</div>
                <input onChange={handleChange} name="username" placeholder="username"></input>
                <input onChange={handleChange} name="password" placeholder="password"></input>
                <button onClick={handleSubmit}>Submit</button>
            </div>

        </>
    )
}