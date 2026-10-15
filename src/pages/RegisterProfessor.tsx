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

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!file) {
      alert("Selecione seu currículo em PDF.");
      return;
    }

    const formData = new FormData();

    formData.append("usu_nome", form.usu_nome.trim());
    formData.append("usu_email", form.usu_email.trim());
    formData.append("usu_senha", form.usu_senha);
    formData.append("usu_proposta", form.usu_proposta.trim());

    // Só envia o Lattes se o usuário preencher o campo.
    if (form.usu_lattes.trim()) {
      formData.append("usu_lattes", form.usu_lattes.trim());
    }

    formData.append("file", file);

    try {
      const response = await usuarioService.createUserProf(formData);

      alert(response.message || "Usuário enviado para análise!");
      navigate("/login");
    } catch (error: any) {
      const mensagem = error.response?.data?.message;

      console.error(
        "Erro no cadastro do professor:",
        error.response?.data ?? error.message
      );
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

                <div className="relative">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    name="usu_senha"
                    id="usu_senha"
                    placeholder="Senha"
                    value={form.usu_senha}
                    onChange={handleChange}
                    className="w-full p-3 pr-12 rounded-lg bg-gray-700 outline-none"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-300 hover:text-white"
                  >
                    {mostrarSenha ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                        <path d="M9.88 5.09A10.7 10.7 0 0 1 12 4.9c5 0 8.27 4.11 9.5 7.1a11.8 11.8 0 0 1-3.1 4.27" />
                        <path d="M6.61 6.61A13.4 13.4 0 0 0 2.5 12c1.23 2.99 4.5 7.1 9.5 7.1a10.7 10.7 0 0 0 5.39-1.41" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

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

                  <label htmlFor="file">Upload Currículo PDF</label>

                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="p-3 rounded-lg bg-gray-700 outline-none"
                    required
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