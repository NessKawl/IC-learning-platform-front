import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { GetCursosPorUsuario } from "../service/cursoService";
import { useNavigate } from "react-router-dom";
import { buscaAlunosProfessor } from "../service/matriulaService";

type Curso = {
    cur_id: number;
    cur_titulo: string;
    cur_descricao: string;
    cur_capa_url: string;
};

export default function MeusCursos() {

    const navigate =
        useNavigate();

    const [cursos, setCursos] =
        useState<Curso[]>([]);

    const [alunos, setAlunos] =
        useState({
            totalAlunos: 0,
        });

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    async function carregarCursos() {
        try {

            const data =
                await GetCursosPorUsuario();

            setCursos(data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function carregarAlunos() {
        try {

            const data = await buscaAlunosProfessor();

            setAlunos(data);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        carregarCursos();
        carregarAlunos();
    }, []);

    const cursosFiltrados =
        cursos.filter(curso =>
            curso.cur_titulo
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                Carregando...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            <NavBar />

            <div className="max-w-7xl mx-auto p-6">

                {/* Header */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <i className="bi bi-journal-bookmark-fill"></i>
                                Meus Cursos
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Gerencie os cursos
                                criados por você
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/criar-curso"
                                )
                            }
                            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl font-semibold"
                        >
                            <i className="bi bi-plus-lg mr-2"></i>
                            Novo Curso
                        </button>

                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                    <div className="bg-gray-900 p-6 rounded-2xl shadow">

                        <h2 className="text-gray-500 text-sm">
                            Total de Cursos
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {cursos.length}
                        </p>

                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl shadow">

                        <h2 className="text-gray-500 text-sm">
                            Total de Matrículas
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {alunos.totalAlunos}
                        </p>

                    </div>

                </div>

                {/* Busca */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-8">

                    <div className="relative">

                        <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>

                        <input
                            type="text"
                            placeholder="Buscar curso..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 transition"
                        />

                    </div>
                </div>

                {/* Empty state */}
                {cursosFiltrados.length === 0 ? (

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">

                        <i className="bi bi-journal-x text-6xl text-gray-600"></i>

                        <h2 className="text-2xl font-bold mt-5">
                            Nenhum curso encontrado
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Você ainda não criou
                            cursos ou sua busca
                            não encontrou resultados.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {cursosFiltrados.map(
                            (curso) => (

                                <div
                                    key={
                                        curso.cur_id
                                    }
                                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition shadow"
                                >

                                    <img
                                        src={
                                            curso.cur_capa_url
                                        }
                                        alt={
                                            curso.cur_titulo
                                        }
                                        className="w-full h-52 object-cover"
                                    />

                                    <div className="p-5">

                                        <h2 className="text-xl font-bold">
                                            {
                                                curso.cur_titulo
                                            }
                                        </h2>

                                        <p className="text-gray-500 mt-2 text-sm line-clamp-3">
                                            {
                                                curso.cur_descricao
                                            }
                                        </p>

                                        <div className="flex gap-3 mt-5">

                                            <button
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 transition py-2 rounded-xl font-medium"
                                                onClick={() =>
                                                    navigate(
                                                        `/detalhe-curso?id=${curso.cur_id}`
                                                    )
                                                }
                                            >
                                                Ver Curso
                                            </button>

                                            <button
                                                className="px-4 bg-gray-800 hover:bg-gray-700 transition rounded-xl"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}