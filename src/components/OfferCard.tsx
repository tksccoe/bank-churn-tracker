import Link from 'next/link';
import Image from 'next/image';
import { DollarSign, Calendar, ArrowRight } from 'lucide-react';
import type { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const isExpired =
    offer.expirationDate && new Date(offer.expirationDate) < new Date();

  return (
    <Link
      href={`/offers/${offer.slug}`}
      className="group block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      {offer.featured && (
        <div className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 text-center tracking-wide uppercase">
          Featured Offer
        </div>
      )}

      {offer.imageUrl && (
        <div className="relative w-full h-36 bg-slate-50 border-b border-slate-100">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
              {offer.accountType}
            </p>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
              {offer.title}
            </h3>
          </div>
          <div className="shrink-0 flex items-center gap-1 bg-green-50 text-green-700 font-bold text-lg px-3 py-1.5 rounded-xl">
            <DollarSign className="w-4 h-4" />
            {offer.bonusAmount}
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {offer.requirements}
        </p>

        <div className="flex items-center justify-between">
          {offer.expirationDate ? (
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                isExpired ? 'text-red-500' : 'text-slate-400'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {isExpired ? 'Expired' : `Expires ${offer.expirationDate}`}
            </span>
          ) : (
            <span className="text-xs text-slate-400">Ongoing</span>
          )}

          <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
            View Details
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
