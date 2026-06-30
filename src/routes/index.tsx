// src/routes/index.tsx
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Cursos from "../pages/Cursos";
import CriarCurso from "../pages/ProporCurso";
import DetalheCurso from "../pages/DetalheCurso";
import CriarModulo from "../pages/CriarModulo";
import CriarMaterial from "../pages/CriarMaterial";
import AreaCandidato from "../pages/AreaCandidato";
import RegisterProfessor from "../pages/RegisterProfessor";
import UsuariosPendentes from "../pages/Pendentes";
import MeusCursos from "../pages/MeusCursos";

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/criar-curso" element={<CriarCurso />}></Route>
        <Route path="/detalhe-curso" element={<DetalheCurso />} />
        <Route path="/criar-modulo" element={<CriarModulo />} />
        <Route path="/criar-material" element={<CriarMaterial />} />
        <Route path="/area-candidato" element={<AreaCandidato />} />
        <Route path="/register-professor" element={<RegisterProfessor />} />
        <Route path="/pendentes" element={<UsuariosPendentes />} />
        <Route path="/meus-cursos" element={<MeusCursos />} />
      </Routes>
    </HashRouter>
  );
}