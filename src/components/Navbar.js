import { Link } from "react-router-dom";
import { isPaciente, isNutricionista, logout } from "../auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (isPaciente()) {
      setAuth(true);
      setRole("paciente");
    } else if (isNutricionista()) {
      setAuth(true);
      setRole("nutricionista");
    } else {
      setAuth(false);
      setRole(null);
    }
  }, []);

  async function handleLogout() {
    await logout();
    window.location.reload();
  }

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 24px;
          background: #e8f7f1;
          border-bottom: 1px solid #cdeee2;
        }

        .navbar a {
          text-decoration: none;
          color: #1b4332;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .navbar a:hover {
          color: #2d6a4f;
          transform: translateY(-2px);
        }

        .navbar button {
          margin-left: auto;
          padding: 6px 14px;
          border: none;
          border-radius: 6px;
          background: #40916c;
          color: #fff;
          cursor: pointer;
          font-weight: 500;
          transition: 0.3s;
        }

        .navbar button:hover {
          background: #2d6a4f;
          transform: scale(1.05);
        }
          .logo {
          height: 42px;
          transition: transform 0.3s ease;
          border-radius: 200px;
        }

          .logo:hover {
          transform: scale(1.05);
        }
        `}</style>

      <nav className="navbar">
         <img src="/logo-nutri.jpg" 
         alt="Logo da clínica" 
         className="logo" />

        <Link to="/">Início</Link>
        


        {/* Agenda aparece para os dois */}
        { auth && <Link to="/agenda">Agenda</Link>}
        


         {/* SOMENTE PACIENTE */}
        {role === "paciente" && (
           <>
          <Link to="/paciente">Área do Paciente</Link>
          <Link to="/paciente/perfil">Perfil</Link>
          </>
        )}                                                                       

        {/* LOGIN / LOGOUT */}
        {role === "nutricionista" && (
          <>
           <Link to="/nutricionista">Painel Nutricionista</Link>
            <Link to="/nutricionista/perfil">Perfil</Link>
           </>
        )}
        <Link to="/sobre#contato">Contato</Link>
        {/* LOGIN / LOGOUT */}
        {!auth ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout}>Sair</button>
        )}
      </nav>
    </>
  );
}
