import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';
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
        <p>
          Le responsable du traitement des données collectées sur ce site est
          <strong> BNP Coorporation Sarl (BNPC)</strong>, société à
          responsabilité limitée au capital de 1 000 000 FCFA, dont le siège est
          situé BP 4219, Yaoundé, Cameroun (RCCM RC/YAO/2023/C/323, NIU
          M042318209289U).
        </p>
        <p>
          Pour toute question relative à vos données personnelles :{' '}
          <a href="mailto:contact@bnp-coorporation.com">
            contact@bnp-coorporation.com
          </a>{' '}
          — <a href="tel:+237655010919">(+237) 6 55 01 09 19</a>.
        </p>
      </>
    ),
  },
  {
    id: 'donnees',
    title: 'Données collectées',
    body: (
      <>
        <p>Nous collectons uniquement les données nécessaires aux finalités décrites ci-dessous.</p>
        <h3>Données transmises via le formulaire de contact</h3>
        <ul>
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone, lorsque vous le renseignez</li>
          <li>Service concerné et contenu de votre message</li>
          <li>Confirmation de votre consentement au traitement</li>
        </ul>
        <h3>Données techniques</h3>
        <ul>
          <li>
            Adresse IP et horodatage des requêtes, utilisés pour limiter les
            envois abusifs et sécuriser le formulaire
          </li>
          <li>Journaux techniques nécessaires au diagnostic et à la sécurité du site</li>
        </ul>
        <p>
          Le site ne propose pas de compte utilisateur ni de paiement en ligne.
          Nous ne vous demandons jamais de données sensibles (santé, opinions
          politiques ou religieuses, données biométriques, etc.).
        </p>
      </>
    ),
  },
  {
    id: 'finalites',
    title: 'Finalités et bases légales',
    body: (
      <>
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
              <td>Consentement exprimé via la case dédiée ; mesures précontractuelles</td>
            </tr>
            <tr>
              <td>Limiter le spam, prévenir les abus et sécuriser le site</td>
              <td>Intérêt légitime à protéger le site et ses utilisateurs</td>
            </tr>
            <tr>
              <td>Respecter nos obligations légales et comptables</td>
              <td>Obligation légale</td>
            </tr>
            <tr>
              <td>Activer d’éventuels cookies de mesure d’audience ou de marketing</td>
              <td>Votre consentement, modifiable à tout moment</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: 'destinataires',
    title: 'Destinataires et prestataires',
    body: (
      <>
        <p>
          Les données sont accessibles aux collaborateurs de BNPC qui en ont
          besoin pour traiter votre demande. Elles peuvent être traitées par les
          prestataires techniques suivants, strictement pour les besoins du
          service :
        </p>
        <ul>
          <li>
            <strong>Resend</strong> — acheminement des e-mails envoyés depuis le
            formulaire de contact, lorsque ce service est configuré
          </li>
          <li>
            <strong>Upstash</strong> — limitation du nombre de requêtes et
            protection anti-spam, lorsque ce service est configuré
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> — vérification anti-robot du
            formulaire, lorsque ce service est activé
          </li>
          <li>
            <strong>WordPress / hébergement du site</strong> — diffusion des
            contenus éditoriaux (services, projets, actualités)
          </li>
        </ul>
        <p>
          Nous ne vendons ni ne louons vos données personnelles. Elles ne sont
          communiquées à des tiers que dans les cas prévus par la loi ou avec
          votre accord.
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
          dernier échange, puis suppression, sauf obligation légale de conservation
        </li>
        <li>
          <strong>Preuve de votre choix en matière de cookies :</strong> 6 mois,
          après quoi votre consentement vous est redemandé
        </li>
        <li>
          <strong>Journaux techniques et limitation de débit :</strong> durée
          strictement nécessaire à la sécurité, et au maximum 12 mois
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
            <tr>
              <td>Mesure d’audience</td>
              <td>Optionnel</td>
              <td>Statistiques de fréquentation anonymes</td>
              <td>Aucun outil actif</td>
            </tr>
            <tr>
              <td>Marketing</td>
              <td>Optionnel</td>
              <td>Personnalisation et mesure des campagnes</td>
              <td>Aucun outil actif</td>
            </tr>
          </tbody>
        </table>
        <p>
          Les cookies nécessaires ne peuvent pas être désactivés car le site ne
          peut pas fonctionner correctement sans eux. Les catégories optionnelles
          restent désactivées par défaut et ne seront utilisées qu’après votre
          accord explicite.
        </p>
        <p>
          <CookieSettingsButton className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover">
            Gérer mes préférences de cookies
          </CookieSettingsButton>
          . Pour en savoir plus sur le cadre général du site, consultez les{' '}
          <Link href="/fr/conditions-generales-utilisation">
            conditions générales d’utilisation
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'transferts',
    title: 'Transferts hors du Cameroun',
    body: (
      <p>
        Certains prestataires techniques peuvent traiter des données en dehors du
        Cameroun, notamment dans l’Union européenne ou aux États-Unis. Ces
        transferts sont limités à ce qui est nécessaire à l’exécution du service
        et encadrés par les engagements contractuels et les mesures de sécurité de
        ces prestataires.
      </p>
    ),
  },
  {
    id: 'securite',
    title: 'Sécurité',
    body: (
      <>
        <p>
          Nous mettons en œuvre des mesures raisonnables pour protéger vos
          données : connexion chiffrée (HTTPS), accès restreint aux personnes
          habilitées, limitation du débit des requêtes, protection anti-robot et
          minimisation des données collectées.
        </p>
        <p>
          Aucun système n’est infaillible. Si vous pensez qu’une atteinte à vos
          données s’est produite, contactez-nous sans délai à l’adresse indiquée
          ci-dessous.
        </p>
      </>
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
          <a href="mailto:contact@bnp-coorporation.com">
            contact@bnp-coorporation.com
          </a>{' '}
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
    id: 'mineurs',
    title: 'Mineurs',
    body: (
      <p>
        Le site s’adresse à des professionnels et à des particuliers majeurs. Nous
        ne collectons pas sciemment de données concernant des mineurs. Si vous
        pensez qu’un mineur nous a transmis des données, contactez-nous afin que
        nous puissions les supprimer.
      </p>
    ),
  },
  {
    id: 'modifications',
    title: 'Modifications de cette politique',
    body: (
      <p>
        Nous pouvons mettre à jour cette politique pour tenir compte de
        l’évolution du site ou de la réglementation. La date de dernière mise à
        jour figure en haut de la page. En cas de changement important, nous
        vous invitons à consulter à nouveau cette page.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        BNP Coorporation Sarl (BNPC) — BP 4219, Yaoundé, Cameroun.
        <br />
        E-mail :{' '}
        <a href="mailto:contact@bnp-coorporation.com">
          contact@bnp-coorporation.com
        </a>
        <br />
        Téléphone : <a href="tel:+237655010919">(+237) 6 55 01 09 19</a>
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
        <p>
          The controller of data collected on this website is{' '}
          <strong>BNP Coorporation Sarl (BNPC)</strong>, a limited liability
          company with capital of 1,000,000 FCFA, registered at P.O. Box 4219,
          Yaoundé, Cameroon (RCCM RC/YAO/2023/C/323, NIU M042318209289U).
        </p>
        <p>
          For any question about your personal data:{' '}
          <a href="mailto:contact@bnp-coorporation.com">
            contact@bnp-coorporation.com
          </a>{' '}
          — <a href="tel:+237655010919">(+237) 6 55 01 09 19</a>.
        </p>
      </>
    ),
  },
  {
    id: 'donnees',
    title: 'Data collected',
    body: (
      <>
        <p>We only collect the data needed for the purposes described below.</p>
        <h3>Data submitted through the contact form</h3>
        <ul>
          <li>First and last name</li>
          <li>Email address</li>
          <li>Phone number, when provided</li>
          <li>Service of interest and message content</li>
          <li>Confirmation of your consent to processing</li>
        </ul>
        <h3>Technical data</h3>
        <ul>
          <li>
            IP address and request timestamps, used to limit abusive submissions
            and secure the form
          </li>
          <li>Technical logs required for diagnostics and website security</li>
        </ul>
        <p>
          The website does not offer user accounts or online payments. We never
          ask for sensitive data (health, political or religious views, biometric
          data, etc.).
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
            <td>Consent given via the dedicated checkbox; pre-contractual steps</td>
          </tr>
          <tr>
            <td>Limiting spam, preventing abuse and securing the website</td>
            <td>Legitimate interest in protecting the website and its users</td>
          </tr>
          <tr>
            <td>Meeting our legal and accounting obligations</td>
            <td>Legal obligation</td>
          </tr>
          <tr>
            <td>Enabling any analytics or marketing cookies</td>
            <td>Your consent, which you may change at any time</td>
          </tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'destinataires',
    title: 'Recipients and service providers',
    body: (
      <>
        <p>
          Data is accessible to BNPC staff who need it to handle your request. It
          may be processed by the following technical providers, strictly as
          needed for the service:
        </p>
        <ul>
          <li>
            <strong>Resend</strong> — delivering emails sent from the contact
            form, when this service is configured
          </li>
          <li>
            <strong>Upstash</strong> — request rate limiting and spam protection,
            when this service is configured
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> — bot verification of the form,
            when this service is enabled
          </li>
          <li>
            <strong>WordPress / website hosting</strong> — publishing editorial
            content (services, projects, news)
          </li>
        </ul>
        <p>
          We do not sell or rent your personal data. It is disclosed to third
          parties only where required by law or with your consent.
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
          <strong>Proof of your cookie choice:</strong> 6 months, after which you
          are asked for consent again
        </li>
        <li>
          <strong>Technical logs and rate limiting:</strong> only as long as
          needed for security, and no more than 12 months
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
            <tr>
              <td>Analytics</td>
              <td>Optional</td>
              <td>Anonymous traffic statistics</td>
              <td>No active tool</td>
            </tr>
            <tr>
              <td>Marketing</td>
              <td>Optional</td>
              <td>Campaign personalisation and measurement</td>
              <td>No active tool</td>
            </tr>
          </tbody>
        </table>
        <p>
          Necessary cookies cannot be disabled because the website cannot work
          properly without them. Optional categories remain off by default and
          will only be used after your explicit consent.
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
    id: 'transferts',
    title: 'Transfers outside Cameroon',
    body: (
      <p>
        Some technical providers may process data outside Cameroon, including in
        the European Union or the United States. Such transfers are limited to
        what is necessary to provide the service and are covered by those
        providers’ contractual commitments and security measures.
      </p>
    ),
  },
  {
    id: 'securite',
    title: 'Security',
    body: (
      <>
        <p>
          We implement reasonable measures to protect your data: encrypted
          connections (HTTPS), restricted access for authorised personnel, request
          rate limiting, bot protection and data minimisation.
        </p>
        <p>
          No system is infallible. If you believe your data has been compromised,
          contact us immediately using the details below.
        </p>
      </>
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
          <a href="mailto:contact@bnp-coorporation.com">
            contact@bnp-coorporation.com
          </a>{' '}
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
    id: 'mineurs',
    title: 'Minors',
    body: (
      <p>
        This website is intended for professionals and adults. We do not knowingly
        collect data about minors. If you believe a minor has submitted data to
        us, please contact us so that we can delete it.
      </p>
    ),
  },
  {
    id: 'modifications',
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this policy to reflect changes to the website or applicable
        regulations. The date of the latest update appears at the top of the page.
        If significant changes are made, we invite you to review this page again.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        BNP Coorporation Sarl (BNPC) — P.O. Box 4219, Yaoundé, Cameroon.
        <br />
        Email:{' '}
        <a href="mailto:contact@bnp-coorporation.com">
          contact@bnp-coorporation.com
        </a>
        <br />
        Phone: <a href="tel:+237655010919">(+237) 6 55 01 09 19</a>
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
