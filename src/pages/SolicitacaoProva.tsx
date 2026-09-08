import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

import {
    BuscarSolicitacoesRevisaoProfessor,
    AprovarSolicitacaoRevisao,
    RejeitarSolicitacaoRevisao,
} from "../service/avaliacaoService";


type SolicitacaoRevisao = {

    rev_id: number;

    rev_status: string;

    rev_motivo?: string;

    rev_resposta?: string;

    rev_data: string;

    rev_data_analise?: string;

    usu_usuario: {

        usu_id: number;

        usu_nome: string;

        usu_email: string;

    };

    ten_tentativa: {

        ten_id: number;

        ten_nota: number;

        ten_acertos: number;

        ten_total_questoes: number;

        ten_dataInicio: string;

        ten_dataFim: string;

        ten_concluida: boolean;

    };

    ava_avaliacao: {

        ava_id: number;

        ava_titulo: string;

        ava_tipo: string;

        modulo: {

            mod_id: number;

            mod_titulo: string;

            cur_curso: {

                cur_id: number;

                cur_titulo: string;

                professor_id: number;

            };

        };

    };

};


export default function SolicitacoesRevisao() {

    const [
        solicitacoes,
        setSolicitacoes
    ] = useState<SolicitacaoRevisao[]>([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    async function carregarSolicitacoes() {

        try {

            setLoading(true);

            const data =
                await BuscarSolicitacoesRevisaoProfessor();

            setSolicitacoes(data);

        } catch (error) {

            console.error(
                "Erro ao buscar solicitações:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    async function aprovar(
        id: number
    ) {

        try {

            await AprovarSolicitacaoRevisao(id);

            setSolicitacoes(prev =>
                prev.filter(
                    item => item.rev_id !== id
                )
            );

        } catch (error) {

            console.error(
                "Erro ao aprovar solicitação:",
                error
            );

        }

    }


    async function rejeitar(
        id: number
    ) {

        try {

            await RejeitarSolicitacaoRevisao(id);

            setSolicitacoes(prev =>
                prev.filter(
                    item => item.rev_id !== id
                )
            );

        } catch (error) {

            console.error(
                "Erro ao rejeitar solicitação:",
                error
            );

        }

    }


    useEffect(() => {

        carregarSolicitacoes();

    }, []);


    if (loading) {

        return (

            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

                <div className="text-center">

                    <i className="bi bi-arrow-repeat animate-spin text-4xl"></i>

                    <p className="mt-4 text-gray-400">
                        Carregando solicitações...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-950 text-white">

            <NavBar />


            <div className="max-w-7xl mx-auto p-6">


                {/* HEADER */}

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">

                    <div className="flex items-center gap-4">

                        <div className="bg-yellow-500/10 text-yellow-400 w-14 h-14 rounded-xl flex items-center justify-center">

                            <i className="bi bi-arrow-repeat text-3xl"></i>

                        </div>


                        <div>

                            <h1 className="text-3xl font-bold">

                                Solicitações de Prova

                            </h1>

                            <p className="text-gray-500 mt-1">

                                Analise as solicitações dos alunos
                                para realizar uma nova tentativa.

                            </p>

                        </div>

                    </div>

                </div>


                {/* RESUMO */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">


                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">

                                    Solicitações Pendentes

                                </p>

                                <p className="text-3xl font-bold mt-2">

                                    {solicitacoes.length}

                                </p>

                            </div>


                            <i className="bi bi-hourglass-split text-3xl text-yellow-400"></i>

                        </div>

                    </div>


                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">

                                    Alunos

                                </p>

                                <p className="text-3xl font-bold mt-2">

                                    {
                                        new Set(
                                            solicitacoes.map(
                                                item =>
                                                    item.usu_usuario.usu_id
                                            )
                                        ).size
                                    }

                                </p>

                            </div>


                            <i className="bi bi-people text-3xl text-blue-400"></i>

                        </div>

                    </div>


                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm">

                                    Avaliações

                                </p>

                                <p className="text-3xl font-bold mt-2">

                                    {
                                        new Set(
                                            solicitacoes.map(
                                                item =>
                                                    item.ava_avaliacao.ava_id
                                            )
                                        ).size
                                    }

                                </p>

                            </div>


                            <i className="bi bi-journal-check text-3xl text-green-400"></i>

                        </div>

                    </div>

                </div>


                {/* LISTA */}

                {solicitacoes.length === 0 ? (

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">

                        <i className="bi bi-check-circle text-6xl text-green-500"></i>

                        <h2 className="text-2xl font-bold mt-5">

                            Nenhuma solicitação pendente

                        </h2>

                        <p className="text-gray-500 mt-2">

                            Não existem solicitações de novas
                            tentativas para analisar.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {solicitacoes.map(
                            (solicitacao) => (

                                <div
                                    key={solicitacao.rev_id}
                                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition"
                                >


                                    {/* TOPO */}

                                    <div className="p-6 border-b border-gray-800">

                                        <div className="flex justify-between items-start">

                                            <div className="flex gap-4">

                                                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">

                                                    <i className="bi bi-person-fill text-xl"></i>

                                                </div>


                                                <div>

                                                    <h2 className="text-xl font-bold">

                                                        {
                                                            solicitacao
                                                                .usu_usuario
                                                                .usu_nome
                                                        }

                                                    </h2>

                                                    <p className="text-gray-500 text-sm">

                                                        {
                                                            solicitacao
                                                                .usu_usuario
                                                                .usu_email
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">

                                                PENDENTE

                                            </span>

                                        </div>

                                    </div>


                                    {/* INFORMAÇÕES DA PROVA */}

                                    <div className="p-6">

                                        <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">

                                            Avaliação

                                        </h3>


                                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">


                                            <h2 className="text-lg font-bold">

                                                {
                                                    solicitacao
                                                        .ava_avaliacao
                                                        .ava_titulo
                                                }

                                            </h2>


                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">


                                                <div>

                                                    <p className="text-xs text-gray-500 uppercase">

                                                        Curso

                                                    </p>

                                                    <p className="text-gray-300 mt-1">

                                                        {
                                                            solicitacao
                                                                .ava_avaliacao
                                                                .modulo
                                                                .cur_curso
                                                                .cur_titulo
                                                        }

                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs text-gray-500 uppercase">

                                                        Módulo

                                                    </p>

                                                    <p className="text-gray-300 mt-1">

                                                        {
                                                            solicitacao
                                                                .ava_avaliacao
                                                                .modulo
                                                                .mod_titulo
                                                        }

                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs text-gray-500 uppercase">

                                                        Tipo

                                                    </p>

                                                    <p className="text-gray-300 mt-1">

                                                        {
                                                            solicitacao
                                                                .ava_avaliacao
                                                                .ava_tipo
                                                        }

                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs text-gray-500 uppercase">

                                                        Solicitação

                                                    </p>

                                                    <p className="text-gray-300 mt-1">

                                                        {
                                                            new Date(
                                                                solicitacao.rev_data
                                                            ).toLocaleDateString(
                                                                "pt-BR"
                                                            )
                                                        }

                                                    </p>

                                                </div>


                                            </div>

                                        </div>


                                        {/* RESULTADO */}

                                        <h3 className="text-sm uppercase tracking-wide text-gray-500 mt-6 mb-4">

                                            Resultado da tentativa

                                        </h3>


                                        <div className="grid grid-cols-3 gap-3">


                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">

                                                <p className="text-xs text-gray-500">

                                                    Nota

                                                </p>

                                                <p className="text-2xl font-bold text-red-400 mt-1">

                                                    {
                                                        solicitacao
                                                            .ten_tentativa
                                                            .ten_nota
                                                            .toFixed(1)
                                                    }

                                                </p>

                                            </div>


                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">

                                                <p className="text-xs text-gray-500">

                                                    Acertos

                                                </p>

                                                <p className="text-2xl font-bold mt-1">

                                                    {
                                                        solicitacao
                                                            .ten_tentativa
                                                            .ten_acertos
                                                    }

                                                    /

                                                    {
                                                        solicitacao
                                                            .ten_tentativa
                                                            .ten_total_questoes
                                                    }

                                                </p>

                                            </div>


                                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">

                                                <p className="text-xs text-gray-500">

                                                    Tentativa

                                                </p>

                                                <p className="text-2xl font-bold mt-1">

                                                    #

                                                    {
                                                        solicitacao
                                                            .ten_tentativa
                                                            .ten_id
                                                    }

                                                </p>

                                            </div>


                                        </div>


                                        {/* MOTIVO */}

                                        {solicitacao.rev_motivo && (

                                            <>

                                                <h3 className="text-sm uppercase tracking-wide text-gray-500 mt-6 mb-3">

                                                    Motivo da solicitação

                                                </h3>


                                                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">

                                                    <p className="text-gray-300 leading-relaxed">

                                                        {
                                                            solicitacao.rev_motivo
                                                        }

                                                    </p>

                                                </div>

                                            </>

                                        )}


                                        {/* AÇÕES */}

                                        <div className="flex gap-3 mt-6">


                                            <button
                                                onClick={() =>
                                                    aprovar(
                                                        solicitacao.rev_id
                                                    )
                                                }
                                                className="flex-1 bg-green-600 hover:bg-green-700 transition py-3 rounded-xl font-semibold"
                                            >

                                                <i className="bi bi-check-lg mr-2"></i>

                                                Aprovar

                                            </button>


                                            <button
                                                onClick={() =>
                                                    rejeitar(
                                                        solicitacao.rev_id
                                                    )
                                                }
                                                className="flex-1 bg-red-600 hover:bg-red-700 transition py-3 rounded-xl font-semibold"
                                            >

                                                <i className="bi bi-x-lg mr-2"></i>

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

    );

}