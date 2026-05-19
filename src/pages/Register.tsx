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
            Criar conta
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="usu_nome"
              placeholder="Nome"
              value={form.usu_nome}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-700 outline-none"
              required
            />

            <input
              type="email"
              name="usu_email"
              placeholder="Email"
              value={form.usu_email}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-700 outline-none"
              required
            />

            <input
              type="password"
              name="usu_senha"
              placeholder="Senha"
              value={form.usu_senha}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-700 outline-none"
              required
            />

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