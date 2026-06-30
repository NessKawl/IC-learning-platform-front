import api from "./api";

export type UsuarioPendente = {
    usu_id: number;
    usu_nome: string;
    usu_email: string;
    usu_proposta: string;
    usu_status: string;
    usu_curriculo: string,
    usu_lattes: string,
};

export const usuarioService = {

    async createUser(data: unknown) {
        const response =
            await api.post("/usuario/register", data);

        return response.data;
    },

    async createUserProf(formData: FormData) {
        const response = await api.post(
            "/usuario/register-professor",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    async getUsuariosPendentes(): Promise<UsuarioPendente[]> {

        const response = await api.get("/usuario/pendentes");

        return response.data;
    },

    async aprovarUsuario(id: number) {
        const response = await api.patch(`/usuario/aprovar/${id}`);

        return response.data;
    },

    async rejeitarUsuario(
        id: number
    ) {
        const response =
            await api.patch(
                `/usuario/rejeitar/${id}`
            );

        return response.data;
    }
};