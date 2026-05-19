// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { CreateCurso } from "../service/cursoService";

export default function CriarCurso() {
    const [form, setForm] = useState({
        cur_titulo: "",
        cur_descricao: "",
        professor_id: 1
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
        formData.append("professor_id", String(form.professor_id));

        formData.append("file", file);

        await CreateCurso(formData);

        alert("Curso criado com sucesso!");

        navigate("/cursos");
    };



    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <NavBar />

            <div className="min-h-screen flex items-center flex-col justify-center bg-gray-900 text-white">


                <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">

                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Novo Curso
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="p-3 rounded-lg bg-gray-700 outline-none"
                        />

                        <input
                            type="text"
                            name="cur_titulo"
                            placeholder="Título do Curso"
                            value={form.cur_titulo}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-700 outline-none"
                            required
                        />

                        <input
                            type="text"
                            name="cur_descricao"
                            placeholder="Descrição do Curso"
                            value={form.cur_descricao}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-700 outline-none"
                        />

                        {/* <input
                            type="text"
                            name="cur_capa_url"
                            placeholder="URL da Capa do Curso"
                            value={form.cur_capa_url}
                            onChange={handleChange}
                            className="p-3 rounded-lg bg-gray-700 outline-none"
                            required
                        /> */}

                        <button
                            type="submit"
                            className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700"
                        >
                            Criar Curso
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}