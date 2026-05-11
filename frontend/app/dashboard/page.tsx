"use client";

import { useEffect, useState } from "react";
import { getAccounts } from "@/lib/api";

export default function Dashboard() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="mt-5">
                {accounts.map((acc) => (
                    <div key={acc.id} className="p-4 border rounded mb-2">
                        <div>Account ID: {acc.id}</div>
                        <div>Balance: ₹{acc.balance}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}