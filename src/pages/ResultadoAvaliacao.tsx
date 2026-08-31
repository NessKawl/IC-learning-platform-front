import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    ArrowLeft,
    Trophy,
    AlertCircle
} from "lucide-react";

import { BuscarQtdTentativas, BuscarResultadoTentativa, SolicitarRevisao, IniciarProva } from "../service/avaliacaoService";



interface Resposta {

    questaoId: number;

    pergunta: string;

    alternativaSelecionada: {
        id: number;
        texto: string;
    } | null;

    alternativaCorreta: {
        id: number;
        texto: string;
    } | null;

    correta: boolean;

}


interface Resultado {

    tentativaId: number;

    avaliacao: {
        id: number;
        titulo: string;
    };

    modulo: {
        id: number;
        titulo: string;
    };

    nota: number;

    acertos: number;

    total: number;

    aprovado: boolean;

    dataInicio: string;

    dataFim: string;

    respostas: Resposta[];

    // NOVO
    solicitacaoRevisao?: {
        id: number;
        status: "PENDENTE" | "APROVADA" | "REJEITADA";
    } | null;
}


export default function ResultadoAvaliacao() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [resultado, setResultado] =
        useState<Resultado | null>(null);

    const [solicitandoRevisao, setSolicitandoRevisao] =
        useState(false);

    const [qtdTentativas, setQtdTentativas] = useState(0);

    const [mensagemRevisao, setMensagemRevisao] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const verificarQtdTentativas = async () => {
            if (!resultado?.avaliacao?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const qtd = await BuscarQtdTentativas(
                    resultado.avaliacao.id
                );

                setQtdTentativas(qtd);
            } catch (error) {
                console.error(
                    "Erro ao buscar quantidade de tentativas:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        verificarQtdTentativas();
    }, [resultado]);

    const refazerAvaliacao = async () => {

        if (!resultado) return;

        try {

            setLoading(true);

            const data = await IniciarProva(
                resultado.avaliacao.id
            );

            console.log("Nova tentativa:", data);

            navigate(
                `/avaliacao/${data.tentativaId}`
            );

        } catch (error) {

            console.error(
                "Erro ao iniciar nova tentativa:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    const solicitarRevisao = async () => {

        if (!resultado) return;

        try {

            setSolicitandoRevisao(true);

            await SolicitarRevisao(
                resultado.tentativaId
            );

            setMensagemRevisao(
                "Solicitação enviada com sucesso. Aguarde a análise do professor."
            );

            setResultado(prev =>
                prev
                    ? {
                        ...prev,
                        solicitacaoRevisao: {
                            id: 0,
                            status: "PENDENTE"
                        }
                    }
                    : prev
            );

        } catch (error) {

            console.error(error);

            setMensagemRevisao(
                "Não foi possível enviar a solicitação."
            );

        } finally {

            setSolicitandoRevisao(false);

        }
    };


    useEffect(() => {

        if (!id) return;

        const carregarResultado = async () => {

            try {

                const data =
                    await BuscarResultadoTentativa(
                        Number(id)
                    );

                setResultado(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        carregarResultado();

    }, [id]);


    if (loading) {

        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

                <p>
                    Carregando resultado...
                </p>

            </div>
        );

    }


    if (!resultado) {

        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

                <div className="text-center">

                    <p className="text-xl">
                        Resultado não encontrado.
                    </p>

                    <button
                        onClick={() => navigate(-2)}
                        className="mt-5 bg-blue-600 px-5 py-3 rounded-xl"
                    >
                        Voltar
                    </button>

                </div>

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-gray-950 text-white">

            <div className="max-w-5xl mx-auto px-6 py-10">


                {/* VOLTAR */}

                <button
                    onClick={() => navigate(-1)}
                    className="
                        flex
                        items-center
                        gap-2
                        text-gray-400
                        hover:text-white
                        mb-8
                    "
                >

                    <ArrowLeft size={20} />

                    Voltar

                </button>


                {/* CABEÇALHO */}

                <div className="mb-8">

                    <p className="text-sm text-gray-500">
                        Resultado da avaliação
                    </p>

                    <h1 className="text-3xl font-bold mt-2">

                        {resultado.avaliacao.titulo}

                    </h1>

                    <p className="text-gray-400 mt-2">

                        Módulo: {resultado.modulo.titulo}

                    </p>

                </div>


                {/* RESUMO */}

                <div className="grid md:grid-cols-3 gap-5 mb-10">


                    {/* NOTA */}

                    <div
                        className={`
                            rounded-2xl
                            p-6
                            border
                            ${resultado.aprovado
                                ? "bg-green-900/20 border-green-700"
                                : "bg-red-900/20 border-red-700"
                            }
                        `}
                    >

                        <div className="flex items-center gap-3">

                            {resultado.aprovado ? (

                                <Trophy
                                    className="text-green-400"
                                    size={28}
                                />

                            ) : (

                                <AlertCircle
                                    className="text-red-400"
                                    size={28}
                                />

                            )}

                            <p className="text-gray-400">
                                Nota
                            </p>

                        </div>




                        <p
                            className={`
                                text-4xl
                                font-bold
                                mt-4
                                ${resultado.aprovado
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                            `}
                        >

                            {resultado.nota.toFixed(1)}

                        </p>


                        <p
                            className={`
                                mt-2
                                font-medium
                                ${resultado.aprovado
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                            `}
                        >

                            {resultado.aprovado
                                ? "Aprovado"
                                : "Reprovado"}

                        </p>

                    </div>

                    {/* ACERTOS */}

                    <div className="
                        bg-gray-900
                        border
                        border-gray-800
                        rounded-2xl
                        p-6
                    ">

                        <p className="text-gray-400">
                            Acertos
                        </p>

                        <p className="text-4xl font-bold mt-4">

                            {resultado.acertos}

                            <span className="
                                text-lg
                                text-gray-500
                                ml-2
                            ">
                                / {resultado.total}
                            </span>

                        </p>

                    </div>


                    {/* PERCENTUAL */}

                    <div className="
                        bg-gray-900
                        border
                        border-gray-800
                        rounded-2xl
                        p-6
                    ">

                        <p className="text-gray-400">
                            Aproveitamento
                        </p>

                        <p className="text-4xl font-bold mt-4">

                            {(
                                (resultado.acertos /
                                    resultado.total) *
                                100
                            ).toFixed(0)}%

                        </p>

                    </div>

                </div>


                {/* QUESTÕES */}

                {/* CONTROLE DE TENTATIVAS */}

                {!resultado.aprovado && (
                    <div className="mt-6">

                        {/* MENOS DE 3 TENTATIVAS */}

                        {qtdTentativas < 3 && (

                            <div className="
                bg-blue-900/10
                border
                border-blue-800
                rounded-xl
                p-5
            ">

                                <p className="font-semibold text-blue-400">
                                    Você pode realizar uma nova tentativa
                                </p>

                                <p className="text-sm text-gray-400 mt-2">
                                    Você realizou {qtdTentativas} de 3 tentativas.
                                    Aproveite a oportunidade para tentar novamente.
                                </p>

                                <button
                                    onClick={refazerAvaliacao}
                                    className="
                        mt-4
                        bg-blue-600
                        hover:bg-blue-700
                        px-5
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                                >
                                    Refazer prova
                                </button>

                            </div>

                        )}


                        {/* EXATAMENTE 3 TENTATIVAS */}

                        {qtdTentativas === 3 && (

                            <>

                                {resultado.solicitacaoRevisao?.status === "PENDENTE" ? (

                                    <div className="
                        bg-yellow-900/20
                        border
                        border-yellow-700
                        rounded-xl
                        p-4
                    ">

                                        <p className="font-semibold text-yellow-400">
                                            Solicitação de revisão pendente
                                        </p>

                                        <p className="text-sm text-gray-400 mt-1">
                                            Você atingiu o limite de 3 tentativas.
                                            Sua solicitação foi enviada para análise do professor.
                                        </p>

                                    </div>

                                ) : resultado.solicitacaoRevisao?.status === "REJEITADA" ? (

                                    <div className="
                        bg-red-900/20
                        border
                        border-red-700
                        rounded-xl
                        p-5
                    ">

                                        <p className="font-semibold text-red-400">
                                            Solicitação de revisão recusada
                                        </p>

                                        <p className="text-sm text-gray-400 mt-2">
                                            O professor recusou sua solicitação.
                                            Você pode solicitar uma nova revisão.
                                        </p>

                                        <button
                                            onClick={solicitarRevisao}
                                            disabled={solicitandoRevisao}
                                            className="
                                mt-4
                                bg-indigo-600
                                hover:bg-indigo-700
                                disabled:opacity-50
                                px-5
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                            "
                                        >
                                            {solicitandoRevisao
                                                ? "Enviando solicitação..."
                                                : "Solicitar nova revisão"}
                                        </button>

                                    </div>

                                ) : (

                                    <div className="
                        bg-red-900/10
                        border
                        border-red-800
                        rounded-xl
                        p-5
                    ">

                                        <p className="font-semibold text-red-400">
                                            Limite de tentativas atingido
                                        </p>

                                        <p className="text-sm text-gray-400 mt-2">
                                            Você realizou as 3 tentativas disponíveis
                                            para esta avaliação.
                                        </p>

                                        <p className="text-sm text-gray-400 mt-2">
                                            Para realizar uma nova tentativa, é necessário
                                            solicitar autorização ao professor.
                                        </p>

                                        <button
                                            onClick={solicitarRevisao}
                                            disabled={solicitandoRevisao}
                                            className="
                                mt-4
                                bg-indigo-600
                                hover:bg-indigo-700
                                disabled:opacity-50
                                px-5
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                            "
                                        >
                                            {solicitandoRevisao
                                                ? "Enviando solicitação..."
                                                : "Solicitar ao professor"}
                                        </button>

                                        {mensagemRevisao && (
                                            <p className="mt-3 text-sm text-gray-400">
                                                {mensagemRevisao}
                                            </p>
                                        )}

                                    </div>

                                )}

                            </>

                        )}


                        {/* MAIS DE 3 TENTATIVAS */}

                        {qtdTentativas > 3 && (

                            <div className="
                bg-gray-900
                border
                border-gray-700
                rounded-xl
                p-5
            ">

                                <p className="font-semibold text-gray-300">
                                    Novas tentativas indisponíveis
                                </p>

                                <p className="text-sm text-gray-400 mt-2">
                                    Você já ultrapassou o limite de tentativas permitido
                                    para esta avaliação.
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    Não é possível realizar uma nova tentativa.
                                </p>

                            </div>

                        )}

                    </div>
                )}


                <div>

                    <h2 className="text-2xl font-bold mb-5">

                        Respostas

                    </h2>


                    <div className="space-y-5">

                        {resultado.respostas.map(
                            (resposta, index) => (

                                <div
                                    key={resposta.questaoId}
                                    className={`
                                        bg-gray-900
                                        border
                                        rounded-2xl
                                        p-6
                                        ${resposta.correta
                                            ? "border-green-800"
                                            : "border-red-800"
                                        }
                                    `}
                                >


                                    {/* QUESTÃO */}

                                    <div className="
                                        flex
                                        items-start
                                        gap-4
                                    ">

                                        <div>

                                            {resposta.correta ? (

                                                <CheckCircle
                                                    className="
                                                        text-green-400
                                                    "
                                                    size={25}
                                                />

                                            ) : (

                                                <XCircle
                                                    className="
                                                        text-red-400
                                                    "
                                                    size={25}
                                                />

                                            )}

                                        </div>


                                        <div className="flex-1">

                                            <p className="
                                                text-sm
                                                text-gray-500
                                                mb-2
                                            ">
                                                Questão {index + 1}
                                            </p>


                                            <h3 className="
                                                text-lg
                                                font-semibold
                                            ">

                                                {resposta.pergunta}

                                            </h3>

                                        </div>

                                    </div>


                                    {/* RESPOSTA DO ALUNO */}

                                    <div className="mt-6">

                                        <p className="
                                            text-sm
                                            text-gray-500
                                            mb-2
                                        ">
                                            Sua resposta
                                        </p>


                                        {resposta
                                            .alternativaSelecionada ? (

                                            <div
                                                className={`
                                                    rounded-xl
                                                    p-4
                                                    border
                                                    ${resposta.correta
                                                        ? "bg-green-900/20 border-green-700"
                                                        : "bg-red-900/20 border-red-700"
                                                    }
                                                `}
                                            >

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    {resposta.correta ? (

                                                        <CheckCircle
                                                            size={20}
                                                            className="text-green-400"
                                                        />

                                                    ) : (

                                                        <XCircle
                                                            size={20}
                                                            className="text-red-400"
                                                        />

                                                    )}


                                                    <span>

                                                        {
                                                            resposta
                                                                .alternativaSelecionada
                                                                .texto
                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                        ) : (

                                            <div className="
                                                bg-gray-800
                                                rounded-xl
                                                p-4
                                                text-gray-400
                                            ">

                                                Não respondeu

                                            </div>

                                        )}

                                    </div>


                                    {/* RESPOSTA CORRETA */}

                                    {!resposta.correta && (
                                        <div className="mt-4">

                                            <p className="
                                                text-sm
                                                text-gray-500
                                                mb-2
                                            ">
                                                Resposta correta
                                            </p>


                                            <div className="
                                                bg-green-900/20
                                                border
                                                border-green-700
                                                rounded-xl
                                                p-4
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                ">

                                                    <CheckCircle
                                                        size={20}
                                                        className="
                                                            text-green-400
                                                        "
                                                    />

                                                    <span>

                                                        {
                                                            resposta
                                                                .alternativaCorreta
                                                                ?.texto
                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                        </div>
                                    )}

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* BOTÃO FINAL */}

                <div className="
                    flex
                    justify-center
                    mt-10
                ">

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            px-8
                            py-3
                            rounded-xl
                            font-semibold
                            transition
                        "
                    >

                        Voltar ao curso

                    </button>

                </div>

            </div>

        </div>

    );

}