import { useState, useEffect, useCallback } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  where
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { isNutricionista } from "../auth";
import { Link, useNavigate } from "react-router-dom";

export default function Agenda() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);

  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [editId, setEditId] = useState(null);

  // Detecta login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsub();
  }, []);

  // CARREGAR AGENDA
  const carregarAgendamentos = useCallback(async () => {
    if (!usuario) return;

    let q;

    if (isNutricionista()) {
      q = query(collection(db, "agendas"), orderBy("data"));
    } else {
      q = query(
        collection(db, "agendas"),
        where("userId", "==", usuario.uid),
        orderBy("data")
      );
    }

    const snap = await getDocs(q);

    const list = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setAgendamentos(list);
  }, [usuario]);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  function limparForm() {
    setPaciente("");
    setData("");
    setHora("");
    setTelefone("");
    setEmail("");
    setEditId(null);
  }

  async function salvarAgendamento() {
    if (!usuario) {
      alert("Faça login para agendar");
      return;
    }

    if (!paciente || !data || !hora || !telefone || !email) {
      alert("Preencha todos os campos.");
      return;
    }

    await addDoc(collection(db, "agendas"), {
      paciente,
      data,
      hora,
      telefone,
      email,
      status: "pendente",
      userId: usuario.uid
    });

    alert("Consulta agendada!");
    limparForm();
    carregarAgendamentos();
  }

  async function excluir(id, userId) {
    if (!isNutricionista() && userId !== usuario.uid) return;
    if (!window.confirm("Excluir este agendamento?")) return;

    await deleteDoc(doc(db, "agendas", id));
    carregarAgendamentos();
  }

  async function salvarEdicao() {
    await updateDoc(doc(db, "agendas", editId), {
      paciente,
      data,
      hora,
      telefone,
      email
    });

    alert("Agendamento atualizado!");
    limparForm();
    carregarAgendamentos();
  }

  async function confirmar(id) {
    if (!isNutricionista()) return;

    await updateDoc(doc(db, "agendas", id), {
      status: "confirmada"
    });

    alert("Consulta confirmada!");
    carregarAgendamentos();
  }

  // 🔒 Se não estiver logado
  if (!usuario) {
    return (
      <>
        <style>{`
          .login-box {
            padding: 10px;
            max-width: 320px;
            background: #e8f7f1;
            border: 1px solid #b7e4c7;
            border-radius: 10px;
            margin: auto;
            margin-top: 15%;
          }

          .login-box p {
            color: #1b4332;
            margin-bottom: 15px;
            font-size: 16px;
            display: flex;
            justify-content: center;
          }

          .btn-login {
            background: #2d6a4f;
            color: #fff;
            border: none;
            padding: 10px 18px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
          }

          .btn-login:hover {
            background: #1b4332;
            transform: translateY(-2px);
          }

          .centro {
            display: flex;
            justify-content: center;
          }
        `}</style>

        <div className="login-box">
          <p>Faça login para acessar a agenda.</p>
          <div className="centro">
            <Link to="/login">
              <button className="btn-login">Ir para Login</button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="agenda-page">
      <h2 className="agenda-title">Agenda Online</h2>

      {/* RESTANTE DO SEU JSX CONTINUA IGUAL */}
      
      <button
        onClick={() => navigate("/nutricionista")}
        style={{
          marginTop: "30px",
          background: "linear-gradient(135deg, #43a047, #66bb6a)",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s"
        }}
        onMouseOver={e => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
          e.target.style.opacity = "0.95";
        }}
        onMouseOut={e => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "none";
          e.target.style.opacity = "1";
        }}
      >
        Voltar
      </button>
    </div>
  );
}
