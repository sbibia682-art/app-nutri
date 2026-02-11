import { useState } from "react";
import { register } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("paciente");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password, role);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      alert(err.code + " — " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* CSS  */}
      <style>{`
        .cadastro-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #e8f7f1, #ffffff);
        }

        .cadastro-card {
          background: #fff;
          padding: 40px;
          width: 100%;
          max-width: 380px;
          border-radius: 22px;
          box-shadow: 0 15px 40px rgba(46, 125, 50, 0.2);
          text-align: center;
          animation: fadeUp 0.6s ease;
        }

        .cadastro-card h2 {
          color: #2e7d32;
          margin-bottom: 25px;
        }

        .cadastro-card input,
        .cadastro-card select {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 15px;
          transition: 0.3s;
        }

        .cadastro-card input:focus,
        .cadastro-card select:focus {
          outline: none;
          border-color: #2e7d32;
          box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
        }

        .cadastro-card button {
          width: 100%;
          padding: 14px;
          background: #2e7d32;
          color: #fff;
          font-size: 16px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: 0.3s;
        }

        .cadastro-card button:hover:not(:disabled) {
          background: #1b5e20;
          transform: translateY(-2px);
        }

        .cadastro-card button:disabled {
          background: #9ccc9c;
          cursor: not-allowed; 
        }

        .cadastro-sucesso {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 15px;
          font-weight: bold;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>  

      <div className="cadastro-container">
        <form className="cadastro-card" onSubmit={handleRegister}>
          <h2>Criar Conta</h2>

          {success && (
            <p className="cadastro-sucesso">
              🎉 Cadastro realizado com sucesso! Redirecionando…
            </p>
          )}

          <input
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={success}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={success}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={success}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={success}
          >
            <option value="paciente">Paciente</option>
            <option value="nutricionista">Nutricionista</option>
          </select>

          <button disabled={loading || success}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </>
  );
}
