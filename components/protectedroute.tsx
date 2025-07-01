'use client';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // loading state
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login'); // Redirect if not authenticated
      } else {
        setUser(currentUser); // Set user if authenticated
      }
      setLoading(false); // Loading finished
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    // You can show a spinner here instead
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    // Optional: Can return null since router.push will already handle the redirect
    return null;
  }

  return <>{children}</>;
}
