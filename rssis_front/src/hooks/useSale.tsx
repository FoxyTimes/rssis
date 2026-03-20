import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchAddSale, fetchProducts} from "../api/saleApi.tsx";

export const useCart = (products:{ id: number; name: string; cost: number, active: boolean, unit: string}[], setProducts:React.Dispatch<React.SetStateAction<{ id: number; name: string; cost: number, active: boolean, unit: string}[]>>) => {
    const [cart, setCart] = useState<{id: number, name: string, cost: number, count: number, unit: string}[]>([]);

    const totalCost = Math.round(
        cart.reduce((sum, item) => sum + item.cost * item.count, 0) * 100
    ) / 100;

    const addSale = (status: string) => {
        const token = localStorage.getItem("jwtToken");

        console.log(token);

        const productsForReceipt = cart.map(item => ({
            id: item.id,
            cost: item.cost,
            count: item.count
        }));

        fetchAddSale(productsForReceipt, status);

    }

    const increase = (id: number) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.id === id);

            if (!existingItem) {
                const product = products.find(p => p.id === id);
                if (!product) return prev;
                setProducts(prev => prev.map(item => item.id===id ? {...item, active: true} : item))
                return [...prev, { ...product, count: 1 }];
            }

            return prev.map(item =>
                item.id === id
                    ? { ...item, count: item.count + 1 }
                    : item
            );
        });
    };

    const decrease = (id : number) => {
        setCart(prev => {
            const copyCart = [...prev]
            const existingItem = copyCart.find(item => item.id===id)
            if (existingItem) {
                if (existingItem.count>1) {
                    return prev.map(item => item===existingItem ? {...item, count: item.count-1} : item)
                }
                else {
                    setProducts(prev => prev.map(item => item.id===id ? {...item, active: false} : item))
                    return copyCart.filter(item => item.id!=id)
                }
            }
            return copyCart
        })
    };

    const removeAll = () => {
        setCart([]);
        setProducts(products.map(product => {return {...product, active: false}}))
    }


    return {cart, increase, decrease, removeAll, addSale, totalCost}

};


export const useProducts = () => {
    const [products, setProducts] = useState<{ id: number; name: string; cost: number, active: boolean, unit: string}[]>([]);

    return {products, setProducts}
}

export const usePage = (cart:{id: number, name: string, cost: number, count: number, unit: string}[], setProducts:React.Dispatch<React.SetStateAction<{ id: number; name: string; cost: number, active: boolean, unit: string}[]>>) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const pages = [];

    const size = 20;

    for (let i = 1; i < totalPages+1; i++) {
        pages.push(i);
    }

    useEffect(() => {
            fetchProducts(page, size, search).then(data => {
                if (!data) return;

                const productsWithColor = data.data.map((p:{id: number, name: string, cost: number, unit: string}) => ({
                    id: p.id,
                    name: p.name,
                    cost: p.cost,
                    unit: p.unit,
                    active: cart.filter(item => item.id == p.id).length !== 0
                }));

                setProducts(productsWithColor);

                const totalProduct : number = data.meta.total;

                setTotalPages(Math.ceil(totalProduct / size));
            })
            .catch(error => {
                console.log("Ошибка при получении продуктов:", error);
                navigate('/')
            });

    }, [page, search]);



    return {page, setPage, pages, totalPages, search, setSearch};
}

export const useColors = () => {
    const inactiveColor = "#f4f4f4"
    const activeColor = "#90EE90"

    return {activeColor, inactiveColor}
}

export const useConfirm = () => {
    const [showConfirm, setShowConfirm] = useState(false);

    return {showConfirm, setShowConfirm};
}