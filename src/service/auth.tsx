import api from "./api";

export const VerifyLogin = async (usu_email: string, usu_senha: string) => {
    const response = await api.post("/auth/login", { usu_email, usu_senha });
    return response.data;
};