// src/pages/Courses.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetCursos } from "../service/cursoService";
import NavBar from "../components/NavBar";

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

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <NavBar />

            <div className="grid md:grid-cols-4 gap-6 p-6">
                {cursos.map((curso) => (
                    <div
                        key={curso.cur_id}
                        className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                    >
                        <img
                            src={curso.cur_capa_url}
                            alt={curso.cur_titulo}
                            className="w-full h-40 object-cover"
                        />

                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                {curso.cur_titulo}
                            </h2>

                            <p className="text-gray-400 mb-4">
                                {curso.cur_descricao}
                            </p>

                            <button onClick={() => handleCardClick(curso.cur_id)} className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
                                Ver curso
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}