import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          margin-top: 60px;
          padding: 20px;
          background: #e8f7f1;
          color: #2e7d32;
          text-align: center;
          font-size: 14px;
        }

        .footer-links {
          margin-top: 8px;
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: #2e7d32;
          text-decoration: none;
          font-weight: 500;
        }

        .footer-links a:hover {
          text-decoration: underline;
          cursor: pointer;
        }
          .app {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
          .content {
            flex: 1;
        }

      `}</style>

      <footer className="footer">
        <div>
          © {new Date().getFullYear()} Nutrionline
        </div>

        <div className="footer-links">
          <Link to="/sobre#contato">Contato</Link>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://wa.me/5579999999999" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </footer>
    </>
  );
}
