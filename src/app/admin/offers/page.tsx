'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import type { Offer } from '@/types';
import OfferForm from '@/components/OfferForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminOffersPage() {
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const isAdmin = session?.user?.isAdmin === true;

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch('/api/offers');
      if (res.ok) setOffers(await res.json());
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchOffers();
  }, [status, fetchOffers]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await fetch(`/api/offers/${slug}`, { method: 'DELETE' });
      fetchOffers();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      await fetch(`/api/offers/${offer.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !offer.active }),
      });
      fetchOffers();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Access Denied
            </h1>
            <p className="text-slate-500">
              You don&apos;t have permission to access this page.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Manage Offers
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {offers.length} offer{offers.length !== 1 && 's'}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingOffer(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200"
            >
              <Plus className="w-4 h-4" />
              Add Offer
            </button>
          </div>

          {offers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                No offers yet
              </h2>
              <p className="text-slate-500 mb-6">
                Create your first bank offer to get started.
              </p>
              <button
                onClick={() => {
                  setEditingOffer(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Offer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl border shadow-sm p-5 flex items-center gap-4 ${
                    offer.active
                      ? 'border-slate-200'
                      : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate">
                        {offer.title}
                      </h3>
                      {offer.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                      )}
                      {!offer.active && (
                        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {offer.institutionName} · {offer.accountType} · $
                      {offer.bonusAmount} bonus
                      {offer.expirationDate &&
                        ` · Expires ${offer.expirationDate}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleActive(offer)}
                      title={offer.active ? 'Deactivate' : 'Activate'}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {offer.active ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingOffer(offer);
                        setIsFormOpen(true);
                      }}
                      title="Edit"
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.slug)}
                      title="Delete"
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isFormOpen && (
          <OfferForm
            initialData={editingOffer}
            onClose={() => {
              setIsFormOpen(false);
              setEditingOffer(null);
            }}
            onSaved={fetchOffers}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
