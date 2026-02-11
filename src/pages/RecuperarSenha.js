import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  // 
  const recuperarSenha = async () => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: "http://localhost:3000/login" 
    });

    setMsg("Email enviado! Verifique sua caixa de entrada.");
  } catch (error) {
    setMsg("Erro ao enviar email. Verifique se o email está correto.");
  }
};

  

  return (
    <>
      <style>{`
        .recuperar-container {
          min-height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        }

        .recuperar-card {
          background: #fff;
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 15px 35px rgba(46,125,50,0.25);
          text-align: center;
        }

        .recuperar-card h2 {
          color: #2e7d32;
          margin-bottom: 20px;
        }

        .recuperar-card input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          margin-bottom: 15px;
          font-size: 15px;
          outline: none;
        }

        .recuperar-card button {
          width: 100%;
          padding: 12px;
          background: #2e7d32;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .recuperar-card button:hover {
          background: #1b5e20;
          transform: scale(1.05);
        }

        .recuperar-msg {
          margin-top: 15px;
          color: #2e7d32;
          font-weight: 500;
        }
      `}</style>

      <div className="recuperar-container">
        <div className="recuperar-card">
          <h2>Recuperar Senha</h2>

          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={recuperarSenha}>Enviar</button>

          {msg && <p className="recuperar-msg">{msg}</p>}
        </div>
      </div>
    </>
  );
}