// src/routes/index.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Cursos from "../pages/Cursos";
import CriarCurso from "../pages/CriarCurso";
import DetalheCurso from "../pages/DetalheCurso";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/criar-curso" element={<CriarCurso />}></Route>
        <Route path="/detalhe-curso" element={<DetalheCurso />} />      </Routes>
    </BrowserRouter>
  );
}