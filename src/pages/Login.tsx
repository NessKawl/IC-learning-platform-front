// src/pages/Login.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { VerifyLogin } from "../service/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({
        usu_email: "",
        usu_senha: ""
    });

    const navigate = useNavigate();

    function handleChange(e: any) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await VerifyLogin(form.usu_email, form.usu_senha);

            localStorage.setItem("token", response.access_token);

            localStorage.setItem("user", JSON.stringify(response.user));

            navigate("/cursos");

        } catch (error: any) {
            console.error(error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Erro ao fazer login");
            }
        }
    };
    return (
        <>
            <div className="min-h-screen flex items-center flex-col justify-center bg-gray-900 text-white">
                <h1 className="mb-5"><strong>
                    <Link to="/" className="text-blue-400">
                        IC Learn Platform
                    </Link>
                </strong></h1>

                <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">

                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Entrar
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            name="usu_email"
                            placeholder="Email"
                            value={form.usu_email}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-700 outline-none"
                            required
                        />

                        <input
                            type="password"
                            name="usu_senha"
                            placeholder="Senha"
                            value={form.usu_senha}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-700 outline-none"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700"
                        >
                            Entrar
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-4">
                        Não possui conta?{" "}
                        <Link to="/register" className="text-blue-400">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}