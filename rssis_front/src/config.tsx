import type {ReactElement} from "react";

export const host = "http://127.0.0.1:8080";

import {Banknote, CreditCard} from "lucide-react"

export const itemDecryption:{item: string, decryption: string | ReactElement}[] = [
    //причины возврата товаров
    {item: "expired date", decryption: "Истек срок годности"},
    {item: "inadequate quality", decryption: "Ненадлежащее качество"},

    //статусы продажи
    {item: "completed", decryption: "Оплачен"},
    {item: "canceled", decryption: "Отменён"},

    //методы оплаты
    {item: "CASH", decryption: <>наличный <Banknote fill="lightgreen" /></>},
    {item: "CARD", decryption: <>карта <CreditCard color="blue" /></>}
]