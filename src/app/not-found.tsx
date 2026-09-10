import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="fr">
      <body>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Page introuvable</h2>
          <p>La ressource demandée n'existe pas.</p>
          <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
            Retour à l'accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
