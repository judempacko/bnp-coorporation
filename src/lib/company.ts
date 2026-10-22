export const COMPANY = {
  legalName: 'BNP Coorporation Sarl',
  shortName: 'BNPC',
  capitalFr: '1 000 000 FCFA',
  capitalEn: 'FCFA 1,000,000',
  poBox: 'BP 4219',
  city: 'Yaoundé',
  countryCode: 'CM',
  rccm: 'RC/YAO/2023/C/323',
  niu: 'M042318209289U',
  phone: '(+237) 6 55 01 09 19',
  phoneHref: '+237655010919',
  email: 'contact@bnp-coorporation.com',
  foundedAt: '2023-02-10',
  social: {
    linkedin: 'https://www.linkedin.com/company/bnp-coorporation-sarl',
    facebook: 'https://www.facebook.com/bnpcoorporation',
  },
} as const;

export function companyForm(locale: string): string {
  return locale === 'en'
    ? 'Limited liability company'
    : 'Société à responsabilité limitée';
}

export function companyCapital(locale: string): string {
  return locale === 'en' ? COMPANY.capitalEn : COMPANY.capitalFr;
}

export function companyAddress(locale: string): string {
  return locale === 'en'
    ? `P.O. Box 4219, ${COMPANY.city}, Cameroon`
    : `${COMPANY.poBox}, ${COMPANY.city}, Cameroun`;
}

export function companyFounded(locale: string): string {
  return locale === 'en'
    ? 'February 10, 2023 in Yaoundé'
    : '10 février 2023 à Yaoundé';
}
