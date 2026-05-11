import axios from "axios";

const API = "http://localhost:3001/api/v1";

// AUTH
export const signup = (data: any) =>
    axios.post(`${API}/user/signup`, data);

export const signin = (data: any) =>
    axios.post(`${API}/user/signin`, data);

// ACCOUNTS
export const getAccounts = (token: string) => {

    const response = axios.get(`${API}/account`, {
        headers: { authorization: token }
    })
    return response
}

// TRANSFER
export const transfer = (data: any, token: string) =>
    axios.post(`${API}/account/transfer`, data, {
        headers: { Authorization: token }
    });