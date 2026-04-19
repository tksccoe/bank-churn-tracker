import type { Metadata } from 'next';
import { Gift } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Offer from '@/lib/models/Offer';
import OfferCard from '@/components/OfferCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Current Bank Offers | Bank Churn Tracker',
  description:
    'Browse the latest bank account bonus offers. Find checking, savings, and brokerage promotions with sign-up bonuses.',
};

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...obj,
    id: obj._id?.toString(),
    _id: undefined,
    __v: undefined,
  };
}

export default async function OffersPage() {
  await connectDB();
  const docs = await Offer.find({ active: true }).sort({
    featured: -1,
    bonusAmount: -1,
    createdAt: -1,
  });
  const offers = docs.map(serialize);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-slate-200 py-12">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold mb-4">
              <Gift className="w-3 h-3" />
              <span>Latest Promotions</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Current Bank Offers
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Browse the best bank account bonuses available right now. Click any
              offer to see full details and sign up.
            </p>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            {offers.length === 0 ? (
              <div className="text-center py-20">
                <Gift className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  No offers available right now
                </h2>
                <p className="text-slate-500">
                  Check back soon — we update offers regularly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer: any) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
