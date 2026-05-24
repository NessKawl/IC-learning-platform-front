import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

type Usuario = {
    id: number;
    nome: string;
    email: string;
};

type Curso = {
    id: number;
    titulo: string;
    descricao: string;
    capa: string;
    progresso: number;
    moduloAtual: string;
};

export default function AreaCandidato() {
    const navigate = useNavigate();

    const [user, setUser] =
        useState<Usuario | null>(null);

    const [cursos, setCursos] =
        useState<Curso[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function carregarDados() {
            try {
                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await fetch(
                        "http://localhost:3000/area-candidato/me",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                setUser(data.usuario);
                setCursos(data.cursos);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    if (loading) {
        return (
            <div>
                Carregando...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            
            <NavBar />

            <div className="max-w-7xl mx-auto p-6">

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold">
                        Área do Candidato
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Bem-vindo(a),{" "}
                        {user?.nome}
                    </p>

                    <p className="text-sm text-gray-400">
                        {user?.email}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 mb-8">

                    <div className="bg-gray-900 p-6 rounded-2xl shadow">
                        <h2 className="text-gray-500 text-sm">
                            Cursos Matriculados
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {cursos.length}
                        </p>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl shadow">
                        <h2 className="text-gray-500 text-sm">
                            Progresso Médio
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {cursos.length > 0
                                ? Math.round(
                                    cursos.reduce(
                                        (
                                            acc,
                                            curso
                                        ) =>
                                            acc +
                                            curso.progresso,
                                        0
                                    ) /
                                    cursos.length
                                )
                                : 0}
                            %
                        </p>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl shadow">
                        <h2 className="text-gray-500 text-sm">
                            Cursos Finalizados
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {
                                cursos.filter(
                                    (
                                        curso
                                    ) =>
                                        curso.progresso >=
                                        100
                                ).length
                            }
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cursos.map(
                        (curso) => (
                            <div
                                key={
                                    curso.id
                                }
                                className="bg-gray-900 rounded-2xl overflow-hidden shadow"
                            >
                                <img
                                    src={
                                        curso.capa
                                    }
                                    alt={
                                        curso.titulo
                                    }
                                    className="w-full h-48 object-cover"
                                />

                                <div className="p-5">
                                    <h3 className="font-bold text-xl">
                                        {
                                            curso.titulo
                                        }
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2">
                                        {
                                            curso.descricao
                                        }
                                    </p>

                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>
                                                Progresso
                                            </span>

                                            <span>
                                                {
                                                    curso.progresso
                                                }
                                                %
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-green-500 h-3 rounded-full"
                                                style={{
                                                    width: `${curso.progresso}%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        className="w-full mt-5 bg-blue-600 text-white py-2 rounded-xl"
                                        onClick={() =>
                                            navigate(
                                                `/curso/${curso.id}`
                                            )
                                        }
                                    >
                                        Continuar
                                        Curso
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}