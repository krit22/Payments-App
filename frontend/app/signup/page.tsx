"use client"

import { useState } from "react";
import { signup } from "@/lib/api";

export default function SignupPage() {

    const [form, setForm] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: ""
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await signup(form);
            alert("Signup success");
            console.log(res.data);
        } catch (err) {
            alert("Signup failed");
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Signup</h1>

            <input onChange={handleChange} name="username" placeholder="email" />
            <input onChange={handleChange} name="password" placeholder="password" />
            <input onChange={handleChange} name="firstName" placeholder="first name" />
            <input onChange={handleChange} name="lastName" placeholder="last name" />

            <button onClick={handleSubmit} >
                Create Account
            </button>
        </div>
    );
}


