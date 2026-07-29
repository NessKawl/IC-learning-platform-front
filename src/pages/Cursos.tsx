// src/pages/Courses.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GetCursos } from "../service/cursoService";
import NavBar from "../components/NavBar";
import { usuarioService } from "../service/usuarioService";
interface Course {
    cur_id: number;
    cur_titulo: string;
    cur_descricao: string;
    cur_capa_url: string;
};

export default function Cursos() {
    const [cursos, setCursos] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCursos = async () => {
            const data = await GetCursos();
            setCursos(data);
        };
        fetchCursos();

    }, []);



    useEffect(() => {
        const userStorage = localStorage.getItem("user");

        if (userStorage) {
            setUser(JSON.parse(userStorage));
        }
    }, []);

    const userStorage = JSON.parse(localStorage.getItem("user") || "{}");

    const [estatisticas, setEstatisticas] = useState({
        alunos: 0,
        professores: 0,
    });

    useEffect(() => {
        async function carregarEstatisticas() {
            const data = await usuarioService.GetEstatisticasUsuarios();
            setEstatisticas(data);
        }

        carregarEstatisticas();
    }, []);

    useEffect(() => {
        function atualizarUsuario() {
            const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");

            setUser({
                nome: updatedUser.usu_nome || "",
                email: updatedUser.usu_email || ""
            });
        }

        atualizarUsuario();

        window.addEventListener("storage", atualizarUsuario);

        return () => {
            window.removeEventListener("storage", atualizarUsuario);
        };
    }, []);

    const navigate = useNavigate();
    const [user, setUser] = useState({
        nome: userStorage.usu_nome || "",
        email: userStorage.usu_email || ""
    });

    const handleCardClick = (id: number) => {
        navigate(`/detalhe-curso?id=${id}`)
    }

    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        setQuery(searchParams.get("search") || "");
    }, [searchParams]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const cursosFiltrados = cursos.filter((curso) =>
        curso.cur_titulo.toLowerCase().includes(query.toLowerCase()) ||
        curso.cur_descricao.toLowerCase().includes(query.toLowerCase())
    );


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        navigate(`/cursos?search=${encodeURIComponent(query)}`);

        setTimeout(() => {
            document.getElementById("lista-cursos")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden border-b border-slate-800 ">
            <NavBar />
            <div className="relative bg-gradient-to-r from-blue-600/20 to-cyan-500/10">
                <section className="relative overflow-hidden border-b border-slate-800">

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 blur-3xl" />

                    <div className="relative max-w-7xl mx-auto px-6 py-20">

                        <h1 className="text-5xl font-bold">
                            Explore nossos cursos
                        </h1>

                        <p className="mt-5 text-gray-400 max-w-2xl">
                            Aprenda com especialistas e desenvolva habilidades para crescer na sua carreira.
                        </p>

                        <form onSubmit={handleSearch} className="mt-8 flex">
                            <input
                                placeholder="Pesquisar cursos..."
                                className="flex-1 bg-slate-800 rounded-l-xl px-5 py-4 outline-none"
                                value={query}
                                onChange={handleInputChange}
                            />

                            <button className="bg-blue-600 px-8 rounded-r-xl hover:bg-blue-700">
                                Buscar
                            </button>
                        </form>


                    </div>
                </section >


                <div className="max-w-7xl mx-auto px-6 py-8">

                    <div className="flex flex-wrap gap-3">

                        {[
                            "Todos",
                            "Programação",
                            "Design",
                            "Marketing",
                            "DevOps",
                            "IA",
                            "Mobile",
                            "Banco de Dados"
                        ].map(cat => (

                            <button
                                key={cat}
                                className="bg-slate-800 hover:bg-blue-600 px-5 py-2 rounded-full transition"
                            >
                                {cat}
                            </button>

                        ))}

                    </div>

                </div>

                <section className="max-w-7xl mx-auto py-12">

                    <div className="grid md:grid-cols-4 gap-6">

                        <div className="bg-slate-900 rounded-xl p-6">

                            <h2 className="text-3xl font-bold">
                                {cursos.length}
                            </h2>

                            <p className="text-gray-400">
                                Cursos
                            </p>

                        </div>

                        <div className="bg-slate-900 rounded-xl p-6">

                            <h2 className="text-3xl font-bold">
                                +1500
                                {/* {estatisticas.alunos} */}
                            </h2>

                            <p className="text-gray-400">
                                Alunos
                            </p>

                        </div>

                        <div className="bg-slate-900 rounded-xl p-6">

                            <h2 className="text-3xl font-bold">
                                97%
                            </h2>

                            <p className="text-gray-400">
                                Satisfação
                            </p>

                        </div>

                        <div className="bg-slate-900 rounded-xl p-6">

                            <h2 className="text-3xl font-bold">
                                +50
                                {/* {estatisticas.professores} */}
                            </h2>

                            <p className="text-gray-400">
                                Professores
                            </p>

                        </div>

                    </div>

                </section>

                <hr className="mb-12 mx-30" />

                {cursosFiltrados.length === 0 ? (
                    <div id="lista-cursos" className="text-center py-20">
                        <h2 className="text-2xl font-bold">
                            Nenhum curso encontrado
                        </h2>

                        <p className="text-gray-400 mt-3">
                            Tente pesquisar por outro termo.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-4 gap-6 mx-auto max-w-7xl" id="lista-cursos">
                        {cursosFiltrados.map((curso) => (
                            <div
                                key={curso.cur_id}
                                onClick={() => handleCardClick(curso.cur_id)}
                                className="group cursor-pointer bg-gray-800 rounded-2xl overflow-hidden border border-black hover:border-blue-500 transition duration-300"
                            >

                                <div className="relative overflow-hidden">

                                    <img
                                        src={curso.cur_capa_url}
                                        alt={curso.cur_titulo}
                                        className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                                    />

                                </div>

                                <div className="p-5">

                                    <span className="text-sm text-blue-400">
                                        Desenvolvimento
                                    </span>

                                    <h2 className="text-2xl font-bold mt-2 line-clamp-2">
                                        {curso.cur_titulo}
                                    </h2>

                                    <p className="text-gray-400 mt-3 line-clamp-3">
                                        {curso.cur_descricao}
                                    </p>

                                    <div className="flex justify-between items-center mt-6">

                                        <span className="text-green-400 font-semibold">
                                            Gratuito
                                        </span>

                                        <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
                                            Ver curso
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div >
        </div >
    );
}