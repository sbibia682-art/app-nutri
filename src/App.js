import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Agenda from "./pages/Agenda";
import Paciente from "./pages/Paciente";
import Cadastro from "./pages/Cadastro";
import PerfilNutri from "./pages/perfil/PerfilNutri";
import PerfilPaci from "./pages/perfil/PerfilPaci";
import PainelNutricionista from "./pages/PainelNutricionista";
import Evolucao from "./components/Evolucao";
import PlanoAlimentar from "./components/PlanoAlimentar";
import RecuperarSenha from "./pages/RecuperarSenha";
import Sobre from "./pages/Sobre";
import Footer from "./components/Footer";

import { isPaciente, isNutricionista } from "./auth";

//  Paciente
function PacienteRoute({ children }) {
  if (!isPaciente()) return <Navigate to="/login" replace />;
  return children;
}

//  Nutricionista
function NutriRoute({ children }) {
  if (!isNutricionista()) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app">
<main className="content">
      <Routes>
        {/* PUBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path ="/sobre" element = {<Sobre />} />
       

        {/* COMUNS */}
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/evolucao" element={<Evolucao />} />
        <Route path="/planos" element={<PlanoAlimentar />} />

        {/* PACIENTE */}
        <Route
          path="/paciente"
          element={
            <PacienteRoute>
              <Paciente />
            </PacienteRoute>
          }
        />

        <Route
          path="/paciente/perfil"
          element={
            <PacienteRoute>
              <PerfilPaci />
            </PacienteRoute>
          }
        />

        {/* NUTRICIONISTA */}
        <Route
          path="/nutricionista"
          element={
            <NutriRoute>
              <PainelNutricionista />
            </NutriRoute>
          }
        />

        <Route
          path="/nutricionista/perfil"
          element={
            <NutriRoute>
              <PerfilNutri />
            </NutriRoute>
          }
        />
      </Routes>
      </main>
      <Footer />
      </div>
    </BrowserRouter>
    
  );
}

export default App;
