import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-cream)] pb-24">
      <header className="sticky top-0 z-50 border-b border-[var(--color-sborder)] bg-[var(--color-surface)]/90 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-tabs-bg)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight">
            Terms & Conditions
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-3xl px-6">
        <article className="space-y-6 text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using <strong>Ataraxia</strong> and <strong>Aputrak</strong> (the "Services") provided by <strong>TKOH Studios</strong>, you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the Services.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">2. Use of the Services</h2>
          <p>
            Ataraxia and Aputrak are productivity tools designed to help you manage your schedules and focus time. You agree to use the Services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Services.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">3. Offline-First Nature & Data Responsibility</h2>
          <p>
            The Services are designed to operate primarily offline. Your data is stored locally in your browser or device using <em>IndexedDB</em>. We provide Cloud Synchronization as an optional convenience to bridge data across devices. 
            <strong>TKOH Studios is not responsible for data loss</strong> resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-80)]">
            <li>Clearing your browser's site data or cache before syncing.</li>
            <li>Using the Services in private/incognito browsing modes where data is not persisted.</li>
            <li>Hardware failure or software corruption on your local device.</li>
          </ul>
          <p>
            We highly recommend regularly exporting your data or ensuring Cloud Synchronization is active if your data is critical.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">4. User Accounts</h2>
          <p>
            If you choose to use the Cloud Synchronization features, you must create an account. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">5. Intellectual Property</h2>
          <p>
            The Services and their original content, features, and functionality are and will remain the exclusive property of TKOH Studios and its licensors. The Services are protected by copyright, trademark, and other laws of both the local and international jurisdictions.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall TKOH Studios, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <p className="mt-16 text-sm font-bold text-[var(--color-text-45)] uppercase tracking-widest">
            Last Updated: June 2026<br/>
            TKOH Studios
          </p>
        </article>
      </main>
    </div>
  );
}
