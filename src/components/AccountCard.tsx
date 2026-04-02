'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { format, parseISO, isAfter, addMonths, startOfMonth } from 'date-fns';
import {
  Banknote,
  CheckCircle2,
  Edit2,
  Trash2,
  ChevronDown,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Account } from '@/types';

interface Props {
  account: Account;
  onEdit: () => void;
  onDelete: () => void;
  onToggleMonth: (month: string, value: boolean) => void;
  getEffectiveStatus: (acc: Account) => string;
}

const STATUS_CONFIG: Record<string, { badge: string; border: string }> = {
  Pending:  { badge: 'bg-amber-100 text-amber-700',     border: 'border-l-amber-400' },
  Active:   { badge: 'bg-blue-100 text-blue-700',       border: 'border-l-blue-500' },
  Completed:{ badge: 'bg-emerald-100 text-emerald-700', border: 'border-l-emerald-500' },
  Closed:   { badge: 'bg-slate-100 text-slate-500',     border: 'border-l-slate-300' },
  Declined: { badge: 'bg-red-100 text-red-600',         border: 'border-l-red-400' },
};

function BonusProgress({ received, target }: { received: number; target: number }) {
  if (!target) return null;
  const pct = Math.min(100, Math.round((received / target) * 100));
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>Bonus progress</span>
        <span className="font-semibold text-slate-700">{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            pct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AccountCard({
  account,
  onEdit,
  onDelete,
  onToggleMonth,
  getEffectiveStatus,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const effectiveStatus = getEffectiveStatus(account);
  const cfg = STATUS_CONFIG[effectiveStatus] ?? STATUS_CONFIG.Pending;
  const isInactive = account.status === 'Closed' || account.status === 'Declined';

  const months = Array.from({ length: 4 }).map((_, i) => {
    const d = startOfMonth(addMonths(new Date(), -i));
    return format(d, 'yyyy-MM');
  }).reverse();

  const safeToClose =
    account.status === 'Completed' &&
    account.approvedDate &&
    isAfter(new Date(), addMonths(parseISO(account.approvedDate), 6));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={cn(
        'rounded-2xl border-l-4 border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        cfg.border,
        isInactive && 'opacity-60'
      )}
    >
      {/* Main row */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 text-slate-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {account.institutionName}
                </h3>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', cfg.badge)}>
                  {effectiveStatus}
                </span>
                {safeToClose && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Safe to close
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {[account.accountType, account.apy ? `${account.apy}% APY` : null]
                  .filter(Boolean)
                  .join(' · ') || 'Bank Account'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Target</p>
                <p className="text-sm font-bold text-slate-800">${(account.bonusAmount || 0).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Received</p>
                <p className="text-sm font-bold text-emerald-600">${(account.bonusAmountReceived || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setExpanded(!expanded)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title={expanded ? 'Collapse' : 'Expand'}>
                <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', expanded && 'rotate-180')} />
              </button>
            </div>
          </div>
        </div>

        <BonusProgress received={account.bonusAmountReceived || 0} target={account.bonusAmount || 0} />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Applied', value: account.appliedDate },
              { label: 'Approved', value: account.approvedDate },
              { label: 'Closed', value: account.closedDate },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">{item.label}</p>
                <p className="text-sm font-medium text-slate-700">
                  {item.value ? format(parseISO(item.value), 'MMM d, yyyy') : '—'}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bonus Requirements</p>
              <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 leading-relaxed min-h-[56px]">
                {account.bonusRequirements || <span className="text-slate-400 italic">None listed</span>}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Fee-Free Tracker</p>
              <div className="grid grid-cols-4 gap-2">
                {months.map((month) => {
                  const checked = !!account.monthlyFeeFreeMet?.[month];
                  return (
                    <button
                      key={month}
                      onClick={() => onToggleMonth(month, !checked)}
                      className={cn(
                        'flex flex-col items-center p-2 rounded-xl border text-center transition-all',
                        checked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                      )}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-tight leading-none mb-1">
                        {format(parseISO(`${month}-01`), 'MMM')}
                      </p>
                      <p className="text-[9px] text-slate-400 leading-none mb-1.5">
                        {format(parseISO(`${month}-01`), 'yyyy')}
                      </p>
                      <div className={cn(
                        'w-4 h-4 rounded-full border flex items-center justify-center transition-all',
                        checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                      )}>
                        {checked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {account.feeFreeRequirement && (
                <p className="mt-2 text-xs text-slate-400 italic">{account.feeFreeRequirement}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
