// src/pages/Register.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { usuarioService } from "../service/usuarioService";

export default function Register() {
  const [form, setForm] = useState({
    usu_nome: "",
    usu_email: "",
    usu_senha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await usuarioService.createUser(form);

      alert(response.message || "Usuário criado com sucesso");

      navigate("/login");

    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Erro ao cadastrar usuário");
      }
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
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Criar conta Aluno
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">

              <label htmlFor="usu_email">Nome</label>

              <input
                type="text"
                name="usu_nome"
                placeholder="Nome"
                value={form.usu_nome}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-700 outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">

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
            </div>

            <div className="flex flex-col gap-1">

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
            </div>


            <button
              type="submit"
              className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700"
            >
              Cadastrar
            </button>
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