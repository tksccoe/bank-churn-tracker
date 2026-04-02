'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Banknote,
  ArrowRight,
  TrendingUp,
  Lock,
  Clock,
  Zap,
} from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = () =>
    signIn('google', { callbackUrl: '/dashboard' });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-16 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-6">
              <Zap className="w-3 h-3" />
              <span>Maximize Your Bank Bonuses</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Stop Leaving <span className="text-blue-600">Free Money</span> On
              The Table
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Bank Churn Tracker helps you organize, track, and conquer bank
              account bonuses. Never miss a direct deposit requirement or pay a
              monthly fee again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {session ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to churn like a pro
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Built by churners, for churners. We&apos;ve simplified the complex
              world of bank bonuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
                title: 'Bonus Tracking',
                desc: 'Keep track of applied, approved, and completed bonuses in one unified dashboard.',
              },
              {
                icon: <Lock className="w-6 h-6 text-green-600" />,
                title: 'Fee-Free Tracker',
                desc: "Log your monthly fee-free requirements to ensure you never pay a cent in maintenance fees.",
              },
              {
                icon: <Clock className="w-6 h-6 text-purple-600" />,
                title: 'Smart Reminders',
                desc: "Visual indicators let you know when it's safe to close an account without forfeiting your bonus.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">$500+</p>
              <p className="text-blue-100 font-medium">Average Annual Bonus</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">100%</p>
              <p className="text-blue-100 font-medium">Fee-Free Success Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">Unlimited</p>
              <p className="text-blue-100 font-medium">Accounts Tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - only shown to visitors who are not signed in */}
      {!session && (
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to start your churning journey?
              </h2>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto">
                Join thousands of users who are already maximizing their
                financial potential with Bank Churn Tracker.
              </p>
              <button
                onClick={handleLogin}
                className="px-10 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl"
              >
                Sign Up with Google
              </button>
            </div>
          </div>
        </div>
      </section>
      )}

      <Footer />
    </div>
  );
}
