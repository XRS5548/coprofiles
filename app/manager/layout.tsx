// app/manager/layout.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { ManagerLayout } from '@/components/layouts/ManagerLayout';

export const metadata: Metadata = {
  title: 'Manager Dashboard | Coprofiles',
  description: 'Manage internships, applications, and company settings',
};

export default async function ManagerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      roleType: string;
    };

    // Check if user is manager
    if (decoded.roleType !== 'manager') {
      redirect('/dashboard');
    }

    return <ManagerLayout>{children}</ManagerLayout>;
  } catch (error) {
    redirect('/login');
  }
}