import api from "./api";

export const CreateMaterial = async (
    formData: FormData
) => {

    const response = await api.post(
        "/material/register",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const ConcluirMaterial = async (
    matId: number,
    macId: number
) => {

    const response = await api.post(
        `/material/material/${matId}/concluir`,
        {
            mac_id: macId,
        }
    );

    return response.data;
};