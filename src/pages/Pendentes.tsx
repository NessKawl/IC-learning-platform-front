import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { usuarioService } from "../service/usuarioService";
import {
    GetCursosPendentes,
    AprovarCurso,
    RejeitarCurso
} from "../service/cursoService";

type CursoPendente = {
    cur_id: number;
    cur_titulo: string;
    cur_descricao: string;
    cur_capa_url: string;
    cur_status: string;
    cur_publico: string,
    cur_n_modulos: string,
    cur_conteudo_modulos: string,
    cur_carga_horaria_modulos: string,
    cur_forma_avaliacao: string

    usu_usuario?: {
        usu_nome: string;
        usu_email: string;
        usu_curriculo: string;
        usu_lattes: string;
        usu_proposta: string;
    };
};

type UsuarioPendente = {
    usu_id: number;
    usu_nome: string;
    usu_email: string;
    usu_proposta: string;
    usu_status: string;
    usu_curriculo: string,
    usu_lattes: string,

    tiu_tipo_usuario?: {
        tiu_nome: string;
    };
};

export default function AprovacaoUsuarios() {

    const [cursos, setCursos] =
        useState<CursoPendente[]>(
            []
        );

    const [usuarios, setUsuarios] =
        useState<UsuarioPendente[]>([]);

    const [loading, setLoading] =
        useState(true);

    async function carregarDados() {

        try {

            const usuariosData =
                await usuarioService
                    .getUsuariosPendentes();

            setUsuarios(
                usuariosData
            );

        } catch (error) {

            console.error(
                "Erro usuários:",
                error
            );
        }

        try {

            const cursosData =
                await GetCursosPendentes();

            setCursos(
                cursosData
            );

        } catch (error) {

            console.error(
                "Erro cursos:",
                error
            );
        }

        setLoading(false);
    }

    async function aprovarUsuario(id: number) {
        try {


            await usuarioService.aprovarUsuario(id);

            setUsuarios(prev => prev.filter(usuario => usuario.usu_id !== id));

        } catch (error) {
            console.error(error);
        }
    }

    async function rejeitarUsuario(id: number) {
        try {

            await usuarioService.rejeitarUsuario(id);

            setUsuarios(prev => prev.filter(usuario => usuario.usu_id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    async function aprovarCurso(id: number) {

        try {

            await AprovarCurso(id);

            setCursos(prev => prev.filter(curso => curso.cur_id !== id));

        } catch (error) {

            console.error(error);
        }
    }

    async function rejeitarCurso(id: number) {

        try {

            await RejeitarCurso(id);

            setCursos(prev => prev.filter(curso => curso.cur_id !== id));

        } catch (error) {

            console.error(error);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
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

                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <i className="bi bi-person-check-fill"></i>
                        Aprovações
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Gerencie os usuários e cursos
                        pendentes para aprovação
                    </p>

                </div>

                {/* Cards de resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                    <div className="bg-gray-900 p-6 rounded-2xl shadow">

                        <h2 className="text-gray-500 text-sm">
                            Usuários Pendentes
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {usuarios.length}
                        </p>

                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl shadow">

                        <h2 className="text-gray-500 text-sm">
                            Cursos Pendentes
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            {cursos.length}
                        </p>

                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl shadow">

                        <h2 className="text-gray-500 text-sm">
                            Aprovações Hoje
                        </h2>

                        <p className="text-3xl font-bold mt-2">
                            0
                        </p>

                    </div>

                </div>

                {/* Lista */}
                {usuarios.length === 0 ? (
                    <div className="bg-gray-900 rounded-2xl p-10 text-center border border-gray-800">

                        <i className="bi bi-check-circle text-5xl text-green-500"></i>

                        <h2 className="text-2xl font-bold mt-4">
                            Nenhum usuário pendente
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Todos os cadastros já foram analisados.
                        </p>

                    </div>
                ) : (
                    <div className="grid grid-cols-3 lg:grid-cols-2 gap-6">

                        {usuarios.map(
                            (usuario) => (
                                <div
                                    key={
                                        usuario.usu_id
                                    }
                                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow hover:border-gray-700 transition"
                                >

                                    {/* Nome */}
                                    <div className="flex items-start justify-between">

                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {
                                                    usuario.usu_nome
                                                }
                                            </h2>

                                            <p className="text-gray-400 mt-1">
                                                {
                                                    usuario.usu_email
                                                }
                                            </p>
                                        </div>

                                        <span className="bg-yellow-500/20 text-yellow-400 text-sm px-4 py-1 rounded-full">
                                            {
                                                usuario.usu_status
                                            }
                                        </span>

                                    </div>

                                    {/* Proposta */}
                                    <div className="mt-6 flex flex-col gap-4">

                                        <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                                            Proposta
                                        </h3>

                                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">

                                            <p className="text-gray-300 leading-relaxed">
                                                {
                                                    usuario.usu_proposta ||
                                                    "Nenhuma proposta enviada."
                                                }
                                            </p>
                                        </div>

                                        <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                                            Currículo
                                        </h3>

                                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                                {usuario.usu_curriculo ? (
                                                    <a
                                                        href={usuario.usu_curriculo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 underline"
                                                    >
                                                        Baixar currículo
                                                    </a>
                                                ) : (
                                                    <p className="text-gray-300 leading-relaxed">
                                                        Nenhum currículo encontrado.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                                            Curriculum Lattes
                                        </h3>

                                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 ">
                                            <p className="text-gray-300 leading-relaxed">
                                                {
                                                    usuario.usu_lattes ||
                                                    "O usuário não enviou o currículo lattes."
                                                }
                                            </p>

                                        </div>
                                    </div>

                                    {/* Botões */}
                                    <div className="flex gap-3 mt-6">

                                        <button
                                            className="flex-1 bg-green-600 hover:bg-green-700 transition py-3 rounded-xl font-semibold"
                                            onClick={() =>
                                                aprovarUsuario(
                                                    usuario.usu_id
                                                )
                                            }
                                        >
                                            <i className="bi bi-check-lg mr-2"></i>
                                            Aprovar
                                        </button>

                                        <button
                                            className="flex-1 bg-red-600 hover:bg-red-700 transition py-3 rounded-xl font-semibold"
                                            onClick={() =>
                                                rejeitarUsuario(
                                                    usuario.usu_id
                                                )
                                            }
                                        >
                                            <i className="bi bi-x-lg mr-2"></i>
                                            Rejeitar
                                        </button>

                                    </div>

                                </div>
                            )
                        )}
                    </div>
                )}

                <hr className="mt-12" />

                <div className="mt-12">

                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <i className="bi bi-journal-bookmark-fill"></i>
                        Propostas de Curso
                    </h2>

                    {cursos.length === 0 ? (

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

                            <p className="text-gray-500">
                                Nenhuma proposta
                                pendente.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-3 lg:grid-cols-2 gap-6">

                            {cursos.map(
                                (curso) => (
                                    <div
                                        key={
                                            curso.cur_id
                                        }
                                        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                                    >

                                        <img
                                            src={
                                                curso.cur_capa_url
                                            }
                                            className="w-full h-52 object-cover"
                                        />

                                        <div className="p-5">

                                            <div className="flex justify-between items-start">

                                                <div>

                                                    <h2 className="text-xl font-bold">
                                                        {
                                                            curso.cur_titulo
                                                        }
                                                    </h2>


                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Professor:
                                                        {" "}
                                                        {
                                                            curso
                                                                .usu_usuario
                                                                ?.usu_nome
                                                        }
                                                    </p>

                                                </div>

                                                <span className="bg-yellow-500/20 text-yellow-400 text-sm px-4 py-1 rounded-full">
                                                    PENDENTE
                                                </span>

                                            </div>

                                            <p className="text-gray-400 mt-4" >
                                                {
                                                    curso.cur_descricao
                                                }
                                            </p>

                                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2 mt-2">
                                                Currículo
                                            </h3>

                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                                {curso.usu_usuario?.usu_curriculo ? (
                                                    <a
                                                        href={curso.usu_usuario.usu_curriculo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 underline"
                                                    >
                                                        Baixar currículo
                                                    </a>
                                                ) : (
                                                    <p className="text-gray-300">
                                                        Nenhum currículo encontrado.
                                                    </p>
                                                )}
                                            </div>

                                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2 mt-2">
                                                Público alvo
                                            </h3>

                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 ">
                                                <p className="text-gray-300 leading-relaxed">
                                                    {
                                                        curso.cur_publico ||
                                                        "Público alvo não encontrado."
                                                    }
                                                </p>

                                            </div>

                                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2 mt-2">
                                                Número de módulos
                                            </h3>

                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 ">
                                                <p className="text-gray-300 leading-relaxed">
                                                    {
                                                        curso.cur_n_modulos ||
                                                        "Qtd de módulos não encontrada."
                                                    }
                                                </p>

                                            </div>

                                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2 mt-2">
                                                Carga horária
                                            </h3>

                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 ">
                                                <p className="text-gray-300 leading-relaxed">
                                                    {curso.cur_carga_horaria_modulos && curso.cur_n_modulos
                                                        ? `${Number(curso.cur_carga_horaria_modulos) * Number(curso.cur_n_modulos)} horas`
                                                        : "Carga horária não encontrada."}
                                                </p>

                                            </div>

                                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2 mt-2">
                                                Conteúdo módulos
                                            </h3>

                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 ">
                                                <p className="text-gray-300 leading-relaxed">
                                                    {
                                                        curso.cur_conteudo_modulos ||
                                                        "Conteúdo não encontrado."
                                                    }
                                                </p>

                                            </div>

                                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2 mt-2">
                                                Forma de avaliação
                                            </h3>

                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 ">
                                                <p className="text-gray-300 leading-relaxed">
                                                    {
                                                        curso.cur_forma_avaliacao ||
                                                        "Forma de avaliação não encontrada."
                                                    }
                                                </p>

                                            </div>

                                            <div className="flex gap-3 mt-6">

                                                <button
                                                    onClick={() =>
                                                        aprovarCurso(
                                                            curso.cur_id
                                                        )
                                                    }
                                                    className="flex-1 bg-green-600 hover:bg-green-700 transition py-3 rounded-xl font-semibold"
                                                >
                                                    Aprovar
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        rejeitarCurso(
                                                            curso.cur_id
                                                        )
                                                    }
                                                    className="flex-1 bg-red-600 hover:bg-red-700 transition py-3 rounded-xl font-semibold"
                                                >
                                                    Rejeitar
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
        </div >
    );
}