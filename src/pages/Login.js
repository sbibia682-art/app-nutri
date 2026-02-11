import { useState } from "react";
import { login } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const NUTRI_EMAIL = "nutri2@gmail.com";

  async function handleLogin(role) {
    setLoading(true);

    try {
      const userRole = await login(email, password);

      if (userRole !== role) {
        alert("Essa conta não pertence a esse tipo de acesso.");
        return;
      }

      if (role === "nutricionista" && email !== NUTRI_EMAIL) {
        alert("Somente o nutricionista autorizado pode acessar.");
        return;
      }

      navigate(role === "paciente" ? "/paciente" : "/nutricionista");
      window.location.reload();

    } catch (err) {
      alert("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Entrar</h2>

        <input
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link className="login-forgot" to="/recuperar-senha">
          Esqueci minha senha
        </Link>

        <p className="login-text">Entrar como:</p>

        <button
          className="login-btn paciente"
          disabled={loading}
          onClick={() => handleLogin("paciente")}
        >
          {loading ? "Aguarde..." : "Paciente"}
        </button>

        <button
          className="login-btn nutri"
          disabled={loading}
          onClick={() => handleLogin("nutricionista")}
        >
          {loading ? "Aguarde..." : "Nutricionista"}
        </button>

        <p className="login-footer">
          Não tem uma conta?
          <Link to="/cadastro"> Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
