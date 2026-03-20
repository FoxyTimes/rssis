import '../css/auth.css'
import cardImage from "../assets/card-back-side.png";
import {useLogin} from "../hooks/useLogin.tsx";

interface LoginPageProps {
    onLogin: (flag: boolean) => void
}

function LoginPage({onLogin}: LoginPageProps) {

    const {login, setLogin, pin, setPin, logIn} = useLogin({onLogin});

    return (
        <div className="code-wait">
            <div className="text">Ожидаю карту</div>
            <img src={cardImage} alt="" className="card-img"/>
            <div className="text">ИЛИ</div>
            <input placeholder="LOGIN" value={login} onChange={(e) => setLogin(e.target.value)}/>
            <input placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)}/>
            <button onClick={logIn}>Войти</button>
        </div>
    )

}

export default LoginPage;