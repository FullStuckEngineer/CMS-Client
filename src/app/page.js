import { redirect } from 'next/navigation';
import { getSession } from 'next-auth/react';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }
}
