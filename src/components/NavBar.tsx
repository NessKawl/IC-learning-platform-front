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
    const podeCriar = user.tipoUsuario === 1 || user.tipoUsuario === 2;
    const admin = user.tipoUsuario === 1;
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

            <div className="flex gap-6 items-center">

                <div className="relative group">

                    <button
                        className="flex items-center gap-2 hover:text-gray-300"
                    >
                        <i className="bi bi-book"></i>
                        Cursos
                        <i className="bi bi-chevron-down text-xs"></i>
                    </button>

                    <div
                        className="absolute left-0 mt-2 w-56 bg-gray-700 text-gray-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                    >

                        <button
                            onClick={() => navigate("/cursos")}
                            className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                        >
                            📚 Todos os Cursos
                        </button>

                        {podeCriar && (
                            <>
                                <button
                                    onClick={() => navigate("/meus-cursos")}
                                    className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                >
                                    📖 Meus Cursos
                                </button>

                                <button
                                    onClick={() => navigate("/criar-curso")}
                                    className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                >
                                    ➕ Propor Curso
                                </button>

                                <button
                                    onClick={() => navigate("/criar-modulo")}
                                    className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                >
                                    📂 Criar Módulo
                                </button>

                                <button
                                    onClick={() => navigate("/criar-material")}
                                    className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                >
                                    📄 Criar Material
                                </button>
                                <button
                                    onClick={() => navigate("/criar-avaliacao")}
                                    className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                >
                                    📄 Criar Avaliação
                                </button>
                            </>
                        )}

                        {admin && (
                            <>
                                <hr />

                                <button
                                    onClick={() => navigate("/pendentes")}
                                    className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                >
                                    ✅ Aprovações
                                </button>
                            </>
                        )}

                    </div>

                </div>

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