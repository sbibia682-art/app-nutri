import { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";
import { isNutricionista } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Evolucao() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [obs, setObs] = useState("");
  const [lista, setLista] = useState([]);
  const [data, setData] = useState("");

  const nutri = isNutricionista();
  const user = auth.currentUser;

  // ✅ Função corrigida com useCallback
  const carregarDados = useCallback(async () => {
    if (!user) return;

    if (nutri) {
      const snapUsers = await getDocs(collection(db, "users"));
      setPacientes(
        snapUsers.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.role === "paciente")
      );

      const snap = await getDocs(collection(db, "evolucoes"));
      setLista(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } else {
      const q = query(
        collection(db, "evolucoes"),
        where("pacienteId", "==", user.uid)
      );

      const snap = await getDocs(q);
      setLista(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  }, [user, nutri]);

  // ✅ useEffect corrigido
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function salvar() {
    if (!pacienteId || !peso || !data) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const paciente = pacientes.find(p => p.id === pacienteId);

    await addDoc(collection(db, "evolucoes"), {
      pacienteNome: paciente?.name || paciente?.email || "Não informado",
      pacienteId,
      nutriId: user.uid,
      peso,
      cintura,
      observacoes: obs,
      data,
      criadoEm: serverTimestamp()
    });

    setPeso("");
    setCintura("");
    setObs("");
    setPacienteId("");
    setData("");

    carregarDados();
  }

  async function excluir(id) {
    if (!window.confirm("Excluir evolução?")) return;
    await deleteDoc(doc(db, "evolucoes", id));
    carregarDados();
  }

  return (
    <>
      <style>{`
        .evolucao-page {
          padding: 40px;
        }

        .form-evolucao {
          background: #fff;
          padding: 25px;
          border-radius: 18px;
          max-width: 600px;
          box-shadow: 0 15px 35px rgba(46,125,50,0.2);
        }

        .form-evolucao select,
        .form-evolucao input,
        .form-evolucao textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }

        .form-evolucao textarea {
          resize: vertical;
          min-height: 80px;
        }

        .botoes-evolucao {
          display: flex;
          gap: 15px;
          margin-top: 15px;
        }

        .botoes-evolucao button {
          width: auto;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, #43a047, #66bb6a);
          color: #fff;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .botoes-evolucao button:hover {
          transform: scale(1.05);
        }

        .btn-voltar {
          background: #40916c;
        }

        .lista-evolucao {
          max-width: 700px;
          margin-top: 30px;
        }

        .evolucao-card {
          background: #fff;
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 15px;
          box-shadow: 0 10px 25px rgba(46,125,50,0.15);
        }

        .evolucao-card button {
          margin-top: 10px;
          background: #e53935;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
        }
      `}</style>

      <div className="evolucao-page">
        <h3>Acompanhamento Nutricional</h3>

        {nutri && (
          <div className="form-evolucao">
            <select
              value={pacienteId}
              onChange={e => setPacienteId(e.target.value)}
            >
              <option value="">Selecione o paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name || p.email}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
            />
            <input
              placeholder="Peso (kg)"
              value={peso}
              onChange={e => setPeso(e.target.value)}
            />
            <input
              placeholder="Cintura (cm)"
              value={cintura}
              onChange={e => setCintura(e.target.value)}
            />
            <textarea
              placeholder="Observações"
              value={obs}
              onChange={e => setObs(e.target.value)}
            />

            <div className="botoes-evolucao">
              <button onClick={salvar}>Adicionar</button>

              <button
                className="btn-voltar"
                onClick={() => navigate("/nutricionista")}
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        <div className="lista-evolucao">
          {lista.map(e => (
            <div key={e.id} className="evolucao-card">
              {nutri && <p><b>Paciente:</b> {e.pacienteNome}</p>}
              <p>
                <b>Data:</b>{" "}
                {e.data && new Date(e.data).toLocaleDateString("pt-BR")}
              </p>
              <p><b>Peso:</b> {e.peso} kg</p>
              {e.cintura && <p><b>Cintura:</b> {e.cintura} cm</p>}
              {e.observacoes && <p>Obs: {e.observacoes}</p>}
              {nutri && (
                <button onClick={() => excluir(e.id)}>Excluir</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
