import "../css/sale.css"
import {useCart, useColors, useConfirm, usePage, useProducts} from "../hooks/useSale.tsx";

function SalePage() {
    const {showConfirm, setShowConfirm} = useConfirm();
    const {products, setProducts} = useProducts();
    const {cart, increase, decrease, removeAll, addSale, totalCost} = useCart(products, setProducts);
    const {page, setPage, pages, totalPages, search, setSearch} = usePage(cart, setProducts);
    const {activeColor, inactiveColor} = useColors();

    return <>
            <div className="sell-menu-container">
                <div className="cart">
                    <div className="heading">
                        <div className="heading-info-big">Корзина</div>
                        <div className="heading-info-small"><div>Товаров в корзине:</div>  <div className="counter-cart">{cart.reduce((sum, item) => sum+item.count, 0)}</div></div>
                    </div>
                    <div className="scrollable-content">
                        <div className="card-grid-cart">
                            {cart.map((item) => {
                                return <div className="card-cart" key={item.id}>
                                    <div className="product-card-info">
                                        <h3 className="product-text">{item.name}</h3>
                                        <div className="product-text" style={{color: "green"}}>Цена: {item.cost}₽ / {item.unit}</div>
                                    </div>
                                    <div className="controls-cart">
                                        <button style={{ backgroundColor: 'red' }} onClick={() => decrease(item.id)}>-</button>
                                        <span className="counter">{item.count}</span>
                                        <button style={{ backgroundColor: 'green' }} onClick={() => increase(item.id)}>+</button>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                    <div className="cart-buttons">
                        <button className="remove-button" onClick={() => removeAll()}>Очистить</button>
                        <span className="counter" style={{color: "white"}}>{totalCost} ₽</span>
                        <button className="accept-button" onClick={() => {setShowConfirm(true)}}>Подтвердить</button>
                    </div>
                </div>


                <div className="products">
                    <div className="heading">Товары</div>
                    <input
                        type="text"
                        placeholder="Поиск товара..."
                        className="search-input"
                        value={search}
                        onChange={(e) => {setSearch(e.target.value); setPage(1)}}
                    />
                    <div className="scrollable-content">
                        <div className="card-grid-product">
                            {products.map((item : {id: number, name: string, cost: number, active: boolean, unit: string}) => {
                                return <div key={item.id} className="card-product" style={{
                                    backgroundColor: item.active ? activeColor : inactiveColor,
                                    border: `2px solid ${item.active ? "green" : "#ccc"}`
                                }} onClick={() => increase(item.id)}>
                                    <div className="product-card-info">
                                        <h3 className="product-text">{item.name}</h3>
                                        <div className="product-text">{item.cost}₽ / {item.unit}</div>
                                    </div>
                                    <div className="controls-product">
                                        <span className="counter">
                                        {
                                            cart.find(cartItem => item.id===cartItem.id)?.count || 0
                                        }
                                    </span>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                    <div className="pagination">
                        <button onClick={() => setPage(1)} disabled={page === 1}>{"<<"}</button>

                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            {"<"}
                        </button>

                        {pages.map(p => (
                            <button
                                key={p}
                                className={p === page ? "active-page" : ""}
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                        >
                            {">"}
                        </button>

                        <button
                            onClick={() => setPage(totalPages)}
                            disabled={page === totalPages}
                        >
                            {">>"}
                        </button>
                    </div>
                </div>
        </div>
        <div>
            {showConfirm && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Подтверждение оплаты</h3>
                        <p>Вы уверены, что хотите подтвердить оплату?</p>
                        <div className="popup-buttons">
                            <button
                                onClick={() => {
                                    addSale("completed");
                                    setShowConfirm(false);
                                }}
                            >
                                Да
                            </button>
                            <button

                                onClick={() => {
                                    addSale("canceled");
                                    setShowConfirm(false)}
                            }
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
}

export default SalePage