import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { canonicalFor, languageAlternates } from '@/lib/seo';

const PATH = '/conditions-generales-utilisation';
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
  const title = fr ? "Conditions générales d'utilisation" : 'Terms of Service';
  const description = fr
    ? "Conditions générales d'utilisation du site BNP Coorporation Sarl (BNPC) : accès, services, demandes de devis, propriété intellectuelle et droit applicable."
    : 'Terms of Service for the BNP Coorporation Sarl (BNPC) website: access, services, quote requests, intellectual property and applicable law.';
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
    id: 'objet',
    title: 'Objet',
    body: (
      <p>
        Les présentes conditions encadrent l’accès et l’utilisation du site{' '}
        <strong>bnp-coorporation.com</strong>, édité par BNP Coorporation Sarl
        (BNPC). En consultant ce site, vous acceptez ces conditions. Si vous ne
        les acceptez pas, vous êtes invité à cesser de l’utiliser.
      </p>
    ),
  },
  {
    id: 'editeur',
    title: 'Éditeur du site',
    body: (
      <ul>
        <li><strong>BNP Coorporation Sarl (BNPC)</strong></li>
        <li>Société à responsabilité limitée au capital de 1 000 000 FCFA</li>
        <li>Siège : BP 4219, Yaoundé, Cameroun</li>
        <li>RCCM : RC/YAO/2023/C/323</li>
        <li>NIU : M042318209289U</li>
        <li>
          Téléphone : <a href="tel:+237655010919">(+237) 6 55 01 09 19</a>
        </li>
        <li>
          E-mail :{' '}
          <a href="mailto:contact@bnp-coorporation.com">
            contact@bnp-coorporation.com
          </a>
        </li>
      </ul>
    ),
  },
  {
    id: 'acces',
    title: 'Accès et disponibilité',
    body: (
      <>
        <p>
          Le site est accessible gratuitement, hors frais de connexion et de
          matériel supportés par l’utilisateur. BNPC peut modifier, suspendre ou
          interrompre tout ou partie du site, notamment pour maintenance, sans
          obligation d’information préalable.
        </p>
        <p>
          Nous faisons nos efforts pour maintenir le site disponible, sans
          garantir une accessibilité continue ni l’absence d’erreurs.
        </p>
      </>
    ),
  },
  {
    id: 'services-devis',
    title: 'Services et demandes de devis',
    body: (
      <>
        <p>
          Le site présente les activités et services de BNPC. Les informations
          publiées, y compris les descriptions de prestations et les délais
          indicatifs, ne constituent pas une offre contractuelle.
        </p>
        <p>
          Toute prestation fait l’objet d’un devis écrit, précédé lorsque la
          nature ou l’ampleur du projet l’exige d’une visite technique sur site.
          Le délai indicatif de 24 à 48 heures ouvrées n’est pas garanti. Seul un
          devis accepté et signé engage les parties.
        </p>
      </>
    ),
  },
  {
    id: 'propriete-intellectuelle',
    title: 'Propriété intellectuelle',
    body: (
      <>
        <p>
          Les textes, photographies, vidéos, logos, marques, éléments graphiques
          et la structure du site sont protégés par le droit de la propriété
          intellectuelle et appartiennent à BNPC ou à leurs titulaires
          respectifs.
        </p>
        <p>
          Toute reproduction, représentation, adaptation ou diffusion, totale ou
          partielle, sans autorisation écrite préalable est interdite. Les liens
          vers les pages du site sont autorisés lorsqu’ils restent honnêtes et
          n’induisent pas en erreur sur l’origine du contenu.
        </p>
      </>
    ),
  },
  {
    id: 'responsabilite',
    title: 'Responsabilité et liens externes',
    body: (
      <>
        <p>
          Les informations du site sont fournies à titre indicatif et peuvent
          évoluer. Malgré le soin apporté à leur rédaction, BNPC ne garantit pas
          leur exhaustivité ni leur exactitude permanente.
        </p>
        <p>
          BNPC ne saurait être tenue responsable des dommages indirects résultant
          de l’utilisation ou de l’impossibilité d’utiliser le site, ni du contenu
          des sites tiers vers lesquels le site renvoie. Cette limitation ne
          s’applique pas aux responsabilités qui ne peuvent être exclues en vertu
          du droit applicable.
        </p>
        <p>
          L’utilisateur demeure responsable de l’exactitude des informations
          qu’il transmet via le formulaire de contact.
        </p>
      </>
    ),
  },
  {
    id: 'donnees-personnelles',
    title: 'Données personnelles',
    body: (
      <p>
        Le traitement des données personnelles et l’usage des cookies sont décrits
        dans notre{' '}
        <Link href="/fr/politique-de-confidentialite">
          politique de confidentialité
        </Link>
        . Vous pouvez modifier votre choix de consentement à tout moment depuis le
        lien « Gérer les cookies » en bas de page.
      </p>
    ),
  },
  {
    id: 'droit-applicable',
    title: 'Droit applicable et litiges',
    body: (
      <>
        <p>
          Les présentes conditions sont régies par le droit camerounais. En cas de
          différend, les parties s’efforcent d’abord de trouver une solution
          amiable.
        </p>
        <p>
          À défaut d’accord, les juridictions compétentes de Yaoundé sont saisies,
          sous réserve des règles impératives applicables au consommateur ou au
          cocontractant.
        </p>
      </>
    ),
  },
  {
    id: 'modifications',
    title: 'Modifications',
    body: (
      <p>
        BNPC peut mettre à jour ces conditions à tout moment. La date de dernière
        mise à jour figure en haut de la page. La poursuite de l’utilisation du
        site après modification vaut acceptation des nouvelles conditions.
      </p>
    ),
  },
];

