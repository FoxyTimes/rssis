import "../css/mainmenu.css"
import {useNavigate} from "react-router-dom";
import { DollarSign, BarChart3, Undo2, Trash2, Package, Crown } from "lucide-react";
function MainmenuPage() {
    const navigate = useNavigate();

    const goToSellPage = () => {
        navigate("/sell");
    };

    const goToReportPage = () => {
        navigate("/report")
    }

    const goToReturnPage = () => {
        navigate("/return")
    }

    return (
        <div className="main-menu-container">
            <div className="account"><span>Администратор</span><span style={{color: "black"}}>|</span><span style={{color: "gray", fontWeight: "normal"}}>{localStorage.getItem("userName")}</span></div>
            <div className="card-grid">
                <div className="main-menu-item" onClick={goToSellPage}>
                    <div className="main-menu-icon"><DollarSign/></div>
                    <div className="menu-item-title">Продажи</div>
                    <div className="menu-item-desc">Оформление продаж</div>
                    <div className="menu-item-arrow">→</div>
                </div>
                <div className="main-menu-item" onClick={goToReportPage}>
                    <div className="main-menu-icon"><BarChart3/></div>
                    <div className="menu-item-title">Аналитика</div>
                    <div className="menu-item-desc">Выручка, продажи по товарам, аналитика по сотрудникам</div>
                    <div className="menu-item-arrow">→</div>
                </div>
                <div className="main-menu-item" onClick={goToReturnPage}>
                    <div className="main-menu-icon"><Undo2/></div>
                    <div className="menu-item-title">Возвраты</div>
                    <div className="menu-item-desc">Оформление возвратов товаров</div>
                    <div className="menu-item-arrow">→</div>
                </div>
                <div className="main-menu-item" onClick={() => {}}>
                    <div className="main-menu-icon"><Trash2/></div>
                    <div className="menu-item-title">Списания</div>
                    <div className="menu-item-desc">Оформление списаний товаров</div>
                    <div className="menu-item-arrow">→</div>
                </div>
                <div className="main-menu-item" onClick={() => {}}>
                    <div className="main-menu-icon"><Package/></div>
                    <div className="menu-item-title">Поставки</div>
                    <div className="menu-item-desc">Приём товаров от поставщиков, пополнение склада</div>
                    <div className="menu-item-arrow">→</div>
                </div>
                <div className="main-menu-item" onClick={() => {}}>
                    <div className="main-menu-icon"><Crown fill="gold"/></div>
                    <div className="menu-item-title">Админ</div>
                    <div className="menu-item-desc">Панель администрации</div>
                    <div className="menu-item-arrow">→</div>
                </div>
            </div>
        </div>
    );
}

export default MainmenuPage;