import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchLogin} from "../api/loginApi.tsx";

interface LoginPageProps {
    onLogin: (flag: boolean) => void
}

export const useLogin = ({onLogin}:LoginPageProps) => {
    const [login, setLogin] = useState<string>("");
    const [pin, setPin] = useState<string>("");

    const navigate = useNavigate();
    const logIn = async () => {


        try {
            const loginData:{username: string, pincode: string} = {username: login, pincode: pin}
            const response:Response = await fetchLogin(loginData);

            const text = await response.text();

            let data: {token: null|string} | null = null;
            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                console.warn("Сервер вернул невалидный JSON:", text);
            }

            if (response.ok) {
                console.log("Токен:", data?.token);
                if (data?.token) {
                    localStorage.setItem("jwtToken", data.token);
                    localStorage.setItem("userName", login);
                    onLogin(true)
                    navigate("/mainmenu")
                }
            } else {
                console.error("Ошибка:", data || text);
                localStorage.setItem("jwtToken", "");
                onLogin(false)
            }
        } catch (err) {
            console.error("Сетевая ошибка:", err);
            localStorage.setItem("jwtToken", "");
            onLogin(false)
        }
    }

    return {login, setLogin, pin, setPin, logIn}
}