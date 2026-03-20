import { BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "./LoginPage";
import MainmenuPage from "./MainmenuPage";
import SalePage from "./SalePage.tsx";
import {type JSX, useState} from "react";
import { Navigate } from "react-router-dom";
import ReportPage from "./ReportPage.tsx";
import ReturnPage from "./ReturnPage.tsx";



interface ProtectedRouteProps {
    condition: boolean;
    redirectTo: string;
    children: JSX.Element;
}

const ProtectedRoute = ({ condition, redirectTo, children }: ProtectedRouteProps) => {
    if (!condition) return <Navigate to={redirectTo} />;
    return children;
};


export default function App() {
    const [isAuth, setIsAuth] = useState<boolean>(() => {
        const token = localStorage.getItem("jwtToken");
        return token !== null && token !== "";
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<LoginPage onLogin ={(flag : boolean) => setIsAuth(flag)}/>}
                />

                <Route
                    path="/mainmenu"
                    element={
                        <ProtectedRoute condition={isAuth} redirectTo="/">
                            <MainmenuPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sell"
                    element={
                        <ProtectedRoute condition={isAuth} redirectTo="/">
                            <SalePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/report"
                    element={
                        <ProtectedRoute condition={isAuth} redirectTo="/">
                            <ReportPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/return"
                    element={
                        <ProtectedRoute condition={isAuth} redirectTo="/">
                            <ReturnPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}