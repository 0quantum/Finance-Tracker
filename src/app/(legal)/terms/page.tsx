export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-semibold">Terms of Service</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: June 2025</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">1. Acceptance</h2>
          <p>By accessing or using Klyro (available at klyro.app and as an iOS application), you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">2. Description of Service</h2>
          <p>Klyro is a personal finance tracking tool that lets you record income, expenses, accounts, and budgets. It is intended for personal use only. You are responsible for the accuracy of data you enter. Klyro does not provide financial, investment, legal, or tax advice.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">3. Accounts & Authentication</h2>
          <p>You may sign up using an email and password or via Sign in with Apple. You are responsible for maintaining the confidentiality of your credentials. Klyro will never ask for your Apple ID password.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">4. Account Deletion</h2>
          <p>You may permanently delete your account and all associated data at any time from the Settings screen inside the app, or by contacting us at <a href="mailto:support@klyro.app" className="text-foreground underline underline-offset-4">support@klyro.app</a>. Deletion is irreversible. We will remove your data within 30 days of the request.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">5. Acceptable Use</h2>
          <p>You agree not to misuse Klyro — including attempting to access other users&apos; data, reverse-engineer the service, or use it for any unlawful purpose. We reserve the right to suspend accounts that violate these terms.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">6. Subscriptions & Payments</h2>
          <p>Klyro currently offers a free tier. Paid plans, if introduced, will be clearly described before purchase. Subscriptions purchased through the Apple App Store are governed by Apple&apos;s payment terms and refund policy.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">7. Disclaimer</h2>
          <p>Klyro is provided &quot;as is&quot; without warranties of any kind. We are not liable for financial decisions made based on data shown in the app, for data loss, or for service interruptions.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">8. Changes to Terms</h2>
          <p>We may update these Terms at any time. Continued use of Klyro after changes are posted constitutes acceptance of the revised Terms.</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">9. Contact</h2>
          <p>Questions? <a href="mailto:support@klyro.app" className="text-foreground underline underline-offset-4">support@klyro.app</a></p>
        </section>
      </div>

      <a href="/login" className="mt-12 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">← Back</a>
    </div>
  )
}