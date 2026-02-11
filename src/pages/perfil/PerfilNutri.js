import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { isNutricionista } from "../../auth";
import { Link } from "react-router-dom";

export default function PerfilNutri() {
  const [nutri, setNutri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNutri() {
      if (!isNutricionista() || !auth.currentUser) {
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setNutri(snap.data());
      }

      setLoading(false);
    }

    loadNutri();
  }, []);

  if (!isNutricionista()) {
    return (
      <>
        <style>{`
          .alert {
            background: #fff3cd;
            padding: 15px;
            border-radius: 10px;
            color: #856404;
          }
        `}</style>

        <div className="page">
          <h2>Perfil</h2>
          <p className="alert">
            Você precisa estar logado como nutricionista.
          </p>
        </div>
      </>
    );
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando perfil profissional...</p>;
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${nutri?.name}&background=2e7d32&color=fff`;

  return (
    <>
      <style>{`
        .page {
          padding: 40px;
        }

        h2 {
          color: #2e7d32;
        }

        .perfil-card {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
          padding: 25px;
          max-width: 600px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 15px 35px rgba(46,125,50,0.2);
        }

        .perfil-card img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 4px solid #c8e6c9;
        }

        .perfil-info p {
          margin: 6px 0;
          color: #444;
        }

        .area-profissional {
          margin-top: 35px;
        }

        .area-profissional h3 {
          color: #1b5e20;
          margin-bottom: 10px;
        }

        .area-profissional ul {
          list-style: none;
          padding: 0;
        }

        .area-profissional li {
          background: #e8f5e9;
          margin-bottom: 10px;
          padding: 12px 15px;
          border-radius: 10px;
          transition: transform 0.2s ease;
        }

        .area-profissional li:hover {
          transform: translateX(6px);
        }
      `}</style>

      <div className="page">
        <h2>Perfil Profissional</h2>

        <div className="perfil-card">
          <img src={avatarUrl} alt="Foto do nutricionista" />

          <div className="perfil-info">
            <p><strong>Nome:</strong> {nutri?.name}</p>
            <p><strong>Email:</strong> {nutri?.email}</p>
            <p><strong>Perfil:</strong> Nutricionista</p>
            <p><strong>Status:</strong> Ativo</p>
          </div>
        </div>

        <div className="area-profissional">
          <h3>Área profissional</h3>
          <ul>
              <Link to= "/agenda"> 
            <li>📅 Agenda</li>
            </Link>
              <Link to= "/planos"> 
            <li>🥗 Planos alimentares</li>
            </Link>
              <Link to= "/evolucao"> 
            <li>📊 Evolução nutricional</li>
            </Link>
          </ul>
        </div>
      </div>
    </>
  );
}
