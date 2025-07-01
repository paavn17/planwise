'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { name });
      }

      toast.success('Profile updated');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update name');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 rounded-xl bg-white text-gray-900 shadow-md border border-gray-200">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">My Profile</h1>

        {/* Name Field */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              disabled={!editMode}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-gray-800 ${
                editMode ? 'border-gray-400 bg-gray-100' : 'border-transparent bg-gray-100'
              } focus:outline-none`}
            />
          </div>

          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="mt-6 px-3 py-1 bg-orange-500 hover:bg-orange-700 text-white text-sm rounded-md transition"
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Email Display (Read-only) */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2 rounded-lg border text-gray-800 bg-gray-100 border-transparent focus:outline-none"
          />
        </div>

        {/* Save Button */}
        {editMode && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full mb-3 py-2 rounded-lg font-medium transition ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full border border-orange-500 hover:border-orange-700 text-red-500 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
