import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { isPaciente } from "../../auth";

export default function PerfilPaci() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!isPaciente() || !auth.currentUser) {
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUser(snap.data());
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  if (!isPaciente()) {
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
            Você precisa estar logado como paciente para acessar seu perfil.
          </p>
        </div>
      </>
    );
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando perfil...</p>;
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${user?.name}&background=2e7d32&color=fff`;

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
          max-width: 520px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 15px 35px rgba(46,125,50,0.2);
        }

        .perfil-card img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 4px solid #c8e6c9;
        }

        .perfil-info p {
          margin: 6px 0;
          color: #444;
        }
      `}</style>

      <div className="page">
        <h2>Perfil do Paciente</h2>

        <div className="perfil-card">
          <img src={avatarUrl} alt="Foto do paciente" />

          <div className="perfil-info">
            <p><strong>Nome:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Tipo:</strong> Paciente</p>
          </div>
        </div>
      </div>
    </>
  );
}
