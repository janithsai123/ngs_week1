import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoseCornerOrnament } from './FloralMotifs';

interface ProtectedEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSuccess: () => void;
}

export const ProtectedEditModal: React.FC<ProtectedEditModalProps> = ({
  isOpen,
  onClose,
  title = 'Passkey Authentication Required',
  description = 'Editing task rules, recurring settings, or deleting core tasks requires security authorization.',
  onSuccess,
}) => {
  const { verifyUserPasskey } = useApp();
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey) {
      setError('Please enter your passkey.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await verifyUserPasskey(passkey);
      if (isValid) {
        setPasskey('');
        onSuccess();
        onClose();
      } else {
        setError('Incorrect passkey. Access denied.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-7 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden text-center">
        <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2" />
        <RoseCornerOrnament position="bottom-left" className="absolute -bottom-2 -left-2" />

        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
          <Lock className="w-7 h-7" />
        </div>

        <div className="inline-block px-3 py-1 mb-2 text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 rounded-full border border-rose-200">
          Security Verification (janith_edit)
        </div>

        <h3 className="text-xl font-serif-title font-bold text-gray-900 mb-2">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed">
          {description}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-rose-500" />
              Enter Passkey
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={passkey}
              onChange={e => {
                setPasskey(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white tracking-widest"
              autoFocus
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Hint: Default passkey is <code className="text-rose-600 bg-rose-50 px-1 rounded">janith2026</code> (configurable in Settings).
            </p>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Unlock & Proceed'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPasskey('');
                setError('');
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
