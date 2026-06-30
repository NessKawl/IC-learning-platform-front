// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { CreateCurso } from "../service/cursoService";

export default function CriarCurso() {
    const [form, setForm] = useState({
        cur_titulo: "",
        cur_descricao: "",
        cur_publico: "",
        cur_n_modulos: "",
        cur_conteudo_modulos: "",
        cur_carga_horaria_modulos: "",
        cur_forma_avaliacao: "",
    });

    const [file, setFile] = useState<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const navigate = useNavigate();

    function handleChange(e: any) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (!file) {
            alert("Selecione uma imagem");
            return;
        }

        const formData = new FormData();

        formData.append("cur_titulo", form.cur_titulo);
        formData.append("cur_descricao", form.cur_descricao);

        formData.append("cur_publico", form.cur_publico);
        formData.append("cur_n_modulos", form.cur_n_modulos);
        formData.append(
            "cur_conteudo_modulos",
            form.cur_conteudo_modulos
        );
        formData.append(
            "cur_carga_horaria_modulos",
            form.cur_carga_horaria_modulos
        );
        formData.append(
            "cur_forma_avaliacao",
            form.cur_forma_avaliacao
        );

        formData.append("file", file);
        await CreateCurso(formData);

        alert("Curso criado com sucesso!");

        navigate("/cursos");
    };



    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <NavBar />

            <div className="min-h-screen flex items-center flex-col justify-center bg-gray-900 text-white">


                <div className="bg-gray-800 p-8 rounded-xl w-11/12 ">

                    <h2 className="text-2xl mb-6 font-bold text-center">
                        Nova Proposta de Curso
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-4 m-2">
                                <input
                                    type="text"
                                    name="cur_titulo"
                                    placeholder="Título do Curso"
                                    value={form.cur_titulo}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg bg-gray-700 outline-none"
                                    required
                                />
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="">Upload Imagem capa</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="p-3 rounded-lg bg-gray-700 outline-none"
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="cur_descricao"
                                    placeholder="Descrição do Curso"
                                    value={form.cur_descricao}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg bg-gray-700 outline-none"
                                />
                                <input
                                    type="text"
                                    name="cur_forma_avaliacao"
                                    placeholder="Forma de avaliação"
                                    value={form.cur_forma_avaliacao}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg bg-gray-700 outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-4 m-2">
                                <input
                                    type="text"
                                    name="cur_publico"
                                    placeholder="Público alvo"
                                    value={form.cur_publico}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg bg-gray-700 outline-none"
                                    required
                                />
                                <input
                                    type="text"
                                    name="cur_n_modulos"
                                    placeholder="Número de módulos"
                                    value={form.cur_n_modulos}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg bg-gray-700 outline-none"
                                    required
                                />
                                <input
                                    type="text"
                                    name="cur_conteudo_modulos"
                                    placeholder="Conteúdo módulos"
                                    value={form.cur_conteudo_modulos}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg bg-gray-700 outline-none"
                                />
                                <input
                                    type="text"
                                    name="cur_carga_horaria_modulos"
                                    placeholder="Carga horária dos módulos"
                                    value={form.cur_carga_horaria_modulos}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg bg-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        {/* <input
                            type="text"
                            name="cur_capa_url"
                            placeholder="URL da Capa do Curso"
                            value={form.cur_capa_url}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-700 outline-none"
                            required
                        /> */}
                        <div className="flex flex-col gap-1  m-auto">
                            <label htmlFor="">Upload currículo</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="p-3 rounded-lg bg-gray-700 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700 mt-4"
                        >
                            Criar Curso
                        </button>
                    </form>



                </div>
            </div>
        </div>
    );
}