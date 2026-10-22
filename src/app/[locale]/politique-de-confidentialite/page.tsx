import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { CompanyIdentity } from '@/components/legal/CompanyIdentity';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';
import { COMPANY } from '@/lib/company';
import { canonicalFor, languageAlternates } from '@/lib/seo';

const PATH = '/politique-de-confidentialite';
const LAST_UPDATED_DATE = '2026-10-21';
const LAST_UPDATED_FR = '21 octobre 2026';
const LAST_UPDATED_EN = 'October 21, 2026';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  const title = fr ? 'Politique de confidentialité' : 'Privacy Policy';
  const description = fr
    ? 'Politique de confidentialité de BNP Coorporation Sarl (BNPC) : données du formulaire de contact, finalités, durées de conservation, cookies et exercice de vos droits.'
    : 'BNP Coorporation Sarl (BNPC) privacy policy: contact form data, purposes, retention periods, cookies and how to exercise your rights.';
  return {
    title: `${title} — BNPC`,
    description,
    alternates: {
      canonical: canonicalFor(locale, PATH),
      languages: languageAlternates(PATH),
    },
    openGraph: {
      title: `${title} — BNP Coorporation Sarl`,
      description,
      type: 'website',
      url: canonicalFor(locale, PATH),
    },
  };
}

