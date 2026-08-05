import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

import {
    BuscarTentativa,
    EnviarRespostas
} from "../service/avaliacaoService";

interface Alternativa {
    alt_id: number;
    alt_texto: string;
}

interface Questao {
    que_id: number;
    que_texto: string;
    alternativa: Alternativa[];
}

interface Avaliacao {
    ava_id: number;
    ava_titulo: string;
    ava_tipo: string;
    ava_tempo_limite: number;

    questoes: Questao[];
}

interface Tentativa {

    tentativaId: number;

    titulo: string;

    tempo: number;

    modulo_titulo: string;

    questoes: Questao[];

}

export default function Avaliacao() {

    const [prova, setProva] = useState<Tentativa | null>(null);

    const navigate = useNavigate();

    const [indiceAtual, setIndiceAtual] = useState(0);
    const [tempoRestante, setTempoRestante] = useState(0);
    const [questoesExpiradas, setQuestoesExpiradas] = useState<number[]>([]);

    const [modalAberto, setModalAberto] = useState(true);
    const [avaliacaoIniciada, setAvaliacaoIniciada] = useState(false);

    const [resultadoModal, setResultadoModal] = useState<{
        aberto: boolean;
        acertos: number;
        total: number;
        percentual: number;
        aprovado: boolean;
    } | null>(null);

    const [respostas, setRespostas] =
        useState<Record<number, number>>({});

    function responder(
        questao: number,
        alternativa: number
    ) {

        setRespostas(prev => ({
            ...prev,
            [questao]: alternativa
        }));

    }

    useEffect(() => {
        if (!prova || !avaliacaoIniciada) return;

        setTempoRestante(prova.tempo * 60);
    }, [indiceAtual, prova, avaliacaoIniciada]);

    useEffect(() => {

        if (!avaliacaoIniciada) return;

        if (tempoRestante <= 0 || !prova) return;

        const timer = setInterval(() => {
            setTempoRestante(t => t - 1);
        }, 1000);

        return () => clearInterval(timer);

    }, [tempoRestante, prova, avaliacaoIniciada]);

    function iniciarAvaliacao() {

        setModalAberto(false);

        setAvaliacaoIniciada(true);

    }

    useEffect(() => {

        if (!prova) return;

        if (tempoRestante > 0) return;

        const questao = prova.questoes[indiceAtual];

        setQuestoesExpiradas(prev => [...prev, questao.que_id]);

        if (indiceAtual < prova.questoes.length - 1) {

            setIndiceAtual(i => i + 1);

        } else {

            finalizar();

        }

    }, [tempoRestante]);

    function proximaQuestao() {

        if (!prova) return;

        const questao = prova.questoes[indiceAtual];

        if (
            respostas[questao.que_id] === undefined &&
            !questoesExpiradas.includes(questao.que_id)
        ) {
            alert("Selecione uma alternativa.");
            return;
        }

        if (indiceAtual < prova.questoes.length - 1) {

            setIndiceAtual(i => i + 1);

        } else {

            finalizar();

        }

    }
    async function finalizar() {

        if (!prova) return;

        // if (
        //     Object.keys(respostas).length !==
        //     prova.questoes.length
        // ) {

        //     alert("Responda todas as questões.");

        //     return;

        // }

        try {

            const lista =
                Object.entries(respostas).map(
                    ([que_id, alt_id]) => ({

                        que_id: Number(que_id),

                        alt_id: Number(alt_id)

                    })
                );

            const resultado = await EnviarRespostas(

                prova.tentativaId,

                lista

            );

            const percentual = Math.round(
                (resultado.acertos / resultado.total) * 100
            );

            // Exemplo: aprovado com 70% ou mais
            const aprovado = percentual >= 75;

            setResultadoModal({
                aberto: true,
                acertos: resultado.acertos,
                total: resultado.total,
                percentual,
                aprovado,
            });

        } catch {

            alert("Erro ao enviar avaliação");

        }

    }

    function fecharResultado() {
        setResultadoModal(null);
        navigate(-1);
    }

    const { tentativaId } = useParams();

    useEffect(() => {

        if (!tentativaId) return;

        BuscarTentativa(Number(tentativaId))
            .then(setProva);

    }, [tentativaId]);

    if (!prova)
        return (
            <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
                Carregando...
            </div>
        );

    const questao = prova.questoes[indiceAtual];

    return (

        <div className="min-h-screen bg-gray-950 text-white">

            <NavBar />

            {resultadoModal?.aberto && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">

                        <h2 className="text-3xl font-bold text-center">

                            {resultadoModal.aprovado
                                ? "🎉 Parabéns!"
                                : "Avaliação Finalizada"}

                        </h2>

                        <div className="mt-8 space-y-4">

                            <div className="flex justify-between">

                                <span>Acertos</span>

                                <strong>
                                    {resultadoModal.acertos} / {resultadoModal.total}
                                </strong>

                            </div>

                            <div className="flex justify-between">

                                <span>Percentual</span>

                                <strong>
                                    {resultadoModal.percentual}%
                                </strong>

                            </div>

                            <div className="flex justify-between">

                                <span>Situação</span>

                                <strong
                                    className={
                                        resultadoModal.aprovado
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }
                                >

                                    {resultadoModal.aprovado
                                        ? "Aprovado"
                                        : "Reprovado"}

                                </strong>

                            </div>

                        </div>

                        <button
                            onClick={fecharResultado}
                            className="mt-8 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold"
                        >

                            Voltar

                        </button>

                    </div>

                </div>

            )}
            {modalAberto && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg">

                        <h2 className="text-2xl font-bold mb-5">
                            Instruções da Avaliação
                        </h2>

                        <ul className="space-y-3 text-gray-300 list-disc pl-5">

                            <li>
                                A prova possui <strong>{prova.questoes.length}</strong> questões.
                            </li>

                            <li>
                                Cada questão possui <strong>{prova.tempo} minuto(s)</strong>.
                            </li>

                            <li>
                                Mínimo de <strong>75% de acerto</strong> para ser aprovado.
                            </li>

                            <li>
                                Quando o tempo acabar, a próxima questão será aberta automaticamente.
                            </li>

                            <li>
                                Não será possível voltar para questões anteriores.
                            </li>

                            <li>
                                Caso uma questão não seja respondida dentro do tempo, ela será considerada em branco.
                            </li>

                            <li>
                                Se você fechar a prova antes do tempo acabar, ela será considerada como não finalizada e será necessário pedir autorização para refazer.
                            </li>

                        </ul>

                        <button
                            onClick={iniciarAvaliacao}
                            className="mt-8 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold"
                        >
                            Iniciar Avaliação
                        </button>

                    </div>

                </div>

            )}
            <div className="max-w-5xl mx-auto py-10 px-6">

                <div className="bg-gray-900 rounded-2xl p-8">

                    <h1 className="text-3xl font-bold">
                        {prova.titulo}
                    </h1>

                    <p className="text-gray-400">

                        Módulo: {prova.modulo_titulo}

                    </p>

                    <p className="text-gray-400 mt-2">
                        Questão {indiceAtual + 1} de {prova.questoes.length}
                    </p>

                    <p className="text-red-400 text-2xl font-bold mt-2">
                        {Math.floor(tempoRestante / 60)
                            .toString()
                            .padStart(2, "0")}
                        :
                        {(tempoRestante % 60)
                            .toString()
                            .padStart(2, "0")}
                    </p>

                    <div className="mt-8 space-y-8">

                        <div className="mt-8">

                            <div className="bg-gray-800 rounded-xl p-6">

                                <h2 className="font-semibold text-lg">
                                    {indiceAtual + 1}. {questao.que_texto}
                                </h2>

                                <div className="mt-5 space-y-3">

                                    {questao.alternativa.map(alternativa => (

                                        <label
                                            key={alternativa.alt_id}
                                            className="flex gap-3 cursor-pointer"
                                        >

                                            <input
                                                type="radio"
                                                name={String(questao.que_id)}
                                                checked={
                                                    respostas[questao.que_id] === alternativa.alt_id
                                                }
                                                onChange={() =>
                                                    responder(
                                                        questao.que_id,
                                                        alternativa.alt_id
                                                    )
                                                }
                                            />

                                            <span>
                                                {alternativa.alt_texto}
                                            </span>

                                        </label>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                    <button
                        onClick={proximaQuestao}
                        className="mt-10 w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-semibold"
                    >
                        {indiceAtual === prova.questoes.length - 1
                            ? "Finalizar Avaliação"
                            : "Próxima Questão"}
                    </button>

                </div>

            </div>

        </div>

    );

}