import { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { isNutricionista } from "../auth";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

export default function PlanoAlimentar() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [editId, setEditId] = useState(null);

  const [dieta, setDieta] = useState({
    cafe: "",
    lancheManha: "",
    almoco: "",
    lancheTarde: "",
    jantar: "",
    observacoes: ""
  });

  const nutri = isNutricionista();

  // 🔥 CORREÇÃO USER REATIVO
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // 🔥 useCallback evita erro de build
  const carregarDados = useCallback(async () => {
    if (!user) return;

    if (nutri) {
      const usersSnap = await getDocs(collection(db, "users"));
      setUsuarios(
        usersSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.role === "paciente")
      );

      const q = query(
        collection(db, "planos"),
        where("nutriId", "==", user.uid)
      );
      const planosSnap = await getDocs(q);
      setPlanos(planosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } else {
      const q = query(
        collection(db, "planos"),
        where("pacienteId", "==", user.uid)
      );
      const planosSnap = await getDocs(q);
      setPlanos(planosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  }, [user, nutri]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function salvar() {
    if (!pacienteId || !titulo) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    if (!user) return;

    const paciente = usuarios.find(u => u.id === pacienteId);

    const dados = {
      pacienteId,
      pacienteNome: paciente?.name || paciente?.email || "",
      nutriId: user.uid,
      titulo,
      planoAlimentar: dieta
    };

    if (editId) {
      await updateDoc(doc(db, "planos", editId), dados);
    } else {
      await addDoc(collection(db, "planos"), dados);
    }

    limpar();
    carregarDados();
  }

  function editar(p) {
    setEditId(p.id);
    setPacienteId(p.pacienteId);
    setTitulo(p.titulo);
    setDieta(p.planoAlimentar || {});
  }

  async function excluir(id) {
    if (!window.confirm("Excluir dieta?")) return;
    await deleteDoc(doc(db, "planos", id));
    carregarDados();
  }

  function limpar() {
    setEditId(null);
    setPacienteId("");
    setTitulo("");
    setDieta({
      cafe: "",
      lancheManha: "",
      almoco: "",
      lancheTarde: "",
      jantar: "",
      observacoes: ""
    });
  }

  function handleChange(campo, valor) {
    setDieta(prev => ({ ...prev, [campo]: valor }));
  }

  // 📄 GERAR PDF
  function gerarPDF(plano) {
    const pdf = new jsPDF();
    let y = 20;

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Plano Alimentar", 105, y, { align: "center" });

    y += 10;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Paciente: ${plano.pacienteNome || "-"}`, 10, y);
    y += 6;
    pdf.text(`Título: ${plano.titulo}`, 10, y);

    y += 6;
    pdf.line(10, y, 200, y);
    y += 8;

    const r = plano.planoAlimentar || {};

    function bloco(titulo, texto) {
      if (!texto) return;
      pdf.setFont("helvetica", "bold");
      pdf.text(titulo, 10, y);
      y += 6;

      pdf.setFont("helvetica", "normal");
      const linhas = pdf.splitTextToSize(texto, 180);
      pdf.text(linhas, 12, y);
      y += linhas.length * 6 + 4;
    }

    bloco("Café da manhã", r.cafe);
    bloco("Lanche da manhã", r.lancheManha);
    bloco("Almoço", r.almoco);
    bloco("Lanche da tarde", r.lancheTarde);
    bloco("Jantar", r.jantar);
    bloco("Observações", r.observacoes);

    pdf.setFontSize(10);
    pdf.text(
      "Plano alimentar elaborado por profissional de nutrição",
      105,
      290,
      { align: "center" }
    );

    pdf.save(`plano-alimentar-${plano.pacienteNome || "paciente"}.pdf`);
  }

  return (
    <>
      <style>{`
        .container {
          padding: 20px;
          max-width: 500px;
          font-family: Arial, sans-serif;
        }

        h2 {
          color: #2e7d32;
          margin-bottom: 20px;
        }

        select, input, textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          outline: none;
          transition: border 0.3s, box-shadow 0.3s;
        }

        select:focus,
        input:focus,
        textarea:focus {
          border-color: #4caf50;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        }

        textarea {
          resize: vertical;
          min-height: 70px;
        }

        button {
          background: linear-gradient(135deg, #43a047, #66bb6a);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          margin-right: 8px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          opacity: 0.95;
        }

        button:active {
          transform: scale(0.97);
        }

        .card {
          background: #f9fff9;
          border-radius: 12px;
          padding: 16px;
          margin-top: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }

        .card h3 {
          margin-top: 0;
          color: #2e7d32;
        }

        .acoes {
          margin-top: 12px;
        }

        hr {
          border: none;
          height: 1px;
          background: #ddd;
          margin: 20px 0;
        }
      `}</style>

      <div className="container">
        <h2>Dieta do Paciente</h2>

        {nutri && (
          <>
            <select value={pacienteId} onChange={e => setPacienteId(e.target.value)}>
              <option value="">Selecione o paciente</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email}
                </option>
              ))}
            </select>

            <input
              placeholder="Título da dieta"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
            />

            <textarea placeholder="Café da manhã" value={dieta.cafe}
              onChange={e => handleChange("cafe", e.target.value)} />

            <textarea placeholder="Lanche da manhã" value={dieta.lancheManha}
              onChange={e => handleChange("lancheManha", e.target.value)} />

            <textarea placeholder="Almoço" value={dieta.almoco}
              onChange={e => handleChange("almoco", e.target.value)} />

            <textarea placeholder="Lanche da tarde" value={dieta.lancheTarde}
              onChange={e => handleChange("lancheTarde", e.target.value)} />

            <textarea placeholder="Jantar" value={dieta.jantar}
              onChange={e => handleChange("jantar", e.target.value)} />

            <textarea placeholder="Observações" value={dieta.observacoes}
              onChange={e => handleChange("observacoes", e.target.value)} />

            <button onClick={salvar}>
              {editId ? "Salvar alterações" : "Criar dieta"}
            </button>

            <button onClick={() => navigate("/nutricionista")}>
              Voltar
            </button>

            <hr />
          </>
        )}

        {planos.map(p => (
          <div key={p.id} className="card">
            <h3>{p.titulo}</h3>

            <p><b>Café:</b> {p.planoAlimentar?.cafe}</p>
            <p><b>Lanche manhã:</b> {p.planoAlimentar?.lancheManha}</p>
            <p><b>Almoço:</b> {p.planoAlimentar?.almoco}</p>
            <p><b>Lanche tarde:</b> {p.planoAlimentar?.lancheTarde}</p>
            <p><b>Jantar:</b> {p.planoAlimentar?.jantar}</p>

            {p.planoAlimentar?.observacoes && (
              <p><b>Obs:</b> {p.planoAlimentar.observacoes}</p>
            )}

            <div className="acoes">
              <button onClick={() => gerarPDF(p)}>Gerar PDF</button>

              {nutri && (
                <>
                  <button onClick={() => editar(p)}>Editar</button>
                  <button onClick={() => excluir(p.id)}>Excluir</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
