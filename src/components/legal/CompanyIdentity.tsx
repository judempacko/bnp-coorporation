import {
  COMPANY,
  companyAddress,
  companyCapital,
  companyForm,
} from '@/lib/company';

export function CompanyIdentity({ locale }: { locale: string }) {
  const fr = locale !== 'en';

  return (
    <ul>
      <li>
        <strong>
          {COMPANY.legalName} ({COMPANY.shortName})
        </strong>
      </li>
      <li>{companyForm(locale)}</li>
      <li>
        {fr ? 'Capital social' : 'Share capital'} : {companyCapital(locale)}
      </li>
      <li>
        {fr ? 'Siège' : 'Registered office'} : {companyAddress(locale)}
      </li>
      <li>RCCM : {COMPANY.rccm}</li>
      <li>NIU : {COMPANY.niu}</li>
      <li>
        {fr ? 'Téléphone' : 'Phone'} :{' '}
        <a href={`tel:${COMPANY.phoneHref}`}>{COMPANY.phone}</a>
      </li>
      <li>
        {fr ? 'E-mail' : 'Email'} :{' '}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
      </li>
    </ul>
  );
}
