import { useState, useEffect } from "react";
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


  // Usuário logado
  const [usuario, setUsuario] = useState(null);

  // Lista de agendamentos
  const [agendamentos, setAgendamentos] = useState([]);

  // Campos do formulário
  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  // Edição
  const [editId, setEditId] = useState(null);

  // Detecta login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return () => unsub();
  }, []);

  //  CARREGAR AGENDA (FILTRADA)
  async function carregarAgendamentos() {
    if (!usuario) return;

    let q;

    // Nutricionista vê tudo
    if (isNutricionista()) {
      q = query(collection(db, "agendas"), orderBy("data"));
    } 
    // Usuário comum vê só o dele
    else {
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
  }

  function limparForm() {
    setPaciente("");
    setData("");
    setHora("");
    setTelefone("");
    setEmail("");
    setEditId(null);
  }

  //  SALVAR NOVO AGENDAMENTO
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
      userId: usuario.uid //  VÍNCULO COM USUÁRIO
    });

    alert("Consulta agendada!");
    limparForm();
    carregarAgendamentos();
  }

  // EXCLUIR (somente dono ou nutri)
  async function excluir(id, userId) {
    if (!isNutricionista() && userId !== usuario.uid) return;

    if (!window.confirm("Excluir este agendamento?")) return;

    await deleteDoc(doc(db, "agendas", id));
    carregarAgendamentos();
  }

  function editar(ag) {
    if (!isNutricionista() && ag.userId !== usuario.uid) return;

    setEditId(ag.id);
    setPaciente(ag.paciente);
    setData(ag.data);
    setHora(ag.hora);
    setTelefone(ag.telefone);
    setEmail(ag.email);
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

  //  CONFIRMAR (SÓ NUTRI)
  async function confirmar(id) {
    if (!isNutricionista()) return;

    await updateDoc(doc(db, "agendas", id), {
      status: "confirmada"
    });

    alert("Consulta confirmada!");
    carregarAgendamentos();
  }

  useEffect(() => {
    carregarAgendamentos();
  }, [usuario]);

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
          justify-content: center
          
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

        .centro{
         display: flex;
         justify-content: center;
        }
         

      `}</style>
      
      <div className="login-box">
        <p> Faça login para acessar a agenda.</p>


          <div className="centro">
        <Link to="/login">
          <button className="btn-login">
            Ir para Login
          </button>
        </Link>
      </div>
      </div>
    </>
  );
  }

  return (
  <div className="agenda-page">
    <h2 className="agenda-title">Agenda Online</h2>

    {!isNutricionista() && (
      <div className="agenda-card">
        <h3 className="agenda-subtitle">
          {editId ? "Editar agendamento" : "Novo agendamento"}
        </h3>

        <div className="agenda-form">
          <input
            placeholder="Nome do paciente"
            value={paciente}
            onChange={e => setPaciente(e.target.value)}
          />

          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
          />

          <input
            type="time"
            value={hora}
            onChange={e => setHora(e.target.value)}
          />

          <input
            placeholder="Telefone"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        

        <div className="agenda-acao">
          {editId ? (
            <>
              <button className="btn-um" onClick={salvarEdicao}>
                Salvar
              </button>
              <button className="btn-dois" onClick={limparForm}>
                Cancelar
              </button>
            </>
          ) : (
            <button className="btn-um" onClick={salvarAgendamento}>
              Agendar
            </button>
          )}
          
        </div>
      </div>
    )}

    <h3 className="agenda-subtitle">
      {isNutricionista() ? "Todas as consultas" : "Minhas consultas"}
    </h3>

    {agendamentos.length === 0 && (
      <p className="agenda-consulta">Nenhuma consulta.</p>
    )}

    <ul className="agenda-lista">
      {agendamentos.map(a => (
        <li key={a.id} className="agenda-item">
          <div className="agenda-info">
            <strong>{a.paciente}</strong>
            <span>{a.data} • {a.hora}</span>
            <span>📞 {a.telefone}</span>
            <span>✉️ {a.email}</span>
            <span className={`status ${a.status}`}>
              {a.status}
            </span>
          </div>

          <div className="agenda-buttons">
            {isNutricionista() && a.status !== "confirmada" && (
              <button className="btn confirm" onClick={() => confirmar(a.id)}>
                Confirmar
              </button>
            )}

            {(isNutricionista() || a.userId === usuario.uid) && (
              <>
                
                <button
                  className="btn delete"
                  onClick={() => excluir(a.id, a.userId)}
                >
                  Excluir
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
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
