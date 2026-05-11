"use client"

import { getAccounts, transfer } from "@/lib/api"
import { useEffect, useState } from "react"

export default function Trasnfer() {

    const [status, setStatus] = useState("Enter an amount to proceed...")
    const [value, setValue] = useState<any>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    alert("Not logged in");
                    return;
                }

                const response = await getAccounts(token);

                setAccounts(response.data.accounts);

            } catch (e) {
                console.log("Error fetching accounts", e);
            } finally {
                setLoading(false);
            }
        }

        fetchAccounts();
    }, []);

    function onchangeHander(e: any) {
        setValue({ ...value, [e.target.name]: parseInt(e.target.value) })
    }

    async function onClickHandler() {
        setStatus("Transferring...")
        const response = await transfer(value, localStorage.getItem("token") as string)
        alert(response.data.message)
        if (!response.data.error) {
            setStatus("Transferrred successfully..")
        } else {
            setStatus("Transfer failed..")
        }

    }

    return (<>
        <div className="p-10">
            <div className="font-bold text-2xl">Transfer</div>
            <div>
                <input onChange={onchangeHander} placeholder="amount" className="bg-white m-4 text-black" type="text" name="amount" id="1" />
                <input onChange={onchangeHander} placeholder="account ID" className="bg-white m-4 text-black  " type="text" name="toAccountId" id="2" />
                <button onClick={onClickHandler} className="bg-white m-4 text-black">Send</button>
            </div>
        </div>

        <div className="p-10">
            {status}
        </div>
        <div>

        </div>
    </>)
}