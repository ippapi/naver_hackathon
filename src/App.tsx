import './App.css'
import hackathonGraphic from './assets/hackathon-graphic.svg'
import naverLogo from './assets/naver-logo.svg'
import Dashboard from './pages/Dashboard.jsx';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
    const isAuthenticated = localStorage.getItem("token");

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                <Route path="/login" element={!isAuthenticated ?  <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!isAuthenticated ?  <Register /> : <Navigate to="/" />} />
                <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;