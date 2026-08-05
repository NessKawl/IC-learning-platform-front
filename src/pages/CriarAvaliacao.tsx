import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";

import { GetCursosPorUsuario } from "../service/cursoService";
import { GetModuloByCurso } from "../service/moduloService";
import { CreateAvaliacao } from "../service/avaliacaoService";
// import { CreateAvaliacao } from "../service/avaliacaoService";

interface Curso {
    cur_id: number;
    cur_titulo: string;
}

interface Modulo {
    mod_id: number;
    mod_titulo: string;
}

interface Alternativa {
    texto: string;
    correta: boolean;
}

interface Questao {
    texto: string;
    alternativas: Alternativa[];
}

export default function CriarAvaliacao() {

    const navigate = useNavigate();

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [loadingModulos, setLoadingModulos] = useState(false);

    const [form, setForm] = useState({
        curso_id: "",
        mod_id: "",
        ava_titulo: "",
        ava_tipo: "QUIZ",
        ava_tempo_limite: "",
        proctoring: false
    });

    const [questoes, setQuestoes] = useState<Questao[]>(
        Array.from({ length: 10 }, () => ({
            texto: "",
            alternativas: [
                { texto: "", correta: true },
                { texto: "", correta: false },
                { texto: "", correta: false },
                { texto: "", correta: false }
            ]
        }))
    );
    useEffect(() => {

        async function carregarCursos() {

            const data =
                await GetCursosPorUsuario();

            setCursos(data);
        }

        carregarCursos();

    }, []);

    useEffect(() => {

        async function carregarModulos() {

            if (!form.curso_id) {

                setModulos([]);

                return;
            }

            setLoadingModulos(true);

            const data =
                await GetModuloByCurso(
                    Number(form.curso_id)
                );

            setModulos(data);

            setLoadingModulos(false);
        }

        carregarModulos();

    }, [form.curso_id]);

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement
        >
    ) {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === "curso_id"
                ? { mod_id: "" }
                : {})
        }));
    }

    function alterarQuestao(
        indice: number,
        texto: string
    ) {

        const copia = [...questoes];

        copia[indice].texto = texto;

        setQuestoes(copia);
    }

    function alterarAlternativa(
        questao: number,
        alternativa: number,
        valor: string
    ) {

        const copia = [...questoes];

        copia[questao]
            .alternativas[alternativa]
            .texto = valor;

        setQuestoes(copia);
    }

    function definirCorreta(
        questao: number,
        alternativa: number
    ) {

        const copia = [...questoes];

        copia[questao].alternativas =
            copia[questao].alternativas.map((a, index) => ({
                ...a,
                correta: index === alternativa
            }));

        setQuestoes(copia);
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        const payload = {

            ...form,

            questoes
        };

        console.log(payload);

        await CreateAvaliacao({

            ava_titulo: form.ava_titulo,

            ava_tipo: form.ava_tipo,

            ava_tempo_limite: Number(form.ava_tempo_limite),

            proctoring: form.proctoring,

            mod_id: Number(form.mod_id),

            questoes

        });
        alert("Avaliação criada.");

        navigate("/cursos");
    }

    return (

        <div className="min-h-screen bg-gray-950 text-white">

            <NavBar />

            <div className="max-w-5xl mx-auto py-10 px-6">

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

                    <h1 className="text-3xl font-bold mb-8">

                        Nova Avaliação

                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <select
                            name="curso_id"
                            value={form.curso_id}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-gray-800"
                        >

                            <option value="">
                                Curso
                            </option>

                            {cursos.map(c => (

                                <option
                                    key={c.cur_id}
                                    value={c.cur_id}
                                >

                                    {c.cur_titulo}

                                </option>

                            ))}

                        </select>

                        <select
                            name="mod_id"
                            value={form.mod_id}
                            onChange={handleChange}
                            disabled={!form.curso_id}
                            className="w-full p-4 rounded-xl bg-gray-800"
                        >

                            <option>

                                {loadingModulos
                                    ? "Carregando..."
                                    : "Módulo"}

                            </option>

                            {modulos.map(m => (

                                <option
                                    key={m.mod_id}
                                    value={m.mod_id}
                                >

                                    {m.mod_titulo}

                                </option>

                            ))}

                        </select>

                        <input
                            name="ava_titulo"
                            value={form.ava_titulo}
                            onChange={handleChange}
                            placeholder="Título da avaliação"
                            className="w-full p-4 rounded-xl bg-gray-800"
                        />

                        <input
                            name="ava_tempo_limite"
                            value={form.ava_tempo_limite}
                            onChange={handleChange}
                            placeholder="Tempo limite questões (minutos)"
                            className="w-full p-4 rounded-xl bg-gray-800"
                        />

                        <div className="space-y-8">

                            {questoes.map((q, i) => (

                                <div
                                    key={i}
                                    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                                >

                                    <h2 className="font-bold mb-4">

                                        Questão {i + 1}

                                    </h2>

                                    <textarea
                                        value={q.texto}
                                        onChange={(e) =>
                                            alterarQuestao(
                                                i,
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-3 rounded-lg bg-gray-900 mb-4"
                                        placeholder="Digite a pergunta..."
                                    />

                                    {q.alternativas.map((a, j) => (

                                        <div
                                            key={j}
                                            className="flex gap-3 items-center mb-3"
                                        >

                                            <input
                                                type="radio"
                                                checked={a.correta}
                                                onChange={() =>
                                                    definirCorreta(i, j)
                                                }
                                            />

                                            <input
                                                type="text"
                                                value={a.texto}
                                                onChange={(e) =>
                                                    alterarAlternativa(
                                                        i,
                                                        j,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={`Alternativa ${String.fromCharCode(65 + j)}`}
                                                className="flex-1 p-3 rounded-lg bg-gray-900"
                                            />

                                        </div>

                                    ))}

                                </div>

                            ))}

                        </div>

                        <button
                            className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-semibold"
                        >

                            Criar Avaliação

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}