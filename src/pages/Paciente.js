import { isPaciente } from "../auth";
import PlanoAlimentar from "../components/PlanoAlimentar";
import Evolucao from "../components/Evolucao";

export default function Paciente() {
  const logado = isPaciente();

  return (
    <div className="paciente-page">
      <h2 className="paciente-title">Área do Paciente</h2>

      <div className="paciente-grade">
        <div className="paciente-card">
          <h3 className="paciente-subtitle">Plano Alimentar</h3>
          <PlanoAlimentar />
        </div>

        <div className="paciente-card">
          <h3 className="paciente-subtitle">Acompanhamento</h3>

          {logado ? (
            <Evolucao />
          ) : (
            <p className="paciente-alerta">
              Faça login para ver seu acompanhamento nutricional.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
