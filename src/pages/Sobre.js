import {  useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa6";

export default function Sobre() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#contato") {
      const element = document.getElementById("contato");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="sobre-container">
      {/* ESTILOS NA MESMA PÁGINA */}
      <style>{`
        .sobre-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }

        .sobre-container h1 {
          text-align: center;
          color: #2f7d4c;
          margin-bottom: 60px;
          font-size: 32px;
        }

        .sobre-topo {
          display: flex;
          align-items: flex-start;
          gap: 60px;
          margin-bottom: 80px;
        }

        .sobre-texto {
          max-width: 500px;
          line-height: 1.7;
          padding: 25px;
          border-radius: 16px;
          text-align: center;
          color: #3f3737;
          margin-top: 60px;
          font-size: 16px;
        }

        .sobre-imagens img {
          width: 320px;
          height: 600px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          transition: transform 0.3s ease;
        }

        .sobre-imagens img:hover {
          transform: scale(1.03);
        }

        .sobre-blocos {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
        }

        .bloco {
          background: linear-gradient(135deg, #0f3d2e, #2e7d32, #66bb6a);
          padding: 25px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 8px 18px rgba(0,0,0,0.08);
          transition: transform 0.2s ease;
        }

        .bloco:hover {
          transform: translateY(-5px);
        }

        .bloco h3 {
          color: #ffffff;
          margin-bottom: 10px;
        }

        .bloco p {
          color: #ffffff;
          font-size: 14px;
        }

        .contato-container {
          background: linear-gradient(135deg, #0f3d2e, #2e7d32, #66bb6a);
          padding: 40px 20px;
          border-radius: 20px;
          text-align: center;
          margin-bottom: 50px;
        }

        .contato-container h2 {
          color: #ffffff;
          margin-bottom: 20px;
        }

        .contato-texto {
          color: #ffffff;
          margin-bottom: 25px;
        }

        .contato-info p,
        .contato-link {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          text-decoration: none;
          color: #ffffff;
          font-size: 15px;
        }

        .contato-link:hover {
          text-decoration: underline;
        }

        .icone,
        .icone-insta {
          font-size: 22px;
        }

        .btn-contato {
          display: inline-block;
          margin-top: 25px;
          padding: 14px 28px;
          background-color: #25d366;
          color: #fff;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-contato:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .sobre-topo {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .sobre-imagens img {
            width: 100%;
            height: 400px;
          }

          .sobre-texto {
            margin-top: 20px;
          }
        }
      `}</style>

      <h1>Sobre meu trabalho</h1>

      <div className="sobre-topo">
        <div className="sobre-imagens">
          <img src="/nutri2.jpg" alt="foto-nutricionista" />
        </div>

        <p className="sobre-texto">
          Meu propósito é ajudar você a conquistar mais saúde, bem-estar e qualidade de vida
          de forma prática e sustentável. Acredito que cada pessoa é única, por isso o
          acompanhamento nutricional deve ser individualizado, sem imposições e sem culpa.
          Aqui, não existe “alimento proibido”, mas sim escolhas conscientes.
          <br /><br />
          Trabalho com uma abordagem humanizada, focada em educação alimentar, autonomia e
          equilíbrio. Juntos, vamos construir hábitos saudáveis e duradouros, promovendo mais
          disposição, autoestima e prazer ao se alimentar.
        </p>
      </div>

      <div className="sobre-blocos">
        <div className="bloco">
          <h3>Missão</h3>
          <p>Promover saúde e qualidade de vida através de uma nutrição humanizada.</p>
        </div>

        <div className="bloco">
          <h3>Visão</h3>
          <p>Resultados reais sem sofrimento e sem restrições extremas.</p>
        </div>

        <div className="bloco">
          <h3>Valores</h3>
          <p>Empatia, ética, ciência e respeito à individualidade.</p>
        </div>
      </div>

      <div className="contato-container" id="contato">
        <h2>Entre em contato</h2>

        <p className="contato-texto">
          Ficou com alguma dúvida ou quer saber mais? Me chama 😊
        </p>

        <div className="contato-info">
          <p><FaWhatsapp className="icone" /> (79) 99999-9999</p>
          <p><FaEnvelope className="icone" /> contato@nutrionline.com</p>

          <a
            href="https://instagram.com/nutrionline"
            target="_blank"
            rel="noopener noreferrer"
            className="contato-link"
          >
            <FaInstagram className="icone-insta" /> @nutrionline
          </a>
        </div>
      </div>
    </div>
  );
}
