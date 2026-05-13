import { buildPageTitle } from '@/lib/build-page-title';
import { MyReposClient } from './_components/my-repos-client';

export const metadata = {
  title: buildPageTitle('Mis Repositorios'),
  description: 'Tus repositorios personales',
};

export default function MyReposPage() {
  return <MyReposClient />;
}
