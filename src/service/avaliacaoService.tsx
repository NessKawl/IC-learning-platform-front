import api from "./api";

export const CreateAvaliacao = async (
    data: any
) => {

    const response =
        await api.post(
            "/avaliacao/register",
            data
        );

    return response.data;
};

export const BuscarAvaliacao = async (id: number) => {
    const response = await api.get(`/avaliacao/${id}`);
    return response.data;
};

export async function IniciarProva(avaId: number) {
    const { data } = await api.post(`/avaliacao/${avaId}/iniciar`);
    return data;
}

export async function EnviarRespostas(
    tentativaId: number,
    respostas: any[]
) {

    const { data } = await api.post(

        `/avaliacao/tentativa/${tentativaId}/finalizar`,

        {
            respostas
        }

    );

    return data;

}
export async function BuscarTentativa(tentativaId: number) {
    const { data } = await api.get(
        `/avaliacao/tentativa/${tentativaId}`
    );

    return data;
}

export async function BuscarResultadoTentativa(
    tentativaId: number
) {

    const response = await api.get(
        `/avaliacao/resultado/${tentativaId}`
    );

    if (!response) {
        throw new Error(
            "Erro ao buscar resultado da tentativa"
        );
    }

    return response.data;

}

export async function SolicitarRevisao(
    tentativaId: number
) {

    const token = localStorage.getItem("token");

    const response = await api.post(
        `/avaliacao/tentativas/${tentativaId}/revisao`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function BuscarQtdTentativas(avaliacaoId: number,) {
    const token = localStorage.getItem("token");

    const response = await api.get(`/avaliacao/tentativa/${avaliacaoId}/qtd-tentativas`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    return response.data;
}