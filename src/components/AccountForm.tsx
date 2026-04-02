'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import type { Account, AccountStatus } from '@/types';

interface Props {
  initialData: Account | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AccountForm({ initialData, onClose, onSaved }: Props) {
  const [formData, setFormData] = useState({
    institutionName: initialData?.institutionName || '',
    accountType: initialData?.accountType || '',
    apy: initialData?.apy ?? '',
    appliedDate: initialData?.appliedDate || '',
    approvedDate: initialData?.approvedDate || '',
    closedDate: initialData?.closedDate || '',
    bonusAmount: initialData?.bonusAmount ?? '',
    bonusRequirements: initialData?.bonusRequirements || '',
    bonusAmountReceived: initialData?.bonusAmountReceived ?? '',
    feeFreeRequirement: initialData?.feeFreeRequirement || '',
    status: (initialData?.status || 'Pending') as AccountStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData) {
        await fetch(`/api/accounts/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            apy: formData.apy === '' ? undefined : Number(formData.apy),
            bonusAmount: formData.bonusAmount === '' ? undefined : Number(formData.bonusAmount),
            bonusAmountReceived: formData.bonusAmountReceived === '' ? undefined : Number(formData.bonusAmountReceived),
          }),
        });
      } else {
        await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            apy: formData.apy === '' ? undefined : Number(formData.apy),
            bonusAmount: formData.bonusAmount === '' ? undefined : Number(formData.bonusAmount),
            bonusAmountReceived: formData.bonusAmountReceived === '' ? undefined : Number(formData.bonusAmountReceived),
          }),
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Save error:', err);
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
              {initialData ? 'Edit Account' : 'Add New Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">All fields except Institution Name are optional</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Basic info */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Basic Info</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Institution Name *</label>
                <input
                  required
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) =>
                    setFormData({ ...formData, institutionName: e.target.value })
                  }
                  className={field}
                  placeholder="e.g. Chase, Wells Fargo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Account Type</label>
                <input
                  type="text"
                  value={formData.accountType}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value })
                  }
                  className={field}
                  placeholder="e.g. Total Checking"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bonus Amount ($)</label>
                  <input
                    type="number"
                    value={formData.bonusAmount}
                  onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
                  className={field}
                  placeholder="e.g. 300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bonus Received ($)</label>
                <input
                  type="number"
                  value={formData.bonusAmountReceived}
                  onChange={(e) => setFormData({ ...formData, bonusAmountReceived: e.target.value })}
                  className={field}
                  placeholder="e.g. 300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">APY (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.apy}
                  onChange={(e) => setFormData({ ...formData, apy: e.target.value })}
                  className={field}
                  placeholder="e.g. 4.50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as AccountStatus,
                    })
                  }
                  className={field}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dates</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Applied Date</label>
                <input
                  type="date"
                  value={formData.appliedDate}
                  onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                  className={field}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Approved Date</label>
                <input
                  type="date"
                  value={formData.approvedDate}
                  onChange={(e) => setFormData({ ...formData, approvedDate: e.target.value })}
                  className={field}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Closed Date</label>
                <input
                  type="date"
                  value={formData.closedDate}
                  onChange={(e) => setFormData({ ...formData, closedDate: e.target.value })}
                  className={field}
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Requirements</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bonus Requirements</label>
              <textarea
                rows={3}
                value={formData.bonusRequirements}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bonusRequirements: e.target.value,
                  })
                }
                className={`${field} resize-none`}
                placeholder="e.g. $500 direct deposit within 90 days"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Fee-Free Requirement</label>
              <textarea
                rows={2}
                value={formData.feeFreeRequirement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    feeFreeRequirement: e.target.value,
                  })
                }
                className={`${field} resize-none`}
                placeholder="e.g. Maintain $1500 daily balance"
              />
            </div>
          </div>
          </div>

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
              {isSubmitting ? 'Saving...' : 'Save Account'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
