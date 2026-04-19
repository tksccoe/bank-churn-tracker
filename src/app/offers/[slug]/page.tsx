import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Offer from '@/lib/models/Offer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...obj,
    id: obj._id?.toString(),
    _id: undefined,
    __v: undefined,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const doc = await Offer.findOne({ slug, active: true });
  if (!doc) return { title: 'Offer Not Found' };
  return {
    title: `${doc.title} | Bank Churn Tracker`,
    description: `${doc.institutionName} ${doc.accountType} — $${doc.bonusAmount} bonus. ${doc.requirements}`,
  };
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const doc = await Offer.findOne({ slug, active: true });
  if (!doc) notFound();

  const offer = serialize(doc);
  const isExpired =
    offer.expirationDate && new Date(offer.expirationDate) < new Date();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Back link */}
          <Link
            href="/offers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All Offers
          </Link>

          <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Banner image */}
            {offer.imageUrl && (
              <div className="relative w-full h-48 bg-slate-50 border-b border-slate-100">
                <Image
                  src={offer.imageUrl}
                  alt={offer.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-1">
                  <Building2 className="w-3 h-3" />
                  {offer.institutionName}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
                  {offer.accountType}
                </span>
                {offer.featured && (
                  <span className="text-xs font-bold text-white bg-blue-600 rounded-full px-2.5 py-1">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
                {offer.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 font-bold text-xl px-4 py-2 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                  {offer.bonusAmount} Bonus
                </div>
                {offer.expirationDate && (
                  <span
                    className={`flex items-center gap-1.5 text-sm font-medium ${
                      isExpired ? 'text-red-500' : 'text-slate-500'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    {isExpired
                      ? 'This offer has expired'
                      : `Expires ${offer.expirationDate}`}
                  </span>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Requirements
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {offer.requirements}
              </p>
            </div>

            {/* Description (Markdown) */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <div className="prose prose-slate prose-sm max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown>{offer.description}</ReactMarkdown>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 md:p-8 bg-slate-50">
              {isExpired ? (
                <div className="text-center">
                  <p className="text-slate-500 font-medium mb-3">
                    This offer is no longer available.
                  </p>
                  <Link
                    href="/offers"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Browse Other Offers
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <a
                    href={offer.referralUrl}
                    target="_blank"
                    rel="noopener sponsored"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                  >
                    Open This Account
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <p className="text-xs text-slate-400 mt-3">
                    Opens the bank&apos;s website. We may earn a referral bonus
                    at no cost to you.
                  </p>
                </div>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
