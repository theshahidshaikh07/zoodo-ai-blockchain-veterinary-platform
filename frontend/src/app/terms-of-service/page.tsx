import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Effective date: March 1, 2026</p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-foreground/90 leading-7">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Agreement to Terms</h2>
            <p>
              These Terms of Service govern your access to and use of Zoodo, including our website, applications,
              AI assistant (Salus AI), and related services (collectively, the "Services"). By using the Services,
              you agree to these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Medical Disclaimer</h2>
            <p>
              Zoodo and Salus AI provide informational support only. They do not replace a licensed veterinarian,
              diagnosis, treatment plan, or emergency care. You are responsible for obtaining professional veterinary
              care for urgent or serious conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Eligibility and Accounts</h2>
            <p>
              You must provide accurate account information and maintain the security of your credentials. You are
              responsible for all activity under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Use of Services</h2>
            <p>You agree not to misuse the Services. Prohibited conduct includes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Using the Services for unlawful, harmful, or fraudulent purposes.</li>
              <li>Attempting to disrupt, reverse engineer, or gain unauthorized access to our systems.</li>
              <li>Submitting false or misleading medical information that may endanger others.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. AI Outputs and Recommendations</h2>
            <p>
              AI-generated responses may be incomplete or inaccurate. You must independently verify important advice.
              Provider and location recommendations are based on available data and may vary by region and coverage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Appointments, Consultations, and Third Parties</h2>
            <p>
              Certain Services rely on third-party providers and platforms (for example payment processors, mapping
              services, and video consultation providers). Your use of third-party services may also be governed by
              their terms and policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Payments and Refunds</h2>
            <p>
              Paid services may be processed by third-party payment providers. Fees, refund eligibility, and dispute
              handling may depend on service type and provider terms shown at checkout or booking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Blockchain and Record Integrity</h2>
            <p>
              Zoodo may store cryptographic proofs (hashes) related to medical records on blockchain networks to
              support integrity verification. Blockchain entries are generally immutable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Intellectual Property</h2>
            <p>
              The Services, including software, content, branding, and design elements, are owned by Zoodo or its
              licensors and are protected by applicable intellectual property laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">10. Termination</h2>
            <p>
              We may suspend or terminate access to the Services for violations of these Terms, security concerns, or
              legal obligations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">11. Limitation of Liability</h2>
            <p>
              To the extent permitted by law, Zoodo is not liable for indirect, incidental, special, or consequential
              damages, or for decisions made based on AI outputs, provider listings, or third-party services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Services after updates constitutes
              acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">13. Contact</h2>
            <p>
              For legal or policy questions, contact us via the{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

