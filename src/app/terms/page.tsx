import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/terms.md'),
    'utf-8'
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 flex-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-p:text-slate-600 prose-li:text-slate-600">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
