import {host} from "../config.tsx";

export const fetchProducts = async (page:number, size:number, search:string) => {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(
        `${host}/api/products?page=${page}&limit=${size}&search=${search}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (response.status === 401 || response.status === 403) {
        throw new Error("unauthorized");
    }

    return response.json();
}


export const fetchSales = async (page:number, size:number, searchSale:string) => {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(host + `/api/sales?page=${page}&limit=${size}&search=${searchSale}`, {
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


export const fetchAddSale = async (productsForReceipt: {id: number,
    cost: number,
    count: number}[], status:string) => {
    const token = localStorage.getItem("jwtToken");

    fetch(host + `/api/add_sale?status=${status}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productsForReceipt)
    })
}

export const fetchReceipt = async (selectedSale:{id: number, products: {name: string, count: number, cost: number, unit: string}[]}) => {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(host + `/api/get_receipt?receipt_id=${selectedSale.id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.status === 401 || response.status === 403) {
        throw new Error("unauthorized");
    }

    return response.json();
}
