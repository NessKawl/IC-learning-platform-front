import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Award,
  Clock3,
  Search,
  Users,
  Laptop
} from "lucide-react";
import { useState } from "react";
import NavBar from "../components/NavBar";

export default function Home() {

  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) {
      navigate("/courses");
      return;
    }

    navigate(`/cursos?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <NavBar />

      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-cyan-500/10 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm">
              🚀 Mais de 100 cursos disponíveis
            </span>

            <h1 className="mt-6 text-6xl font-extrabold leading-tight">
              Aprenda habilidades para o
              <span className="text-blue-500">
                {" "}mercado de trabalho
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-400">
              Cursos online com professores especializados.
              Aprenda no seu ritmo e receba certificado ao concluir.
            </p>

            {/* Pesquisa */}

            <div className="mt-10 flex bg-slate-800 rounded-xl overflow-hidden">

              <div className="flex items-center px-4">
                <Search />
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Qual curso você procura?"
                className="flex-1 bg-transparent outline-none px-2 py-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-6"
              >
                Buscar
              </button>

            </div>

            <div className="flex gap-5 mt-8">

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition"
              >
                Começar Agora
              </Link>

              <Link
                to="/register-professor"
                className="border border-slate-700 hover:bg-slate-800 px-8 py-4 rounded-xl"
              >
                Seja Professor
              </Link>

            </div>

          </div>

          {/* IMAGEM */}

          <div className="hidden lg:flex justify-center">

            <img
              src="/hero.png"
              className="w-full max-w-lg"
            />

          </div>

        </div>

      </section>

      {/* BENEFÍCIOS */}

      <section className="max-w-7xl mx-auto py-20 px-6">

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500 transition">

            <Laptop className="text-blue-500 mb-4" size={40} />

            <h2 className="text-2xl font-bold">
              Aulas práticas
            </h2>

            <p className="text-gray-400 mt-3">
              Aprenda construindo projetos reais.
            </p>

          </div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500 transition">

            <Clock3 className="text-blue-500 mb-4" size={40} />

            <h2 className="text-2xl font-bold">
              Acesso vitalício
            </h2>

            <p className="text-gray-400 mt-3">
              Estude quando quiser.
            </p>

          </div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500 transition">

            <Award className="text-blue-500 mb-4" size={40} />

            <h2 className="text-2xl font-bold">
              Certificado
            </h2>

            <p className="text-gray-400 mt-3">
              Valorize seu currículo.
            </p>

          </div>

        </div>

      </section>

      {/* CATEGORIAS */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold mb-10">
          Explore categorias
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {[
            "Programação",
            "Design",
            "Marketing",
            "Negócios",
            "Idiomas",
            "Fotografia",
            "Inteligência Artificial",
            "DevOps"
          ].map((cat) => (

            <div
              key={cat}
              className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500 hover:-translate-y-1 transition cursor-pointer"
            >
              <BookOpen className="mb-4 text-blue-500" />

              <h3 className="font-semibold">
                {cat}
              </h3>

            </div>

          ))}

        </div>

      </section>

      {/* COMO FUNCIONA */}

      <section className="bg-slate-900 py-24">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-center text-4xl font-bold mb-16">
            Como funciona?
          </h2>

          <div className="grid md:grid-cols-3 gap-12">

            <div className="text-center">

              <Users size={50} className="mx-auto text-blue-500" />

              <h3 className="mt-5 text-xl font-bold">
                Cadastre-se
              </h3>

              <p className="text-gray-400 mt-2">
                Crie sua conta gratuitamente.
              </p>

            </div>

            <div className="text-center">

              <Search size={50} className="mx-auto text-blue-500" />

              <h3 className="mt-5 text-xl font-bold">
                Escolha um curso
              </h3>

              <p className="text-gray-400 mt-2">
                Encontre o curso ideal.
              </p>

            </div>

            <div className="text-center">

              <Award size={50} className="mx-auto text-blue-500" />

              <h3 className="mt-5 text-xl font-bold">
                Conquiste seu certificado
              </h3>

              <p className="text-gray-400 mt-2">
                Complete o curso e receba seu certificado.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24">

        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-700 to-cyan-500 rounded-3xl p-16 text-center">

          <h2 className="text-5xl font-bold">
            Comece hoje mesmo
          </h2>

          <p className="mt-5 text-lg text-blue-100">
            Invista em sua carreira aprendendo com especialistas.
          </p>

          <Link
            to="/register"
            className="inline-block mt-10 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:scale-105 transition"
          >
            Criar Conta
          </Link>

        </div>

      </section>

    </div>
  );
}