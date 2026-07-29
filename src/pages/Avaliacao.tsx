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

    questoes: Questao[];

}

export default function Avaliacao() {

    const [prova, setProva] = useState<Tentativa | null>(null);

    const navigate = useNavigate();


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

    async function finalizar() {

        if (!prova) return;

        if (
            Object.keys(respostas).length !==
            prova.questoes.length
        ) {

            alert("Responda todas as questões.");

            return;

        }

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

            alert(
                `Você acertou ${resultado.acertos} de ${resultado.total}`
            );

            navigate(-1);

        } catch {

            alert("Erro ao enviar avaliação");

        }

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

    return (

        <div className="min-h-screen bg-gray-950 text-white">

            <NavBar />

            <div className="max-w-5xl mx-auto py-10 px-6">

                <div className="bg-gray-900 rounded-2xl p-8">

                    <h1 className="text-3xl font-bold">
                        {prova.titulo}
                    </h1>

                    <p className="text-gray-400 mt-2">

                        Tempo:
                        {" "}
                        {prova.tempo}
                        {" "}
                        minutos

                    </p>

                    <div className="mt-8 space-y-8">

                        {prova.questoes.map(
                            (questao, indice) => (

                                <div
                                    key={questao.que_id}
                                    className="bg-gray-800 rounded-xl p-6"
                                >

                                    <h2 className="font-semibold text-lg">

                                        {indice + 1}.

                                        {" "}

                                        {questao.que_texto}

                                    </h2>

                                    <div className="mt-5 space-y-3">

                                        {questao.alternativa.map(
                                            alternativa => (

                                                <label
                                                    key={alternativa.alt_id}
                                                    className="flex gap-3 cursor-pointer"
                                                >

                                                    <input

                                                        type="radio"

                                                        name={
                                                            String(
                                                                questao.que_id
                                                            )
                                                        }

                                                        checked={
                                                            respostas[
                                                            questao.que_id
                                                            ] ===
                                                            alternativa.alt_id
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

                                            )
                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                    <button

                        onClick={finalizar}

                        className="mt-10 w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-semibold"

                    >

                        Finalizar Avaliação

                    </button>

                </div>

            </div>

        </div>

    );

}