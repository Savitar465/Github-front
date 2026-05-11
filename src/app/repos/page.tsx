import { buildPageTitle } from '@/lib/build-page-title';
import { ReposClient } from './_components/repos-client';

export const metadata = {
  title: buildPageTitle('Repositorios'),
  description: 'Lista de repositorios disponibles',
};

export default function ReposPage() {
  return <ReposClient />;
}
