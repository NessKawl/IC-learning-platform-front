// src/pages/Register.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { usuarioService } from "../service/usuarioService";

export default function RegisterProfessor() {
  const [form, setForm] = useState({
    usu_nome: "",
    usu_email: "",
    usu_senha: "",
    usu_proposta: "",
    usu_lattes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);


  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("usu_nome", form.usu_nome);
    formData.append("usu_email", form.usu_email);
    formData.append("usu_senha", form.usu_senha);
    formData.append("usu_proposta", form.usu_proposta);
    formData.append("usu_lattes", form.usu_lattes);

    if (file) {
      formData.append("file", file);
    }

    try {
      const response =
        await usuarioService.createUserProf(formData);

      alert(response.message || "Usuário enviado para análise!");

      navigate("/login");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="mb-5"><strong>
          <Link to="/" className="text-blue-400">
            IC Learn Platform
          </Link>
        </strong></h1>
        <div className="bg-gray-800 p-8 rounded-xl w-11/12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Criar conta Professor
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-1 m-2">
                <label htmlFor="usu_nome">Nome</label>
                <input
                  type="text"
                  name="usu_nome"
                  placeholder="Nome"
                  value={form.usu_nome}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-700 outline-none"
                  required
                />
                <label htmlFor="usu_email">Email</label>
                <input
                  type="email"
                  name="usu_email"
                  placeholder="Email"
                  value={form.usu_email}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-700 outline-none"
                  required
                />
                <label htmlFor="usu_senha">Senha</label>
                <input
                  type="password"
                  name="usu_senha"
                  placeholder="Senha"
                  value={form.usu_senha}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-700 outline-none"
                  required
                />
                <label htmlFor="usu_proposta">Proposta de curso</label>
                <input
                  type="text"
                  name="usu_proposta"
                  placeholder="Proposta de curso"
                  value={form.usu_proposta}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-700 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 m-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="usu_curriculum">Upload Currículo PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="p-3 rounded-lg bg-gray-700 outline-none"
                  />
                </div>

                <label htmlFor="usu_lattes">Link currículo lattes</label>
                <input
                  type="text"
                  name="usu_lattes"
                  placeholder="Currículo lattes (opcional)"
                  value={form.usu_lattes}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-700 outline-none"
                />

                <p className="text-sm text-gray-400">
                  Dúvidas? Entre em contato com a equipe de suporte através do e-mail: <a href="mailto:teste@gmail.com" className="text-blue-400">
                    teste@gmail.com
                  </a>
                </p>

              </div>
              <button
                type="submit"
                className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700 mt-2"
              >
                Cadastrar
              </button>
            </div>

          </form>


          <p className="text-center text-gray-400 mt-4">
            Já tem conta?{" "}
            <Link to="/login" className="text-blue-400">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}