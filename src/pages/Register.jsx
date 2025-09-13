import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

const Register = () => {
    const {register} = useContext(AuthContext);
    const [form, setForm] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await registerUser(form);
            setMessage("Register successful!");
            register(data)
            navigate("/");
        } catch (err) {
            setMessage(err.response?.data?.message || "Register failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h2>Register</h2>
                {message && <p style={{ color: "red" }}>{message}</p>}
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
                    <button type="submit">Register</button>
                </form>
                <p style={{ marginTop: "1rem" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#5FF281", fontWeight: "bold" }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
