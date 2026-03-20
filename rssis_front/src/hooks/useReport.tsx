import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {host} from "../config.tsx";
import {fetchReceipt, fetchSales} from "../api/saleApi.tsx";

export const usePage = (setSales:React.Dispatch<React.SetStateAction<{id: number, date: string, payment_method: string, status: string, staff_id: number, staff_name: string, cost: number}[]>>, setTotalSales:React.Dispatch<React.SetStateAction<number>>, setCompletedSales:React.Dispatch<React.SetStateAction<number>>, setCanceledSales:React.Dispatch<React.SetStateAction<number>>) => {
    const [currentPage, setCurrentPage] = useState("receipt");

    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    const [selectedButtonDate, setSelectedButtonDate] = useState("day");
    const [searchSale, setSearchSale] = useState("");

    const size = 20;
    const navigate = useNavigate()
    const pages = [];

    for (let i=1; i<totalPages+1; i++) {
        pages.push(i);
    }

    useEffect(() => {
        fetchSales(page, size, searchSale)
            .then(data => {
                if (!data) return;

                const sales = data.data.map((sale:{id: number, date: string, payment_method: string, status: string, staff_id: number, staff_name: string, cost: number}) => ({
                    id: sale.id,
                    date: sale.date,
                    payment_method: sale.payment_method,
                    status: sale.status,
                    staff_id: sale.staff_id,
                    staff_name: sale.staff_name,
                    cost: sale.cost}));

                setSales(sales);

                const totalSalesT : number = data.meta.total;
                const completedSalesT: number = data.meta.totalSalesComplete;
                const canceledSalesT: number = data.meta.totalSalesCanceled;

                setTotalSales(totalSalesT);
                setCompletedSales(completedSalesT);
                setCanceledSales(canceledSalesT);

                setTotalPages(Math.ceil(totalSalesT / size)===0?1:Math.ceil(totalSalesT / size));
            })
            .catch(error => {
                console.log("Ошибка при получении продуктов:", error);
                navigate("/")
            });

    }, [page, searchSale]);


    return {currentPage, setCurrentPage, selectedButtonDate, setSelectedButtonDate, searchSale, setSearchSale, page, setPage, pages, totalPages, setTotalPages, size};
}


export const useSales = () => {
    const [sales, setSales] = useState<{id: number, date: string, payment_method: string, status: string, staff_id: number, staff_name: string, cost: number}[]>([]);
    const [selectedSale, setSelectedSale] = useState<{id: number, products: {name: string, count: number, cost: number, unit: string}[]} | null>(null)

    const [totalSales, setTotalSales] = useState(0);
    const [completedSales, setCompletedSales] = useState(0);
    const [canceledSales, setCanceledSales] = useState(0);

    const navigate = useNavigate()

    useEffect(() => {
        if (selectedSale!==null) {
                fetchReceipt(selectedSale).then(data => {
                    if (!data) return;

                    const products:{name: string, count: number, cost: number, unit: string}[] = data.data.map((product:{id: number, name: string, cost: number, count: number, unit: string}) => ({
                        name: product.name,
                        count: product.count,
                        cost: product.cost,
                        unit: product.unit
                    }));

                    setSelectedSale(prev => prev ? {...prev, products: products} : null);

                })
                .catch(error => {
                    console.log("Ошибка при получении продуктов:", error);
                    navigate("/");
                });
        }

    }, [selectedSale?.id]);

    return {totalSales, setTotalSales, completedSales, setCompletedSales, canceledSales, setCanceledSales, sales, setSales, selectedSale, setSelectedSale};
}

export const useProducts = (page:number, size:number, setTotalPages:React.Dispatch<React.SetStateAction<number>>) => {
    const [products, setProducts] = useState<{id: number, cost: number, name: string, unit: string, remains: number}[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        fetch(host + `/api/products?page=${page}&limit=${size}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    navigate("/");
                    return;
                }

                return response.json();
            })
            .then(data => {
                if (!data) return;

                const productsT = data.data.map((p: {id: number, name: string, cost: number, unit: string, remains: number}) => ({
                    id: p.id,
                    name: p.name,
                    cost: p.cost,
                    unit: p.unit,
                    remains: p.remains
                }));

                setProducts(productsT);

                const totalProduct : number = data.meta.total;
                setTotalPages(Math.ceil(totalProduct / size));
            })
            .catch(error => {
                console.log("Ошибка при получении продуктов:", error);
            });

    }, [page]);

    return {products};
}

