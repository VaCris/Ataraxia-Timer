import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
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
            Privacy Policy
          </h1>
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-3xl px-6">
        <article className="space-y-6 text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">1. Introduction</h2>
          <p>
            At <strong>TKOH Studios</strong> ("we", "our", "us"), your privacy is a top priority. This Privacy Policy explains how we collect, use, and protect your information when you use <strong>Ataraxia</strong> and <strong>Aputrak</strong> (the "Services").
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">2. Offline-First Architecture</h2>
          <p>
            Our applications are built with an <strong>Offline-First</strong> philosophy. By default, all your schedules, tags, timers, and personal settings are stored locally on your device using <em>IndexedDB</em>. We believe that your data belongs to you, and it remains on your device until you explicitly decide to synchronize it with our cloud servers.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">3. Data Collection and Cloud Sync</h2>
          <p>
            When you create an account and enable Cloud Synchronization to bridge your data between Ataraxia and Aputrak or across multiple devices, we securely transmit and store the following data on our servers:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-80)]">
            <li><strong>Account Information:</strong> Username, email address, and authentication credentials.</li>
            <li><strong>Application Data:</strong> Tasks, schedules, time logs, and custom tags.</li>
            <li><strong>Application Settings:</strong> Your UI preferences (like Dark/Light mode) and timer configurations.</li>
          </ul>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">4. How We Use Your Data</h2>
          <p>
            We strictly use your data for the sole purpose of providing and maintaining the Services. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-80)]">
            <li>Synchronizing your tasks and schedules seamlessly across your devices.</li>
            <li>Restoring your data in case you switch devices or lose access to your local storage.</li>
            <li>Ensuring basic operational functionality and security.</li>
          </ul>
          <p>
            <strong>We do NOT sell your data.</strong> We do not run third-party advertisements or use tracking pixels to monitor your behavior for marketing purposes.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">5. Data Security</h2>
          <p>
            All communications between your local device and our backend APIs are encrypted over HTTPS. While we implement industry-standard measures to protect your synchronized data, no method of transmission is 100% secure. You are responsible for keeping your login credentials confidential.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">6. Data Deletion and Your Rights</h2>
          <p>
            Because of our offline-first nature, you can instantly erase your local data by clearing your browser's site data or uninstalling the application. If you have synchronized your data to our cloud and wish to permanently delete your account and all associated cloud data, you can request account deletion through the app's settings or by contacting our support team.
          </p>

          <h2 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4">7. Updates to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time as our Services evolve. The most current version will always be available within the application and on our official website.
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
