import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, PlayCircle, FileText } from "lucide-react";
import { GetCursoId } from "../service/cursoService";

interface Material {
    mat_id: number;
    mat_titulo: string;
    mat_url: string;
    mat_ordem: number;

    tim_tipo_matarial: {
        tim_nome: string;
    };
}

interface Modulo {
    mod_id: number;
    mod_titulo: string;
    mod_descricao: string;

    materais: Material[];
}

interface Curso {
    cur_titulo: string;
    cur_descricao: string;
    cur_capa_url: string;

    modulos: Modulo[];
}

export default function DetalheCurso() {
    const [searchParam] = useSearchParams();
    const id = searchParam.get("id");

    const [curso, setCurso] = useState<Curso | null>(null);
    const [moduloAberto, setModuloAberto] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchCurso = async () => {
            try {
                const data = await GetCursoId(id);
                setCurso(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCurso();
    }, [id]);

    const toggleModulo = (id: number) => {
        setModuloAberto(moduloAberto === id ? null : id);
    };

    if (!curso) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                Carregando curso...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Conteúdo principal */}
                    <div className="lg:col-span-2">
                        <img
                            src={curso.cur_capa_url}
                            alt={curso.cur_titulo}
                            className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
                        />

                        <h1 className="text-4xl font-bold mt-6">
                            {curso.cur_titulo}
                        </h1>

                        <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                            {curso.cur_descricao}
                        </p>

                        {/* Módulos */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-semibold mb-5">
                                Conteúdo do Curso
                            </h2>

                            <div className="space-y-4">
                                {curso.modulos?.map((modulo) => (
                                    <div
                                        key={modulo.mod_id}
                                        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() =>
                                                toggleModulo(modulo.mod_id)
                                            }
                                            className="w-full flex justify-between items-center p-5 hover:bg-gray-800 transition"
                                        >
                                            <div className="text-left">
                                                <h3 className="font-semibold text-lg">
                                                    {modulo.mod_titulo}
                                                </h3>

                                                <p className="text-sm text-gray-400">
                                                    {modulo.materais?.length || 0} conteúdos
                                                </p>
                                            </div>

                                            <ChevronDown
                                                className={`transition-transform duration-300 ${moduloAberto === modulo.mod_id
                                                    ? "rotate-180"
                                                    : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* Accordion */}
                                        <div
                                            className={`transition-all duration-300 overflow-hidden ${moduloAberto === modulo.mod_id
                                                ? "max-h-[500px]"
                                                : "max-h-0"
                                                }`}
                                        >
                                            <div className="p-5 border-t border-gray-800">
                                                <div className="space-y-3">
                                                    {modulo.materais?.map(
                                                        (conteudo) => (
                                                            <div
                                                                key={conteudo.mat_id}
                                                                className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl hover:bg-gray-700 cursor-pointer transition"
                                                            >
                                                                {conteudo.tim_tipo_matarial.tim_nome ===
                                                                    "video" ? (
                                                                    <PlayCircle size={22} />
                                                                ) : (
                                                                    <FileText size={22} />
                                                                )}

                                                                <span>
                                                                    {
                                                                        conteudo.mat_titulo
                                                                    }
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">
                                Sobre o Curso
                            </h2>

                            <div className="space-y-4 text-gray-300">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Módulos
                                    </p>
                                    <p>
                                        {curso.modulos?.length || 0}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Conteúdos
                                    </p>
                                    <p>
                                        {curso.modulos?.reduce(
                                            (acc, mod) =>
                                                acc +
                                                (mod.materais?.length || 0),
                                            0
                                        )}
                                    </p>
                                </div>
                            </div>

                            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-semibold">
                                Começar Curso
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}