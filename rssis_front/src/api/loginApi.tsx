import {host} from "../config.tsx";

export const fetchLogin = async (loginData:{username: string, pincode: string}) => {

    return await fetch(host + "/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData)
    });
}