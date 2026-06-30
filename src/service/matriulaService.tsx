import api from "./api";

export async function CriarMatricula(cur_id: number) {
    const token = localStorage.getItem("token");

    const response = await api.post(
        "/matricula",
        { cur_id },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export const BuscarMatriculaCurso = async (
    usu_id: number,
    cur_id: number
) => {
    try {
        const response = await api.get(
            `/matricula/usuario/${usu_id}/curso/${cur_id}`
        );

        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const buscaAlunosProfessor =
    async () => {
        try {

            const response = await api.get(`/matricula/professor/alunos`);

            return response.data;

        } catch (error) {

            console.error(error);

            return { qtdAlunos: 0, };
        }
    };