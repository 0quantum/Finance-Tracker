export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-semibold">Terms of Service</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: June 2025</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">1. Acceptance</h2>
          <p>By using FinanceApp you agree to these terms. If you do not agree, please do not use the service.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">2. Use of service</h2>
          <p>FinanceApp is a personal finance tracking tool. You are responsible for the accuracy of data you enter.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">3. Account</h2>
          <p>You must provide a valid email to create an account. You are responsible for keeping your password secure.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">4. Termination</h2>
          <p>We reserve the right to suspend accounts that violate these terms or misuse the service.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">5. Disclaimer</h2>
          <p>FinanceApp is provided as-is. We are not liable for financial decisions made based on data shown in the app.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-medium text-foreground">6. Contact</h2>
          <p>Questions? Email us at <a href="mailto:legal@financeapp.com" className="text-foreground underline underline-offset-4">legal@financeapp.com</a></p>
        </section>
      </div>

      <a href="/login" className="mt-12 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
        ← Back
      </a>
    </div>
  );
}