const sectionsFr: LegalSection[] = [
  {
    id: 'responsable',
    title: 'Responsable du traitement',
    body: (
      <>
        <p>Le responsable du traitement des données collectées sur ce site est :</p>
        <CompanyIdentity locale="fr" />
      </>
    ),
  },
  {
    id: 'donnees',
    title: 'Données collectées',
    body: (
      <>
        <p>Nous collectons uniquement les données nécessaires aux finalités décrites ci-dessous.</p>
        <h3>Formulaire de contact</h3>
        <ul>
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone, lorsque vous le renseignez</li>
          <li>Service concerné et contenu de votre message</li>
        </ul>
        <h3>Données techniques</h3>
        <ul>
          <li>
            Adresse IP et horodatage des requêtes, pour limiter les envois
            abusifs et sécuriser le formulaire
          </li>
          <li>Journaux techniques nécessaires au diagnostic et à la sécurité du site</li>
        </ul>
        <p>
          Le site ne propose ni compte utilisateur ni paiement en ligne. Nous ne
          vous demandons jamais de données sensibles.
        </p>
      </>
    ),
  },
  {
    id: 'finalites',
    title: 'Finalités et bases légales',
    body: (
      <table>
        <thead>
          <tr>
            <th>Finalité</th>
            <th>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Répondre à votre demande et préparer un devis</td>
            <td>Consentement ; mesures précontractuelles</td>
          </tr>
          <tr>
            <td>Limiter le spam et sécuriser le site</td>
            <td>Intérêt légitime</td>
          </tr>
          <tr>
            <td>Respecter nos obligations légales et comptables</td>
            <td>Obligation légale</td>
          </tr>
          <tr>
            <td>Activer d’éventuels cookies de mesure d’audience ou de marketing</td>
            <td>Votre consentement</td>
          </tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'destinataires',
    title: 'Destinataires et transferts',
    body: (
      <>
        <p>
          Les données sont accessibles aux collaborateurs de BNPC qui en ont
          besoin pour traiter votre demande et aux prestataires techniques
          suivants, strictement pour les besoins du service :
        </p>
        <ul>
          <li><strong>Resend</strong> — acheminement des e-mails du formulaire de contact</li>
          <li><strong>Upstash</strong> — limitation du nombre de requêtes et anti-spam</li>
          <li><strong>Cloudflare Turnstile</strong> — vérification anti-robot du formulaire</li>
          <li><strong>WordPress / hébergement</strong> — diffusion des contenus éditoriaux</li>
        </ul>
        <p>
          Nous ne vendons ni ne louons vos données. Certains prestataires peuvent
          les traiter en dehors du Cameroun (Union européenne, États-Unis), dans
          la limite de ce qui est nécessaire au service et sous leurs engagements
          contractuels de sécurité.
        </p>
      </>
    ),
  },
  {
    id: 'durees',
    title: 'Durées de conservation',
    body: (
      <ul>
        <li>
          <strong>Demandes de contact et devis :</strong> 24 mois à compter du
          dernier échange, puis suppression, sauf obligation légale
        </li>
        <li>
          <strong>Choix en matière de cookies :</strong> 6 mois, après quoi votre
          consentement vous est redemandé
        </li>
        <li>
          <strong>Journaux techniques :</strong> durée strictement nécessaire à la
          sécurité, et au maximum 12 mois
        </li>
        <li>
          <strong>Documents contractuels et comptables :</strong> durée légale
          applicable
        </li>
      </ul>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies et traceurs',
    body: (
      <>
        <p>
          Un cookie est un petit fichier déposé sur votre appareil lors de la
          visite d’un site. Nous utilisons également le stockage local du
          navigateur pour mémoriser votre choix. Aucun traceur publicitaire ou de
          mesure d’audience n’est actif à ce jour.
        </p>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Finalité</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>bnpc_consent</code></td>
              <td>Nécessaire</td>
              <td>Mémoriser vos choix de consentement</td>
              <td>6 mois</td>
            </tr>
            <tr>
              <td><code>bnpc-consent</code> (stockage local)</td>
              <td>Nécessaire</td>
              <td>Mémoriser vos choix de consentement</td>
              <td>6 mois</td>
            </tr>
          </tbody>
        </table>
        <p>
          Les cookies nécessaires ne peuvent pas être désactivés car le site ne
          peut pas fonctionner correctement sans eux.
        </p>
        <p>
          <CookieSettingsButton className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover">
            Gérer mes préférences de cookies
          </CookieSettingsButton>
          . Pour le cadre général du site, consultez les{' '}
          <Link href="/fr/conditions-generales-utilisation">
            conditions générales d’utilisation
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'securite',
    title: 'Sécurité',
    body: (
      <p>
        Nous mettons en œuvre des mesures raisonnables pour protéger vos données :
        connexion chiffrée (HTTPS), accès restreint aux personnes habilitées,
        limitation du débit des requêtes, protection anti-robot et minimisation
        des données collectées. Si vous pensez qu’une atteinte à vos données
        s’est produite, contactez-nous sans délai.
      </p>
    ),
  },
  {
    id: 'droits',
    title: 'Vos droits',
    body: (
      <>
        <p>Vous disposez des droits suivants sur vos données personnelles :</p>
        <ul>
          <li>Droit d’accès et de copie des données vous concernant</li>
          <li>Droit de rectification des données inexactes ou incomplètes</li>
          <li>Droit à l’effacement, dans les limites prévues par la loi</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d’opposition pour des motifs légitimes</li>
          <li>Droit à la portabilité des données que vous avez fournies</li>
          <li>Droit de retirer votre consentement à tout moment</li>
        </ul>
        <p>
          Pour exercer ces droits, écrivez à{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>{' '}
          en précisant votre demande. Nous répondons dans un délai maximal de 30
          jours. Une pièce d’identité peut être demandée en cas de doute
          raisonnable sur votre identité.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez
          saisir l’autorité nationale compétente en matière de protection des
          données personnelles.
        </p>
      </>
    ),
  },
  {
    id: 'modifications',
    title: 'Modifications',
    body: (
      <p>
        Nous pouvons mettre à jour cette politique pour tenir compte de
        l’évolution du site ou de la réglementation. La date de dernière mise à
        jour figure en haut de la page.
      </p>
    ),
  },
];

const sectionsEn: LegalSection[] = [
  {
    id: 'responsable',
    title: 'Data controller',
    body: (
      <>
        <p>The controller of data collected on this website is:</p>
        <CompanyIdentity locale="en" />
      </>
    ),
  },
  {
    id: 'donnees',
    title: 'Data collected',
    body: (
      <>
        <p>We only collect the data needed for the purposes described below.</p>
        <h3>Contact form</h3>
        <ul>
          <li>First and last name</li>
          <li>Email address</li>
          <li>Phone number, when provided</li>
          <li>Service of interest and message content</li>
        </ul>
        <h3>Technical data</h3>
        <ul>
          <li>
            IP address and request timestamps, to limit abusive submissions and
            secure the form
          </li>
          <li>Technical logs required for diagnostics and website security</li>
        </ul>
        <p>
          The website offers no user accounts or online payments. We never ask for
          sensitive data.
        </p>
      </>
    ),
  },
  {
    id: 'finalites',
    title: 'Purposes and legal bases',
    body: (
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Legal basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Responding to your request and preparing a quote</td>
            <td>Consent; pre-contractual steps</td>
          </tr>
          <tr>
            <td>Limiting spam and securing the website</td>
            <td>Legitimate interest</td>
          </tr>
          <tr>
            <td>Meeting our legal and accounting obligations</td>
            <td>Legal obligation</td>
          </tr>
          <tr>
            <td>Enabling any analytics or marketing cookies</td>
            <td>Your consent</td>
          </tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'destinataires',
    title: 'Recipients and transfers',
    body: (
      <>
        <p>
          Data is accessible to BNPC staff who need it to handle your request and
          to the following technical providers, strictly as needed for the
          service:
        </p>
        <ul>
          <li><strong>Resend</strong> — delivering contact form emails</li>
          <li><strong>Upstash</strong> — request rate limiting and spam protection</li>
          <li><strong>Cloudflare Turnstile</strong> — bot verification of the form</li>
          <li><strong>WordPress / hosting</strong> — publishing editorial content</li>
        </ul>
        <p>
          We do not sell or rent your data. Some providers may process it outside
          Cameroon (European Union, United States), only as necessary for the
          service and under their contractual security commitments.
        </p>
      </>
    ),
  },
  {
    id: 'durees',
    title: 'Retention periods',
    body: (
      <ul>
        <li>
          <strong>Contact requests and quotes:</strong> 24 months from the last
          exchange, then deleted, unless a legal retention obligation applies
        </li>
        <li>
          <strong>Cookie choices:</strong> 6 months, after which you are asked for
          consent again
        </li>
        <li>
          <strong>Technical logs:</strong> only as long as needed for security, and
          no more than 12 months
        </li>
        <li>
          <strong>Contractual and accounting records:</strong> applicable legal
          period
        </li>
      </ul>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and trackers',
    body: (
      <>
        <p>
          A cookie is a small file stored on your device when you visit a website.
          We also use browser local storage to remember your choice. No
          advertising or analytics tracker is currently active.
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>bnpc_consent</code></td>
              <td>Necessary</td>
              <td>Remembering your consent choices</td>
              <td>6 months</td>
            </tr>
            <tr>
              <td><code>bnpc-consent</code> (local storage)</td>
              <td>Necessary</td>
              <td>Remembering your consent choices</td>
              <td>6 months</td>
            </tr>
          </tbody>
        </table>
        <p>
          Necessary cookies cannot be disabled because the website cannot work
          properly without them.
        </p>
        <p>
          <CookieSettingsButton className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover">
            Manage my cookie preferences
          </CookieSettingsButton>
          . For the general framework of the website, see our{' '}
          <Link href="/en/conditions-generales-utilisation">Terms of Service</Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'securite',
    title: 'Security',
    body: (
      <p>
        We implement reasonable measures to protect your data: encrypted
        connections (HTTPS), restricted access for authorised personnel, request
        rate limiting, bot protection and data minimisation. If you believe your
        data has been compromised, contact us immediately.
      </p>
    ),
  },
  {
    id: 'droits',
    title: 'Your rights',
    body: (
      <>
        <p>You have the following rights over your personal data:</p>
        <ul>
          <li>Right to access and obtain a copy of your data</li>
          <li>Right to rectify inaccurate or incomplete data</li>
          <li>Right to erasure, within the limits set by law</li>
          <li>Right to restrict processing</li>
          <li>Right to object on legitimate grounds</li>
          <li>Right to portability of the data you provided</li>
          <li>Right to withdraw consent at any time</li>
        </ul>
        <p>
          To exercise these rights, email{' '}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>{' '}
          with details of your request. We respond within a maximum of 30 days.
          Proof of identity may be requested where there is reasonable doubt about
          your identity.
        </p>
        <p>
          If you believe your rights are not being respected, you may contact the
          competent national authority for personal data protection.
        </p>
      </>
    ),
  },
  {
    id: 'modifications',
    title: 'Changes',
    body: (
      <p>
        We may update this policy to reflect changes to the website or applicable
        regulations. The date of the latest update appears at the top of the page.
      </p>
    ),
  },
];

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  return (
    <LegalDocument
      title={fr ? 'Politique de confidentialité' : 'Privacy Policy'}
      subtitle={
        fr
          ? 'Comment nous collectons, utilisons et protégeons vos données personnelles.'
          : 'How we collect, use and protect your personal data.'
      }
      image="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1800&q=70"
      tocLabel={fr ? 'Sommaire' : 'Contents'}
      lastUpdatedLabel={fr ? 'Dernière mise à jour' : 'Last updated'}
      lastUpdated={fr ? LAST_UPDATED_FR : LAST_UPDATED_EN}
      lastUpdatedDate={LAST_UPDATED_DATE}
      intro={
        <p>
          {fr
            ? "Cette politique explique quelles données personnelles sont collectées lorsque vous utilisez le site de BNP Coorporation Sarl (BNPC), pourquoi elles le sont, combien de temps elles sont conservées et comment exercer vos droits."
            : 'This policy explains what personal data is collected when you use the BNP Coorporation Sarl (BNPC) website, why it is collected, how long it is kept and how to exercise your rights.'}
        </p>
      }
      sections={fr ? sectionsFr : sectionsEn}
    />
  );
}
