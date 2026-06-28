export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-semibold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: June 2025</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">1. What we collect</h2>
          <p>We collect your email address and financial data you enter (transactions, categories, accounts). We do not sell your data to third parties.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">2. How we use it</h2>
          <p>Your data is used solely to provide the FinanceApp service — displaying your financial summary and history.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">3. Storage</h2>
          <p>Data is stored securely via Supabase (PostgreSQL) with row-level security. Only you can access your own data.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">4. Cookies</h2>
          <p>We use only authentication cookies required for login sessions. No tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">5. Contact</h2>
          <p>Questions? Email us at <a href="mailto:privacy@financeapp.com" className="text-foreground underline underline-offset-4">privacy@financeapp.com</a></p>
        </section>
      </div>

      <a href="/login" className="mt-12 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
        ← Back
      </a>
    </div>
  );
}