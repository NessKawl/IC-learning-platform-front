import api from "./api";

export const CreateModulo = async (
    mod_titulo: string,
    mod_descricao: string,
    cur_id: number
) => {

    const response = await api.post(
        "/modulo/register",
        {
            mod_titulo,
            mod_descricao,
            cur_id,
        }
    );

    return response.data;
};

export const GetModuloByCurso = async (
    cursoId: number
) => {

    const response = await api.get(
        `/modulo/curso/${cursoId}`
    );

    return response.data;
};