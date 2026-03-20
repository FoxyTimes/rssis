import "../css/report.css"
import {usePage, useProducts, useSales} from "../hooks/useReport.tsx";
import {Receipt, User, Tag, CheckCircle2, XCircle} from "lucide-react"
import {itemDecryption} from "../config.tsx";




function ReportPage() {
    const {totalSales, setTotalSales, completedSales, setCompletedSales, canceledSales, setCanceledSales, sales, setSales, selectedSale, setSelectedSale} = useSales();
    const {currentPage, setCurrentPage, selectedButtonDate, setSelectedButtonDate, searchSale, setSearchSale, page, setPage, pages, totalPages, setTotalPages, size} = usePage(setSales, setTotalSales, setCompletedSales, setCanceledSales)
    const {products} = useProducts(page, size, setTotalPages)

    return <>
        <div className="report-menu-container">
            <div className="report-menu">
                <div className="heading">Навигация</div>
                <div className="scrollable-content">
                    <div className="card-grid-report-menu">
                        <div className={`card-report-menu-item ${currentPage === "receipt" ? "active" : ""}`} onClick={() => setCurrentPage("receipt")}>
                            <Receipt/> Чеки
                        </div>
                        <div className={`card-report-menu-item ${currentPage === "staff" ? "active" : ""}`} onClick={() => setCurrentPage("staff")}>
                            <User/> Сотрудники
                        </div>
                        <div className={`card-report-menu-item ${currentPage === "product" ? "active" : ""}`} onClick={() => setCurrentPage("product")}>
                            <Tag/> Товары
                        </div>

                    </div>
                </div>
            </div>
            <div className={`report-receipt ${currentPage == "receipt" ? "active" : ""}`}>
                <div className="heading-info">Отчёты по чекам</div>
                <div className="card-grid-report-receipt">
                    <div className="report-receipt-hud">
                        <div className="report-receipt-hud-block">
                            <button className={selectedButtonDate==="day"?"active":""} onClick={() => setSelectedButtonDate("day")}>сегодня</button>
                            <button className={selectedButtonDate==="week"?"active":""} onClick={() => setSelectedButtonDate("week")}>неделя</button>
                            <button className={selectedButtonDate==="month"?"active":""} onClick={() => setSelectedButtonDate("month")}>месяц</button>
                        </div>
                        <input
                            type="text"
                            placeholder="Поиск чека..."
                            className="search-input"
                            value={searchSale}
                            onChange={(e) => {setSearchSale(e.target.value); setPage(1)}}
                        />
                    </div>
                    <div className="total-receipts-info-grid">
                        <div className="total-receipts-info-card">
                            <div className="total-receipts-info-icon" style={{backgroundColor: "rgba(0, 0, 255, 0.1)"}}><Receipt/></div>
                            <div className="total-receipts-info-card-block">
                                <div className="total-receipts-info-card-heading">Всего чеков</div>
                                {totalSales}
                            </div>
                        </div>
                        <div className="total-receipts-info-card">
                            <div className="total-receipts-info-icon" style={{backgroundColor: "rgba(0, 255, 0, 0.1)"}}><CheckCircle2/></div>
                            <div className="total-receipts-info-card-block">
                                <div className="total-receipts-info-card-heading">Оплачено</div>
                                {completedSales}
                            </div>
                        </div>
                        <div className="total-receipts-info-card">
                            <div className="total-receipts-info-icon" style={{backgroundColor: "rgba(255, 0, 0, 0.1)"}}><XCircle/></div>
                            <div className="total-receipts-info-card-block">
                                <div className="total-receipts-info-card-heading">Отменено</div>
                                {canceledSales}
                            </div>
                        </div>
                    </div>
                    <div className="heading-table">
                        <span>Список чеков</span>
                        <div className="pagination">
                            <button onClick={() => setPage(page-1)} disabled={page <= 1}>{"<"}</button>
                            <span>Страница {page} из {pages.length}</span>
                            <button onClick={() => setPage(page+1)} disabled={page >= totalPages}>{">"}</button>
                        </div>
                    </div>
                    <div className="heading-receipt-table-cols">
                        <div className="cell">№</div>
                        <div className="cell">ДАТА/ВРЕМЯ</div>
                        <div className="cell">КАССИР:ID</div>
                        <div className="cell">СПОСОБ ОПЛАТЫ</div>
                        <div className="cell">СУММА</div>
                        <div className="cell">СТАТУС</div>
                        <div className="cell">ДЕЙСТВИЯ</div>
                    </div>
                    {sales.map(sale => {
                        return <div className="table-receipt-cols" key={sale.id} onClick={() => {setSelectedSale({id: sale.id, products: []})}}>
                            <div className="cell">{sale.id}</div>
                            <div className="cell">{(() => {const date_time:string[] = sale.date.split(".")[0].split(" "); return date_time[0]+"/"+date_time[1]})() }</div>
                            <div className="cell">{sale.staff_name}:{sale.staff_id}</div>
                            <div className="cell">{(() => {
                                const decryption = itemDecryption.find(item => (item.item === sale.payment_method));
                                return decryption === undefined ? sale.payment_method : decryption.decryption
                            })()}</div>
                            <div className="cell">{sale.cost} ₽</div>
                            <div className={`cell ${sale.status==="completed" ? "completed" : sale.status==="canceled" ? "canceled" : ""}`}><span>{(() => {
                                const decryption = itemDecryption.find(item => (item.item === sale.status));
                                return decryption === undefined ? sale.status : decryption.decryption
                            })()}</span></div>
                            <div className="cell">
                                <button className="details-button" onClick={(e) => {e.stopPropagation(); setSelectedSale({id: sale.id, products: []})}}>Детали</button>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <div className={`report-products ${currentPage == "product" ? "active" : ""}`}>
                <div className="heading-info">Отчёты по товарам</div>
                <div className="card-grid-report-products">
                    <div className="heading-table">
                        <span>Список продуктов</span>
                        <div className="pagination">
                            <button onClick={() => setPage(page-1)} disabled={page <= 1}>{"<"}</button>
                            <span>Страница {page} из {pages.length}</span>
                            <button onClick={() => setPage(page+1)} disabled={page >= totalPages}>{">"}</button>
                        </div>
                    </div>
                    <div className="heading-products-table-cols">
                        <div className="cell">ID</div>
                        <div className="cell">ЦЕНА</div>
                        <div className="cell">НАЗВАНИЕ</div>
                        <div className="cell">ЕД.</div>
                        <div className="cell">ОСТАТОК</div>
                    </div>
                    {products.map(product => {
                        return <div className="table-products-cols" key={product.id}>
                            <div className="cell">{product.id}</div>
                            <div className="cell">{product.cost} ₽</div>
                            <div className="cell">{product.name}</div>
                            <div className="cell">{product.unit}</div>
                            <div className="cell">{product.remains}</div>
                        </div>
                    })}
                </div>
            </div>
        </div>
        {selectedSale &&
            <div className="popup-overlay" onClick={() => setSelectedSale(null)}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                    <h3>Детали чека #{selectedSale?.id}</h3>
                    <span>состав чека</span>
                    <div className="card-grid-report-receipt">
                        {selectedSale.products.map(product => {
                            return <div>
                                <div className="receipt-item">
                                    <div>
                                        <div className="name">{product.name}</div>
                                        <div className="subinfo">{product.count} {product.unit} x {product.cost}</div>
                                    </div>
                                    <div className="receipt-item-cost">{product.cost*product.count}</div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
        </div>}
    </>
}

export default ReportPage