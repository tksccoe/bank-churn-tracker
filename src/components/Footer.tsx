import Link from 'next/link';
import { Banknote } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Banknote className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl tracking-tight">
                Bank Churn Tracker
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The ultimate tool for bank bonus hunters at bankchurntracker.com.
              Track your applications, requirements, and fee-free conditions.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="hover:text-blue-600 transition-colors"
                >
                  Bank Bonuses
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} bankchurntracker.com. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-slate-600 text-xs transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-slate-600 text-xs transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
