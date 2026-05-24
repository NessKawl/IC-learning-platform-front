import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../utils/auth";

export default function NavBar() {

    const userStorage = JSON.parse(localStorage.getItem("user") || "{}");

    const [user, setUser] = useState({
        nome: userStorage.usu_nome || "",
        email: userStorage.usu_email || "",
        tipoUsuario: userStorage.tiu_id || 0
    });

    useEffect(() => {
        function atualizarUsuario() {
            const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");

            setUser({
                nome: updatedUser.usu_nome || "",
                email: updatedUser.usu_email || "",
                tipoUsuario: updatedUser.tiu_id || 0
            });
        }

        atualizarUsuario();

        window.addEventListener("storage", atualizarUsuario);

        return () => {
            window.removeEventListener("storage", atualizarUsuario);
        };
    }, []);

    const navigate = useNavigate();

    // Controle de permissão
    const podeCriar =
        user.tipoUsuario === 2 || user.tipoUsuario === 3;

    return (
        <nav className="bg-gray-800 flex justify-between items-center p-6 mx-auto">

            <h1 className="text-2xl font-bold">
                <button
                    onClick={() => navigate("/")}
                    className="hover:cursor-pointer"
                >
                    IC Learn Platform
                </button>
            </h1>

            <div className="flex gap-4">

                <button
                    onClick={() => navigate("/cursos")}
                    className="hover:text-gray-300 hover:cursor-pointer"
                >
                    <i className="bi bi-book"></i> Cursos
                </button>

                {podeCriar && (
                    <>
                        <button
                            onClick={() => navigate("/criar-curso")}
                            className="hover:text-gray-300 hover:cursor-pointer"
                        >
                            <i className="bi bi-plus-circle"></i> Criar Curso
                        </button>

                        <button
                            onClick={() => navigate("/criar-modulo")}
                            className="hover:text-gray-300 hover:cursor-pointer"
                        >
                            <i className="bi bi-plus-circle"></i> Criar Módulo
                        </button>

                        <button
                            onClick={() => navigate("/criar-material")}
                            className="hover:text-gray-300 hover:cursor-pointer"
                        >
                            <i className="bi bi-plus-circle"></i> Criar Material
                        </button>

                    </>
                )}
            </div>

            {user.nome ? (
                <div className="flex items-center gap-4">
                    <p className="font-light text-sm md:text-lg">
                        Bem vindo(a)
                    </p>

                    <button
                        onClick={() => navigate("/area-candidato")}
                        className="font-bold text-sm md:text-lg hover:text-gray-300 hover:cursor-pointer">
                        {user.nome}
                    </button>

                    <button
                        className="hover:text-red-500 transition px-4"
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                    >
                        Sair
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    className="hover:text-gray-300 hover:cursor-pointer"
                >
                    Login
                </button>
            )}
        </nav>
    );
}