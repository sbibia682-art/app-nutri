import { Link } from "react-router-dom";
import { isNutricionista } from "../auth";

export default function PainelNutricionista() {
  if (!isNutricionista()) {
    return (
      <>
        <style>{`
          .alert {
            background: #fff3cd;
            padding: 15px;
            border-radius: 10px;
            color: #856404;
            margin: 40px;
            text-align: center;
          }
        `}</style>

        <p className="alert">
          Acesso restrito. Faça login como nutricionista.
        </p>
      </>
    );
  }

  return (
    <>
      <style>{`
      
        .painel-container {
          padding: 40px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .painel-container h2 {
          color: #2e7d32;
          margin-bottom: 8px;
        }

        .painel-container p {
          color: #555;
          margin-bottom: 35px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 25px;
        }

        .card {
          background: #ffffff;
          border-radius: 20px;
          padding: 30px 25px;
          box-shadow: 0 12px 30px rgba(46,125,50,0.18);
          text-decoration: none;
          color: #2e7d32;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          min-height: 160px;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(46,125,50,0.28);
        }

        .card h3 {
          margin-bottom: 10px;
          font-size: 20px;
        }

        .card span {
          font-size: 14px;
          color: #555;
        }
          .painel{
          
           background: linear-gradient(135deg, #43a047, #66bb6a);
          }
      `}</style>
       
      
      <div className="painel-container">
        <h2>Painel do Nutricionista</h2>
        <p>Gerencie seus pacientes, consultas e planos alimentares</p>

        <div className="cards">
          <Link to="/agenda" className="card">
            <h3>📅 Agenda</h3>
            <span>Gerenciar consultas</span>
          </Link>

          <Link to="/evolucao" className="card">
            <h3>📊 Acompanhamento</h3>
            <span>Evolução nutricional</span>
          </Link>

          <Link to="/planos" className="card">
            <h3>🥗 Plano Alimentar</h3>
            <span>Criar e editar dietas</span>
          </Link>
        </div>
      </div>
      
    </>
  );
}
