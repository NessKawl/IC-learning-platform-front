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

    const [menuAberto, setMenuAberto] = useState(false);
    const [cursosAberto, setCursosAberto] = useState(false);

    const navigate = useNavigate();

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

    // Controle de permissão
    const podeCriar = user.tipoUsuario === 1 || user.tipoUsuario === 2;
    const professor = user.tipoUsuario === 2;
    const admin = user.tipoUsuario === 1;

    // Navegação
    function navegar(rota: any) {
        navigate(rota);
        setMenuAberto(false);
        setCursosAberto(false);
    }

    // Logout
    function fazerLogout() {
        logout();
        navigate("/login");
        setMenuAberto(false);
        setCursosAberto(false);
    }

    return (
        <nav className="bg-gray-800 text-white shadow-lg">

            {/* BARRA PRINCIPAL */}

            <div className="flex justify-between items-center p-4 md:p-6 mx-auto">

                {/* LOGO */}

                <h1 className="text-xl md:text-2xl font-bold">
                    <button
                        onClick={() => navegar("/")}
                        className="hover:cursor-pointer"
                    >
                        <img src="https://i.imgur.com/iUVtxqI.png" alt="" className="size-20 w-auto" />
                    </button>
                </h1>

                {/* MENU DESKTOP */}

                <div className="hidden md:flex items-center gap-6">

                    {/* CURSOS */}

                    <div className="relative group">

                        <button className="flex items-center gap-2 hover:text-gray-300 transition">
                            <i className="bi bi-book"></i>
                            Cursos
                            <i className="bi bi-chevron-down text-xs"></i>
                        </button>

                        {/* SUBMENU */}

                        <div className="absolute left-0 mt-2 w-56 bg-gray-700 text-gray-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

                            {/* TODOS OS CURSOS */}

                            <button
                                onClick={() => navegar("/cursos")}
                                className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                            >
                                <i className="bi bi-book-half"></i> Todos os Cursos
                            </button>

                            {/* PROFESSOR / ADMIN */}

                            {podeCriar && (
                                <>

                                    {/* MEUS CURSOS */}

                                    <button
                                        onClick={() => navegar("/meus-cursos")}
                                        className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                    >
                                        <i className="bi bi-journal-bookmark"></i> Meus Cursos
                                    </button>

                                    {/* PROPOR CURSO */}

                                    <button
                                        onClick={() => navegar("/criar-curso")}
                                        className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                    >
                                        <i className="bi bi-plus-square"></i> Propor Curso
                                    </button>

                                    {/* CRIAR MÓDULO */}

                                    <button
                                        onClick={() => navegar("/criar-modulo")}
                                        className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                    >
                                        <i className="bi bi-folder"></i> Criar Módulo
                                    </button>

                                    {/* CRIAR MATERIAL */}

                                    <button
                                        onClick={() => navegar("/criar-material")}
                                        className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                    >
                                        <i className="bi bi-file-earmark-text"></i> Criar Material
                                    </button>

                                    {/* CRIAR AVALIAÇÃO */}

                                    <button
                                        onClick={() => navegar("/criar-avaliacao")}
                                        className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                    >
                                        <i className="bi bi-clipboard2-plus"></i> Criar Avaliação
                                    </button>

                                </>
                            )}

                            {/* PROFESSOR */}

                            {professor && (
                                <>
                                    <hr className="border-gray-600" />

                                    <button
                                        onClick={() => navegar("/pendentes-prova")}
                                        className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                    >
                                        <i className="bi bi-clipboard2-check"></i> Solicitações de Provas
                                    </button>
                                </>
                            )}

                            {/* ADMIN */}

                            {admin && (
                                <>
                                    <hr className="border-gray-600" />

                                    <button
                                        onClick={() => navegar("/pendentes")}
                                        className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                                    >
                                        <i className="bi bi-check-circle"></i> Aprovações
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                </div>

                {/* USUÁRIO DESKTOP */}

                <div className="hidden md:flex items-center">

                    {user.nome ? (

                        <div className="flex items-center gap-4">

                            <p className="font-light text-sm md:text-lg">
                                Bem vindo(a)
                            </p>

                            <button
                                onClick={() => navegar("/area-candidato")}
                                className="font-bold text-sm md:text-lg hover:text-gray-300 hover:cursor-pointer"
                            >
                                {user.nome}
                            </button>

                            <button
                                className="hover:text-red-500 transition px-4"
                                onClick={fazerLogout}
                            >
                                Sair
                            </button>

                        </div>

                    ) : (

                        <button
                            onClick={() => navegar("/login")}
                            className="hover:text-gray-300 hover:cursor-pointer"
                        >
                            Login
                        </button>

                    )}

                </div>

                {/* BOTÃO HAMBÚRGUER */}

                <button
                    onClick={() => setMenuAberto(!menuAberto)}
                    className="md:hidden text-2xl hover:text-gray-300 transition"
                    aria-label="Abrir menu"
                    aria-expanded={menuAberto}
                >
                    <i className={menuAberto ? "bi bi-x-lg" : "bi bi-list"}></i>
                </button>

            </div>

            {/* MENU MOBILE */}

            {menuAberto && (

                <div className="md:hidden border-t border-gray-700 bg-gray-800">

                    {/* CURSOS */}

                    <button
                        onClick={() => setCursosAberto(!cursosAberto)}
                        className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-700 transition"
                    >

                        <span className="flex items-center gap-3">
                            <i className="bi bi-book"></i>
                            Cursos
                        </span>

                        <i className={cursosAberto ? "bi bi-chevron-up" : "bi bi-chevron-down"}></i>

                    </button>

                    {/* SUBMENU MOBILE */}

                    {cursosAberto && (

                        <div className="bg-gray-700">

                            {/* TODOS OS CURSOS */}

                            <button
                                onClick={() => navegar("/cursos")}
                                className="w-full text-left px-8 py-3 hover:bg-gray-600 transition"
                            >
                                <i className="bi bi-book-half"></i> Todos os Cursos
                            </button>

                            {/* PROFESSOR / ADMIN */}

                            {podeCriar && (
                                <>

                                    {/* MEUS CURSOS */}

                                    <button
                                        onClick={() => navegar("/meus-cursos")}
                                        className="w-full text-left px-8 py-3 hover:bg-gray-600 transition"
                                    >
                                        <i className="bi bi-journal-bookmark"></i> Meus Cursos
                                    </button>

                                    {/* PROPOR CURSO */}

                                    <button
                                        onClick={() => navegar("/criar-curso")}
                                        className="w-full text-left px-8 py-3 hover:bg-gray-600 transition"
                                    >
                                        <i className="bi bi-plus-square"></i> Propor Curso
                                    </button>

                                    {/* CRIAR MÓDULO */}

                                    <button
                                        onClick={() => navegar("/criar-modulo")}
                                        className="w-full text-left px-8 py-3 hover:bg-gray-600 transition"
                                    >
                                        <i className="bi bi-folder"></i> Criar Módulo
                                    </button>

                                    {/* CRIAR MATERIAL */}

                                    <button
                                        onClick={() => navegar("/criar-material")}
                                        className="w-full text-left px-8 py-3 hover:bg-gray-600 transition"
                                    >
                                        <i className="bi bi-file-earmark-text"></i> Criar Material
                                    </button>

                                    {/* CRIAR AVALIAÇÃO */}

                                    <button
                                        onClick={() => navegar("/criar-avaliacao")}
                                        className="w-full text-left px-8 py-3 hover:bg-gray-600 transition"
                                    >
                                        <i className="bi bi-clipboard2-plus"></i> Criar Avaliação
                                    </button>

                                </>
                            )}

                            {/* PROFESSOR */}

                            {professor && (
                                <>
                                    <hr className="border-gray-600" />

                                    <button
                                        onClick={() => navegar("/pendentes-prova")}
                                        className="w-full text-left px-8 py-3 hover:bg-gray-600 transition"
                                    >
                                        <i className="bi bi-clipboard2-check"></i> Solicitações de Provas
                                    </button>
                                </>
                            )}

                            {/* ADMIN */}

                            {admin && (
                                <>
                                    <hr className="border-gray-600" />

                                    <button
                                        onClick={() => navegar("/pendentes")}
                                        className="w-full text-left px-8 py-3 hover:bg-gray-600 transition"
                                    >
                                        <i className="bi bi-check-circle"></i> Aprovações
                                    </button>
                                </>
                            )}

                        </div>
                    )}

                    {/* USUÁRIO MOBILE */}

                    {user.nome ? (

                        <div className="border-t border-gray-700 px-5 py-4">

                            <div className="flex flex-col gap-3">

                                {/* USUÁRIO */}

                                <div>

                                    <p className="text-sm text-gray-400">
                                        Bem vindo(a)
                                    </p>

                                    <button
                                        onClick={() => navegar("/area-candidato")}
                                        className="font-bold hover:text-gray-300"
                                    >
                                        {user.nome}
                                    </button>

                                </div>

                                {/* SAIR */}

                                <button
                                    onClick={fazerLogout}
                                    className="flex items-center gap-2 text-left text-red-400 hover:text-red-300 transition"
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    Sair
                                </button>

                            </div>

                        </div>

                    ) : (

                        /* LOGIN */

                        <button
                            onClick={() => navegar("/login")}
                            className="w-full text-left px-5 py-4 hover:bg-gray-700 transition"
                        >
                            <i className="bi bi-box-arrow-in-right"></i> Login
                        </button>

                    )}

                </div>
            )}

        </nav>
    );
}