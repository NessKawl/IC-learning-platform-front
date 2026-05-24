import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";

import { CreateModulo } from "../service/moduloService";
import { GetCursos } from "../service/cursoService";

interface Curso {
    cur_id: number;
    cur_titulo: string;
}

export default function CriarModulo() {

    const navigate = useNavigate();

    const [cursos, setCursos] = useState<Curso[]>([]);

    const [form, setForm] = useState({
        mod_titulo: "",
        mod_descricao: "",
        cur_id: "",
    });

    useEffect(() => {

        async function fetchCursos() {

            try {

                const data = await GetCursos();

                setCursos(data);

            } catch (error) {
                console.error(
                    "Erro ao buscar cursos",
                    error
                );
            }
        }

        fetchCursos();

    }, []);

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        if (!form.cur_id) {
            alert("Selecione um curso");
            return;
        }

        try {

            await CreateModulo(
                form.mod_titulo,
                form.mod_descricao,
                Number(form.cur_id)
            );

            alert("Módulo criado com sucesso!");

            navigate("/cursos");

        } catch (error) {

            console.error(error);

            alert("Erro ao criar módulo");
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            <NavBar />

            <div className="max-w-2xl mx-auto py-12 px-6">

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

                    <h1 className="text-3xl font-bold mb-8">
                        Criar Módulo
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Curso */}
                        <div>

                            <label className="block mb-2 text-gray-400">
                                Curso
                            </label>

                            <select
                                name="cur_id"
                                value={form.cur_id}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-800 outline-none border border-gray-700"
                                required
                            >
                                <option value="">
                                    Selecione um curso
                                </option>

                                {cursos.map((curso) => (
                                    <option
                                        key={curso.cur_id}
                                        value={curso.cur_id}
                                    >
                                        {curso.cur_titulo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Título */}
                        <div>

                            <label className="block mb-2 text-gray-400">
                                Título do módulo
                            </label>

                            <input
                                type="text"
                                name="mod_titulo"
                                value={form.mod_titulo}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-800 outline-none border border-gray-700"
                                required
                            />
                        </div>

                        {/* Descrição */}
                        <div>

                            <label className="block mb-2 text-gray-400">
                                Descrição
                            </label>

                            <textarea
                                name="mod_descricao"
                                value={form.mod_descricao}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-800 outline-none border border-gray-700 min-h-[120px]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl font-semibold"
                        >
                            Criar módulo
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}