# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

BNP Coorporation Sarl s'adresse aux trois audiences sans priorité unique :
grands groupes B2B (industries, ports, ERP), PME camerounaises (BTP, forages,
solaire, audits) et particuliers B2C (forages, solaire domestique, dépannages).
Leur besoin commun : un interlocuteur technique unique, un diagnostic sur site
et un devis fiable sous 24-48h ouvrées.

## Product Purpose

Site vitrine qui convertit en demandes de devis. Le succès se mesure à égalité
par les soumissions du formulaire /contact et par les appels / WhatsApp directs.
Le parcours canonique : premier contact → visite technique systématique →
devis validé sous 24-48h ouvrées → réalisation + suivi.

## Positioning

Ingénierie multiservices à 7 pôles complémentaires (incendie, BTP, forage,
solaire, drones, naval, nettoyage industriel) avec visite technique
systématique avant tout chiffrage et direction resserrée qui décide vite.
Mobilisable sur le terrain à Yaoundé, Douala et dans le reste du Cameroun.

## Operating Context

Siège BP 4219 Yaoundé, base à Douala, intervention dans tout le Cameroun.
Contacts : (+237) 6 55 01 09 19, (+237) 6 58 05 14 78, contact@bnp-coorporation.com.
Horaires : lun-ven 8h-16h, sam 8h-12h. Site bilingue FR/EN à parité via next-intl,
contenus (services, projets, articles, partenaires) issus de WordPress GraphQL
avec fallbacks statiques.

## Capabilities and Constraints

Next.js 16 (App Router) + next-intl + Tailwind v4, tokens dans `@theme`
(`brand`, `brand-hover`, `ink`, `muted`, `coal`, `surface`, `banner`, `navy`).
Formulaire via `POST /api/contact` : validation, honeypot, rate-limit 5/h/IP,
envoi Resend uniquement si `RESEND_API_KEY` configurée — jamais de faux succès.
Tarification et délais (24-48h) confirmés ; faits indécis : aucun en suspens.

## Brand Commitments

Nom exact « BNP Coorporation Sarl (BNPC) », orthographe « coorporation » avec
deux o — aucune affiliation avec BNP Paribas. Bleu marque #0A66C2, police
Mukta (400-700), voix directe et factuelle en FR comme en EN.

## Evidence on Hand

Études de cas projets (`src/lib/projects.ts`), flux partenaires
(`src/lib/partners.ts`, section masquée si vide), galerie documentée,
FAQ crawlables en `<details>` natifs sur /contact. Absences à ne pas
fabriquer : témoignages clients textuels, chiffres de satisfaction.

## Product Principles

1. La visite technique précède tout chiffrage — jamais de prix sans diagnostic.
2. Un seul chemin de conversion par page, le CTA final mène à /contact.
3. La preuve terrain (projets, galerie) prime sur la promesse.
4. Chaque contenu FR existe en EN à parité, sans exception.
5. Pas de section sans contenu réel : vide = masqué, pas d'espace réservé.

## Accessibility & Inclusion

Standard WCAG AA strict visé : contrastes ≥ 4,5:1, cibles tactiles ≥ 44px,
navigation clavier complète, `prefers-reduced-motion` respecté.
