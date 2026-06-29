export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-semibold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: June 2025</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">1. Who We Are</h2>
          <p>Klyro is a personal finance tracking app available on the web and iOS. This policy explains what data we collect, how we use it, and your rights over it.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">2. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-foreground font-medium">Account data</span> — email address, display name, and avatar (if provided via Sign in with Apple or Google).</li>
            <li><span className="text-foreground font-medium">Financial data you enter</span> — transactions, accounts, categories, budgets, and debts you create inside the app.</li>
            <li><span className="text-foreground font-medium">Authentication tokens</span> — stored securely on your device to keep you signed in.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">3. Data We Do NOT Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do not collect device advertising identifiers (IDFA).</li>
            <li>We do not track you across other apps or websites.</li>
            <li>We do not access your contacts, camera, microphone, or location.</li>
            <li>We do not sell, rent, or share your personal data with third parties for marketing.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">4. Sign in with Apple</h2>
          <p>If you sign in using Apple ID, we receive only the information Apple shares with us — typically an email or Apple&apos;s private relay address, and your name on first sign-in. We do not receive your Apple ID password.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">5. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and improve the Klyro service.</li>
            <li>To authenticate you and secure your account.</li>
            <li>To respond to support requests.</li>
          </ul>
          <p className="mt-2">We do not use your financial data for advertising or profiling.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">6. Storage & Security</h2>
          <p>Your data is stored in Supabase (hosted on AWS). All data is encrypted in transit (TLS) and at rest. Access is protected by row-level security — only you can read your own data.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">7. Cookies</h2>
          <p>We use only authentication cookies required for login sessions. No tracking or advertising cookies.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">8. Your Rights</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-foreground font-medium">Access</span> — view all your data inside the app at any time.</li>
            <li><span className="text-foreground font-medium">Deletion</span> — delete your account and all data from Settings → Delete account, or email <a href="mailto:support@klyro.app" className="text-foreground underline underline-offset-4">support@klyro.app</a>. We process requests within 30 days.</li>
            <li><span className="text-foreground font-medium">Export</span> — contact us to request a copy of your data.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">9. Children</h2>
          <p>Klyro is not directed to children under 13. We do not knowingly collect personal data from children.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">10. Contact</h2>
          <p><a href="mailto:support@klyro.app" className="text-foreground underline underline-offset-4">support@klyro.app</a></p>
        </section>
      </div>

      <a href="/login" className="mt-12 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">← Back</a>
    </div>
  )
}