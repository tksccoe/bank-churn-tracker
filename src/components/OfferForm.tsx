'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { X, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type { Offer } from '@/types';

interface Props {
  initialData: Offer | null;
  onClose: () => void;
  onSaved: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function OfferForm({ initialData, onClose, onSaved }: Props) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    institutionName: initialData?.institutionName || '',
    accountType: initialData?.accountType || '',
    bonusAmount: initialData?.bonusAmount ?? '',
    requirements: initialData?.requirements || '',
    description: initialData?.description || '',
    referralUrl: initialData?.referralUrl || '',
    expirationDate: initialData?.expirationDate || '',
    imageUrl: initialData?.imageUrl || '',
    featured: initialData?.featured ?? false,
    active: initialData?.active ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    const updates: any = { title: value };
    // Auto-generate slug from title only when creating
    if (!initialData) {
      updates.slug = slugify(value);
    }
    setFormData({ ...formData, ...updates });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        bonusAmount:
          formData.bonusAmount === '' ? 0 : Number(formData.bonusAmount),
      };

      let res: Response;
      if (initialData) {
        res = await fetch(`/api/offers/${initialData.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const field =
    'w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? 'Edit Offer' : 'Add New Offer'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fields marked with * are required
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto flex-1 space-y-6"
        >
          {/* Basic Info */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Basic Info
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={field}
                  placeholder="e.g. Chase Total Checking – $300 Bonus"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Slug *
                </label>
                <input
                  required
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className={field}
                  placeholder="chase-total-checking-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Institution Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      institutionName: e.target.value,
                    })
                  }
                  className={field}
                  placeholder="e.g. Chase"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Account Type *
                </label>
                <input
                  required
                  type="text"
                  value={formData.accountType}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value })
                  }
                  className={field}
                  placeholder="e.g. Checking, Savings"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Bonus Amount ($) *
                </label>
                <input
                  required
                  type="number"
                  value={formData.bonusAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, bonusAmount: e.target.value })
                  }
                  className={field}
                  placeholder="e.g. 300"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Offer Details
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Requirements *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  className={`${field} resize-none`}
                  placeholder="e.g. Set up direct deposit of $500+ within 90 days"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Description (Markdown) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`${field} resize-none font-mono text-sm`}
                  placeholder="## How to Earn&#10;1. Open a new account&#10;2. Set up direct deposit&#10;&#10;## Fine Print&#10;- New customers only"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Referral URL *
                </label>
                <input
                  required
                  type="url"
                  value={formData.referralUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, referralUrl: e.target.value })
                  }
                  className={field}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expirationDate: e.target.value,
                    })
                  }
                  className={field}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className={field}
                  placeholder="https://example.com/bank-logo.png"
                />
                {formData.imageUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <Image
                      src={formData.imageUrl}
                      alt="Offer image preview"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>
                )}
                {!formData.imageUrl && (
                  <div className="mt-2 w-full h-20 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center gap-2 text-slate-400 text-xs">
                    <ImageIcon className="w-4 h-4" />
                    Preview will appear here
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Visibility
            </p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Active
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Featured
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">
              {error}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200"
            >
              {isSubmitting ? 'Saving...' : 'Save Offer'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
