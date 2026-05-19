import api from "./api";

export const GetCursos = async () => {

    const response = await api.get("/curso/all");
    return response.data;

};

export const GetCursoId = async (id: string) => {
    const response = await api.get(`/curso/${id}`);
    return response.data;
}

export const CreateCurso = async (
    formData: FormData
) => {

    const response = await api.post(
        "/curso/register",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};