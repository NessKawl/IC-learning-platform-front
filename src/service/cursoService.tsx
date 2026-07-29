import api from "./api";

export const GetCursos =
    async () => {

        const response =
            await api.get(
                "/curso/all"
            );

        return response.data;
    };

export const GetCursosPorUsuario =
    async () => {

        const response =
            await api.get(
                "/curso/por-usuario/me"
            );

        return response.data;
    };

export const GetMeusCursos =
    async () => {

        const response =
            await api.get(
                "/curso/meus-cursos"
            );

        return response.data;
    };

export const GetCursosPendentes =
    async () => {

        const response =
            await api.get(
                "/curso/pendentes"
            );

        return response.data;
    };

export const AprovarCurso =
    async (
        id: number
    ) => {

        const response =
            await api.patch(
                `/curso/aprovar/${id}`
            );

        return response.data;
    };

export const RejeitarCurso =
    async (
        id: number
    ) => {

        const response =
            await api.patch(
                `/curso/rejeitar/${id}`
            );

        return response.data;
    };

export const GetCursoId =
    async (
        id: string
    ) => {

        const response =
            await api.get(
                `/curso/${id}`
            );

        return response.data;
    };

export const CreateCurso =
    async (
        formData: FormData
    ) => {

        const response =
            await api.post(
                "/curso/register",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

        return response.data;
    };

export const BuscaCursoPorTitulo = async (titulo: string) => {

    const response =
        await api.get(
            `/curso/cursos/${titulo}`
        );

    return response.data;
}