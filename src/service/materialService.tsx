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