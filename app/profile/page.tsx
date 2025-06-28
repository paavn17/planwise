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
    await updateProfile(user, { displayName: name });
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { name });

    toast.success('Name updated successfully');
    setEditMode(false);
  } catch (err) {
    console.error(err);
    toast.error('Failed to update name');
  } finally {
    setIsSaving(false); 
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl bg-zinc-900 text-white shadow-lg relative">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      {/* Name Field + Edit Button */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            disabled={!editMode}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border ${
              editMode ? 'border-gray-500' : 'border-transparent'
            } focus:outline-none`}
          />
        </div>

        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="mt-6 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-md transition"
        >
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Email Field (Read-only) */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-transparent focus:outline-none"
        />
      </div>

      {/* Save Button */}
      {editMode && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full mb-3 py-2 rounded-lg transition ${
            isSaving
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      )}


      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
