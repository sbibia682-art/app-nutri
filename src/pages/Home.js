import "../App.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    
    <div className="home">
      <div className="home-overlay">
        <div className="home-container">
          <span className="home-tag">Clínica de Nutrição</span>
          <h1 className="home-title">Cuidando da sua saúde com leveza</h1>
          <p className="home-text">
            Atendimento personalizado com agenda online, acompanhamento nutricional
            e planos feitos especialmente para você.
          </p>
            <div className="home-buttons">
            <Link to="/agenda" className="home-btn primary">
              Agendar Consulta
            </Link>
            <Link to="/sobre" className="home-btn secondary">
              Saiba Mais
            </Link>
          </div>
        </div>
      </div>
    </div>

    
  );
}
