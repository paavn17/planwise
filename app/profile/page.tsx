import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {

  const router = useRouter();
    const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error("Failed to log out");
    }
  };


  return (
    <>
      {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
          >
            Logout
          </button>
    </>
  )
}

export default ProfilePage