const sectionsEn: LegalSection[] = [
  {
    id: 'objet',
    title: 'Purpose',
    body: (
      <p>
        These terms govern access to and use of the website{' '}
        <strong>bnp-coorporation.com</strong>, published by BNP Coorporation Sarl
        (BNPC). By browsing this website, you accept these terms. If you do not
        accept them, you should stop using the website.
      </p>
    ),
  },
  {
    id: 'editeur',
    title: 'Website publisher',
    body: (
      <ul>
        <li><strong>BNP Coorporation Sarl (BNPC)</strong></li>
        <li>Limited liability company with capital of 1,000,000 FCFA</li>
        <li>Registered office: P.O. Box 4219, Yaoundé, Cameroon</li>
        <li>Trade register (RCCM): RC/YAO/2023/C/323</li>
        <li>Tax ID (NIU): M042318209289U</li>
        <li>
          Phone: <a href="tel:+237655010919">(+237) 6 55 01 09 19</a>
        </li>
        <li>
          Email:{' '}
          <a href="mailto:contact@bnp-coorporation.com">
            contact@bnp-coorporation.com
          </a>
        </li>
      </ul>
    ),
  },
  {
    id: 'acces',
    title: 'Access and availability',
    body: (
      <>
        <p>
          The website is free to access, excluding connection and equipment costs
          borne by the user. BNPC may change, suspend or discontinue all or part
          of the website, in particular for maintenance, without prior notice.
        </p>
        <p>
          We make reasonable efforts to keep the website available, without
          guaranteeing continuous access or the absence of errors.
        </p>
      </>
    ),
  },
  {
    id: 'services-devis',
    title: 'Services and quote requests',
    body: (
      <>
        <p>
          The website presents BNPC’s activities and services. Published
          information, including service descriptions and indicative lead times,
          does not constitute a contractual offer.
        </p>
        <p>
          Every engagement is subject to a written quote, preceded by a site visit
          where the nature or scale of the project requires one. The indicative
          24 to 48 business-hour timeframe is not guaranteed. Only an accepted
          and signed quote binds the parties.
        </p>
      </>
    ),
  },
  {
    id: 'propriete-intellectuelle',
    title: 'Intellectual property',
    body: (
      <>
        <p>
          Text, photographs, videos, logos, trademarks, graphic elements and the
          structure of the website are protected by intellectual property law and
          belong to BNPC or their respective owners.
        </p>
        <p>
          Any reproduction, representation, adaptation or distribution, in whole
          or in part, without prior written permission is prohibited. Links to
          pages of the website are permitted provided they are honest and do not
          mislead about the origin of the content.
        </p>
      </>
    ),
  },
  {
    id: 'responsabilite',
    title: 'Liability and external links',
    body: (
      <>
        <p>
          Information on the website is provided for guidance only and may change.
          Despite the care taken in preparing it, BNPC does not guarantee that it
          is complete or permanently accurate.
        </p>
        <p>
          BNPC shall not be liable for indirect loss resulting from the use of, or
          inability to use, the website, or for the content of third-party sites
          linked from it. This limitation does not apply to liability that cannot
          be excluded under applicable law.
        </p>
        <p>
          Users remain responsible for the accuracy of the information they submit
          through the contact form.
        </p>
      </>
    ),
  },
  {
    id: 'donnees-personnelles',
    title: 'Personal data',
    body: (
      <p>
        How personal data is processed and how cookies are used is described in
        our{' '}
        <Link href="/en/politique-de-confidentialite">privacy policy</Link>. You can
        change your consent choice at any time using the “Manage cookies” link at
        the bottom of the page.
      </p>
    ),
  },
  {
    id: 'droit-applicable',
    title: 'Governing law and disputes',
    body: (
      <>
        <p>
          These terms are governed by Cameroonian law. In the event of a dispute,
          the parties will first try to reach an amicable solution.
        </p>
        <p>
          Failing agreement, the competent courts of Yaoundé shall have
          jurisdiction, subject to mandatory rules applicable to consumers or
          contracting parties.
        </p>
      </>
    ),
  },
  {
    id: 'modifications',
    title: 'Changes',
    body: (
      <p>
        BNPC may update these terms at any time. The date of the latest update
        appears at the top of the page. Continued use of the website after a
        change constitutes acceptance of the new terms.
      </p>
    ),
  },
];

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  return (
    <LegalDocument
      title={fr ? "Conditions générales d'utilisation" : 'Terms of Service'}
      subtitle={
        fr
          ? 'Les règles d’accès et d’utilisation du site bnp-coorporation.com.'
          : 'The rules for accessing and using the bnp-coorporation.com website.'
      }
      image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=70"
      tocLabel={fr ? 'Sommaire' : 'Contents'}
      lastUpdatedLabel={fr ? 'Dernière mise à jour' : 'Last updated'}
      lastUpdated={fr ? LAST_UPDATED_FR : LAST_UPDATED_EN}
      lastUpdatedDate={LAST_UPDATED_DATE}
      intro={
        <p>
          {fr
            ? "Ces conditions s’appliquent à toute personne qui consulte le site de BNP Coorporation Sarl (BNPC). Elles précisent le cadre juridique de la consultation, des demandes de devis et de l’utilisation des contenus publiés."
            : 'These terms apply to anyone visiting the BNP Coorporation Sarl (BNPC) website. They set out the legal framework for browsing, quote requests and use of published content.'}
        </p>
      }
      sections={fr ? sectionsFr : sectionsEn}
    />
  );
}
