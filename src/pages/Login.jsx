import { useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

const Login = () => {
    const {login} = useContext(AuthContext);
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginUser(form);
            login(data);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />
                    <button type="submit">Login</button>
                </form>
                <p style={{ marginTop: "1rem" }}>
                    Dont have an account?{" "}
                    <Link to="/register" style={{ color: "#5FF281", fontWeight: "bold" }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
