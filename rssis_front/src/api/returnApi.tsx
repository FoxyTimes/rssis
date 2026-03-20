import {host} from "../config.tsx";

export const fetchReasons = async () => {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(host + `/api/reasons`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("unauthorized");
    }

    return response.json();
}