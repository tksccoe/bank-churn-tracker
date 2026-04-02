'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Banknote, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import type { Account } from '@/types';
import AccountCard from '@/components/AccountCard';
import AccountForm from '@/components/AccountForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-600 font-medium">Loading your bonuses...</p>
    </motion.div>
  </div>
);

export function getEffectiveStatus(account: Account): string {
  if (account.status === 'Pending' && account.approvedDate) return 'Active';
  return account.status;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [hideInactive, setHideInactive] = useState(false);

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) setAccounts(await res.json());
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchAccounts();
    if (status === 'unauthenticated') setAccounts([]);
  }, [status, fetchAccounts]);

  if (status === 'loading') return <LoadingScreen />;
  if (status === 'unauthenticated') return <LoadingScreen />;

  const totalBonusReceived = accounts.reduce(
    (sum, acc) => sum + (acc.bonusAmountReceived || 0),
    0
  );
  const pendingBonus = accounts.reduce(
    (sum, acc) =>
      sum + (acc.status === 'Pending' ? acc.bonusAmount || 0 : 0),
    0
  );
  const filteredAccounts = hideInactive
    ? accounts.filter((a) => !['Closed', 'Declined'].includes(a.status))
    : accounts;

  const addAccountButton = (
    <button
      onClick={() => setIsFormOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Add Account</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Header actions={addAccountButton} />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
              bg: 'bg-emerald-50',
              accent: 'border-t-2 border-emerald-400',
              label: 'Total Received',
              value: `$${totalBonusReceived.toLocaleString()}`,
              delay: 0,
            },
            {
              icon: <Clock className="w-5 h-5 text-blue-600" />,
              bg: 'bg-blue-50',
              accent: 'border-t-2 border-blue-400',
              label: 'Pending Potential',
              value: `$${pendingBonus.toLocaleString()}`,
              delay: 0.1,
            },
            {
              icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
              bg: 'bg-purple-50',
              accent: 'border-t-2 border-purple-400',
              label: 'Active Accounts',
              value: accounts
                .filter((a) =>
                  ['Pending', 'Active', 'Completed'].includes(
                    getEffectiveStatus(a)
                  )
                )
                .length.toString(),
              delay: 0.2,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              className={cn('bg-white p-6 rounded-2xl shadow-sm border border-slate-200', stat.accent)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('p-2 rounded-xl', stat.bg)}>{stat.icon}</div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Account List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Accounts</h2>
            <button
              onClick={() => setHideInactive(!hideInactive)}
              className={cn(
                'text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2',
                hideInactive
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              )}
            >
              {hideInactive
                ? `Showing Active Only (${filteredAccounts.length})`
                : `Showing All Accounts (${accounts.length})`}
            </button>
          </div>

          {accounts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Banknote className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                No accounts tracked yet
              </h3>
              <p className="text-slate-500 mb-6">
                Start by adding your first bank bonus offer.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Your First Account
              </button>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                No active accounts
              </h3>
              <p className="text-slate-500 mb-6">
                All your accounts are currently Closed or Declined.
              </p>
              <button
                onClick={() => setHideInactive(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                Show All Accounts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    getEffectiveStatus={getEffectiveStatus}
                    onEdit={() => {
                      setEditingAccount(account);
                      setIsFormOpen(true);
                    }}
                    onDelete={async () => {
                      if (confirm(`Delete ${account.institutionName}?`)) {
                        const res = await fetch(`/api/accounts/${account.id}`, {
                          method: 'DELETE',
                        });
                        if (res.ok)
                          setAccounts((prev) =>
                            prev.filter((a) => a.id !== account.id)
                          );
                      }
                    }}
                    onToggleMonth={async (monthStr, value) => {
                      const updatedMet = {
                        ...(account.monthlyFeeFreeMet || {}),
                        [monthStr]: value,
                      };
                      const res = await fetch(`/api/accounts/${account.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ monthlyFeeFreeMet: updatedMet }),
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setAccounts((prev) =>
                          prev.map((a) => (a.id === account.id ? updated : a))
                        );
                      }
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {isFormOpen && (
          <AccountForm
            initialData={editingAccount}
            onClose={() => {
              setIsFormOpen(false);
              setEditingAccount(null);
            }}
            onSaved={fetchAccounts}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
