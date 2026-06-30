import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronDown, PlayCircle, FileText } from "lucide-react";
import { GetCursoId } from "../service/cursoService";
import { CriarMatricula, BuscarMatriculaCurso } from "../service/matriulaService";

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

    const userStorage = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null;
    const navigate = useNavigate();

    const [curso, setCurso] = useState<Curso | null>(null);
    const [moduloAberto, setModuloAberto] = useState<number | null>(null);

    const [materialSelecionado, setMaterialSelecionado] = useState<Material | null>(null);


    const [matricula, setMatricula] = useState<{
        matriculado: boolean;
        progresso: number;
    } | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchCurso = async () => {
            try {
                const data = await GetCursoId(id);
                setCurso(data);

                // verifica matrícula se usuário estiver logado
                const userStorage = localStorage.getItem("user");

                if (userStorage) {
                    const user = JSON.parse(userStorage);

                    // Buscar matrícula do usuário no curso
                    const matriculaData = await BuscarMatriculaCurso(
                        user.usu_id,
                        Number(id)
                    );

                    if (matriculaData) {
                        setMatricula({
                            matriculado: true,
                            progresso: matriculaData.progresso ?? 0,
                        });
                    }

                    console.log("teste:", matricula);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCurso();
    }, [id]);

    const toggleModulo = (id: number) => {
        setModuloAberto(moduloAberto === id ? null : id);
    };

    const handleComecarCurso = async () => {
        try {
            if (!id) return;

            // Verifica login antes de tentar matricular
            if (!userStorage) {
                alert("Faça login para se matricular no curso.");
                return navigate("/login");
            }

            await CriarMatricula(Number(id));

            alert("Matrícula realizada!");
            return navigate("/area-candidato")

        } catch (error) {
            console.error("err:", error);
            alert("Você já está matriculado.");
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const renderMaterial = () => {

        if (!matricula?.matriculado) {
            return (
                <div className="bg-gray-900 rounded-2xl h-[400px] flex items-center justify-center text-gray-400 border border-gray-800">
                    Faça matrícula para acessar os conteúdos do curso
                </div>
            );
        }

        if (!materialSelecionado) {
            return (
                <div className="bg-gray-900 rounded-2xl h-[400px] flex items-center justify-center text-gray-400 border border-gray-800">
                    Selecione um conteúdo para visualizar
                </div>
            );
        }

        const tipo = materialSelecionado.tim_tipo_matarial?.tim_nome?.toLowerCase();

        // vídeo
        if (tipo === "vídeo" || tipo === "video") {
            return (
                <video
                    controls
                    className="w-full h-[400px] rounded-2xl bg-black"
                >
                    <source
                        src={materialSelecionado.mat_url}
                        type="video/mp4"
                    />
                    Seu navegador não suporta vídeo.
                </video>
            );
        }

        // imagem
        if (tipo === "imagem") {
            return (
                <img
                    src={materialSelecionado.mat_url}
                    alt={materialSelecionado.mat_titulo}
                    className="w-full h-[400px] object-contain rounded-2xl bg-gray-900"
                />
            );
        }

        // pdf
        if (tipo === "pdf") {
            return (
                <iframe
                    src={materialSelecionado.mat_url}
                    className="w-full h-[600px] rounded-2xl border border-gray-800"
                />
            );
        }

        // documento / outro
        return (
            <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-800">
                <p className="mb-4">
                    Este conteúdo precisa ser aberto externamente.
                </p>

                <a
                    href={materialSelecionado.mat_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
                >
                    Abrir Material
                </a>
            </div>
        );
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
                        {renderMaterial()}

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
                                            className={`transition-all duration-300 overflow-hidden ${moduloAberto === modulo.mod_id ? "max-h-[500px]" : "max-h-0"}`}
                                        >
                                            <div className="p-5 border-t border-gray-800">
                                                <div className="space-y-3">
                                                    {modulo.materais?.length ? (
                                                        modulo.materais.map((conteudo) => (
                                                            <button
                                                                key={conteudo.mat_id}
                                                                onClick={() => {
                                                                    setMaterialSelecionado(conteudo)
                                                                    scrollToTop()
                                                                }}
                                                                className={`w-full flex items-center justify-between bg-gray-800 p-4 rounded-xl hover:text-blue-400 hover:bg-gray-700 hover:cursor-pointer transition ${materialSelecionado?.mat_id === conteudo.mat_id ? "bg-blue-900 text-blue-400" : ""}`}
                                                            >
                                                                <div className="flex items-center gap-3 ho">

                                                                    {conteudo.tim_tipo_matarial?.tim_nome?.toLowerCase() ===
                                                                        "vídeo" ||
                                                                        conteudo.tim_tipo_matarial?.tim_nome?.toLowerCase() ===
                                                                        "video" ? (
                                                                        <PlayCircle size={22} />
                                                                    ) : (
                                                                        <FileText size={22} />
                                                                    )}

                                                                    <div>
                                                                        <p className="font-medium">
                                                                            {conteudo.mat_titulo}
                                                                        </p>

                                                                        <p className="text-sm text-gray-400">
                                                                            {
                                                                                conteudo.tim_tipo_matarial
                                                                                    ?.tim_nome
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </button>))
                                                    ) : (
                                                        <div className="text-gray-500 text-sm">
                                                            Nenhum material neste módulo
                                                        </div>
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

                            <div className="mt-6">
                                {matricula?.matriculado ? (
                                    <div className="space-y-3">
                                        <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
                                            <p className="font-semibold text-green-400">
                                                Você já está matriculado
                                            </p>

                                            <p className="text-sm text-gray-300 mt-1">
                                                Progresso: {matricula.progresso}%
                                            </p>

                                            <div className="w-full bg-gray-800 rounded-full h-3 mt-3 overflow-hidden">
                                                <div
                                                    className="bg-green-500 h-full transition-all"
                                                    style={{
                                                        width: `${matricula.progresso}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* <button
                                            className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-xl font-semibold"
                                        >
                                            Continuar Curso
                                        </button> */}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleComecarCurso()
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-semibold"
                                    >
                                        Começar Curso
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}