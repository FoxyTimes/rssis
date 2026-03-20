import {useEffect, useState} from "react";
import {fetchReasons} from "../api/returnApi.tsx";
import {useNavigate} from "react-router-dom";
import {host} from "../config.tsx";
import {fetchSales} from "../api/saleApi.tsx";

export const useConfirm = () => {
    const [showConfirm, setShowConfirm] = useState(false);

    return {showConfirm, setShowConfirm};
}

export const useSales = () => {
    const [sales, setSales] = useState<{id: number, date: string, staff_name: string, cost: number, staff_id: number}[]>([]);
    const [selectedReturn, setSelectedReturn] = useState<{id: number, reason_id: number, products: {name: string, count: number, cost: number, unit: string, countToReturn: number}[]} | null>(null)
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken")
        if (selectedReturn!==null) {
            fetch(host + `/api/get_receipt?receipt_id=${selectedReturn.id}`, {
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

                    const products:{name: string, count: number, cost: number, unit: string, countToReturn: number}[] = data.data.map((product:{id: number, name: string, cost: number, count: number, unit: string, countToReturn: number}) => ({
                        name: product.name,
                        count: product.count,
                        cost: product.cost,
                        unit: product.unit,
                        countToReturn: 0,
                    }));

                    setSelectedReturn(prev => prev ? {...prev, reason_id: NaN, products: products} : null);

                })
                .catch(error => {
                    console.log("Ошибка при получении продуктов:", error);
                });
        }

    }, [selectedReturn?.id]);


    return {sales, setSales, selectedReturn, setSelectedReturn, isDropDownOpen, setIsDropDownOpen};
}

export const usePage = (setSales:React.Dispatch<React.SetStateAction<{id: number, date: string, staff_name: string, cost: number, staff_id: number}[]>>) => {
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    const pages = [];

    const size = 20;

    for (let i = 1; i < totalPages+1; i++) {
        pages.push(i);
    }
    const navigate = useNavigate();


    useEffect(() => {
        fetchSales(page, size, search)
            .then(data => {
                if (!data) return;

                const salesT = data.data.map((sale:{id: number, date: string, payment_method: string, status: string, staff_id: number, staff_name: string, cost: number}) => ({
                    id: sale.id,
                    date: sale.date,
                    staff_name: sale.staff_name,
                    staff_id: sale.staff_id,
                    cost: sale.cost}));

                setSales(salesT);

                const totalProduct : number = data.meta.total;

                setTotalPages(Math.ceil(totalProduct / size));
            })
            .catch(error => {
                console.log("Ошибка при получении продуктов:", error);
                navigate("/")
            });

    }, [search, page]);

    return {search, setSearch, page, setPage, pages, totalPages};
}

export const useReasons = () => {
    const [reasons, setReasons] = useState<{id: number, reason: string}[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchReasons()
            .then(data => {
                if (!data) return;

                const reasonsT = data.data.map((reason:{id: number, reason: string}) => ({
                    id: reason.id,
                    reason: reason.reason
                }));

                setReasons(reasonsT)
            })
            .catch(error => {
            console.log("Ошибка при получении причин для возврата:", error);
            navigate("/")
        });
    })

    return {reasons}
}