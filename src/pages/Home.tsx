// src/pages/Home.tsx
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
export default function Home() {
  return (

    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="">
        <NavBar />
        {/* Hero */}
        <section className="text-center mt-20 px-6">
          <h2 className="text-4xl font-bold mb-4">
            Aprenda novas habilidades online
          </h2>
          <p className="text-gray-400 mb-6">
            Cursos práticos, direto ao ponto, com foco no mercado
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
            >
              Quero ser Aluno
            </Link>
            <Link
              to="/register-professor"
              className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
            >
              Quero ser Professor
            </Link>
          </div>
        </section>
        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6 mt-20 px-6 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Aulas práticas</h3>
            <p className="text-gray-400">
              Conteúdo direto ao ponto, sem enrolação
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Acesso vitalício</h3>
            <p className="text-gray-400">
              Estude no seu tempo, quando quiser
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Certificado</h3>
            <p className="text-gray-400">
              Comprove suas habilidades no mercado
            </p>
          </div>
        </section>
      </div>
    </div >
  );
}