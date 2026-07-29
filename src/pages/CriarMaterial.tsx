    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";

    import NavBar from "../components/NavBar";

    import { GetCursosPorUsuario } from "../service/cursoService";
    import { GetModuloByCurso } from "../service/moduloService";
    import { CreateMaterial } from "../service/materialService";

    interface Curso {
        cur_id: number;
        cur_titulo: string;
    }

    interface Modulo {
        mod_id: number;
        mod_titulo: string;
    }

    export default function CriarMaterial() {

        const navigate = useNavigate();

        const [file, setFile] =
            useState<File | null>(null);

        const [cursos, setCursos] =
            useState<Curso[]>([]);

        const [modulos, setModulos] =
            useState<Modulo[]>([]);

        const [loadingModulos,
            setLoadingModulos] =
            useState(false);

        const [form, setForm] =
            useState({
                curso_id: "",
                mod_id: "",
                mat_titulo: "",
                mat_ordem: 1,
                tim_id: 1,
            });

        useEffect(() => {

            async function fetchCursos() {

                const data =
                    await GetCursosPorUsuario();

                setCursos(data);
            }

            fetchCursos();

        }, []);

        useEffect(() => {

            async function fetchModulos() {

                if (!form.curso_id) {

                    setModulos([]);

                    return;
                }

                try {

                    setLoadingModulos(true);

                    const data =
                        await GetModuloByCurso(
                            Number(form.curso_id)
                        );

                    setModulos(data);

                } catch (error) {

                    console.error(
                        "Erro ao carregar módulos",
                        error
                    );

                } finally {

                    setLoadingModulos(false);
                }
            }

            fetchModulos();

        }, [form.curso_id]);

        function handleChange(
            e: React.ChangeEvent<
                HTMLInputElement |
                HTMLSelectElement
            >
        ) {

            const { name, value } =
                e.target;

            setForm((prev) => ({
                ...prev,
                [name]: value,

                ...(name === "curso_id"
                    ? { mod_id: "" }
                    : {}),
            }));
        }

        function handleFile(
            e: React.ChangeEvent<HTMLInputElement>
        ) {

            if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
            }
        }

        async function handleSubmit(
            e: React.FormEvent
        ) {

            e.preventDefault();

            if (!file) {
                alert("Selecione um arquivo");
                return;
            }

            if (!form.mod_id) {
                alert("Selecione um módulo");
                return;
            }

            try {

                const formData =
                    new FormData();

                formData.append(
                    "mat_titulo",
                    form.mat_titulo
                );

                formData.append(
                    "mat_ordem",
                    String(form.mat_ordem)
                );

                formData.append(
                    "tim_id",
                    String(form.tim_id)
                );

                formData.append(
                    "mod_id",
                    form.mod_id
                );

                formData.append(
                    "file",
                    file
                );

                await CreateMaterial(
                    formData
                );

                alert(
                    "Material criado com sucesso!"
                );

                navigate("/cursos");

            } catch (error) {

                console.error(error);

                alert(
                    "Erro ao criar material"
                );
            }
        }

        return (
            <div className="min-h-screen bg-gray-950 text-white">

                <NavBar />

                <div className="max-w-2xl mx-auto py-12 px-6">

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

                        <h1 className="text-3xl font-bold mb-8">
                            Novo Material
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* CURSO */}
                            <div>
                                <label className="block mb-2 text-gray-400">
                                    Curso
                                </label>

                                <select
                                    name="curso_id"
                                    value={form.curso_id}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700"
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

                            {/* MÓDULO */}
                            <div>
                                <label className="block mb-2 text-gray-400">
                                    Módulo
                                </label>

                                <select
                                    name="mod_id"
                                    value={form.mod_id}
                                    onChange={handleChange}
                                    disabled={!form.curso_id}
                                    className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 disabled:opacity-50"
                                    required
                                >
                                    <option value="">
                                        {loadingModulos
                                            ? "Carregando..."
                                            : "Selecione um módulo"}
                                    </option>

                                    {modulos.map((modulo) => (
                                        <option
                                            key={modulo.mod_id}
                                            value={modulo.mod_id}
                                        >
                                            {modulo.mod_titulo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* TÍTULO */}
                            <input
                                type="text"
                                name="mat_titulo"
                                placeholder="Título do material"
                                value={form.mat_titulo}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700"
                                required
                            />

                            {/* ORDEM */}
                            <input
                                type="number"
                                name="mat_ordem"
                                placeholder="Ordem"
                                value={form.mat_ordem}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700"
                            />

                            {/* TIPO */}
                            <select
                                name="tim_id"
                                value={form.tim_id}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700"
                            >
                                <option value={1}>
                                    Vídeo
                                </option>

                                <option value={2}>
                                    PDF
                                </option>

                                <option value={3}>
                                    Imagem
                                </option>
                            </select>

                            {/* FILE */}
                            <input
                                type="file"
                                onChange={handleFile}
                                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700"
                                required
                            />

                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 transition py-4 rounded-xl font-semibold"
                            >
                                Criar Material
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }