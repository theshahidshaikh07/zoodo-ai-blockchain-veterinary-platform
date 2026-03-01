import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Effective date: March 1, 2026</p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-foreground/90 leading-7">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Scope</h2>
            <p>
              This Privacy Policy explains how Zoodo collects, uses, discloses, and protects personal information when
              you use our website, applications, Salus AI assistant, and related services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account and profile data (for example name, email, role, and login credentials).</li>
              <li>Pet and service data you submit (for example symptoms, pet details, and care preferences).</li>
              <li>AI conversation data and prompts provided to Salus AI.</li>
              <li>Location data when you grant permission for nearby service recommendations.</li>
              <li>Usage, device, and diagnostics data (for security, reliability, and analytics).</li>
              <li>Transaction and booking metadata for paid or scheduled services.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and improve core platform features and user experience.</li>
              <li>Generate AI responses, recommendations, and emergency guidance signals.</li>
              <li>Match users with providers, clinics, trainers, and nearby services.</li>
              <li>Process bookings, support workflows, and service communications.</li>
              <li>Protect platform security, prevent abuse, and comply with legal obligations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. AI and Automated Processing</h2>
            <p>
              Prompts and contextual inputs may be processed by AI systems to generate assistance and recommendations.
              AI outputs can be imperfect and should be independently validated, especially for health-related decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Location Information</h2>
            <p>
              We collect location information only when you permit it in your browser/app. Location may be used to
              find nearby providers, clinics, hospitals, or trainers. You can disable location access at any time in
              device/browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Blockchain Records</h2>
            <p>
              To support record integrity, Zoodo may store cryptographic proofs (hashes) on blockchain infrastructure.
              Blockchain data is generally immutable and may not be alterable after submission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Sharing and Third-Party Services</h2>
            <p>We may share data with trusted providers that help us operate services, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>AI model/service providers for response generation.</li>
              <li>Payment processors for transactions.</li>
              <li>Video consultation and communications providers.</li>
              <li>Mapping/location providers for discovery workflows.</li>
              <li>Infrastructure, hosting, analytics, and security vendors.</li>
            </ul>
            <p>
              We do not sell personal data. We may disclose information when required by law or to protect legal rights
              and platform safety.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Data Retention</h2>
            <p>
              We retain information for as long as needed to provide services, satisfy legal obligations, resolve
              disputes, enforce agreements, and maintain security records.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Your Choices and Rights</h2>
            <p>Depending on applicable law, you may have rights to access, update, or request deletion of data.</p>
            <p>
              You may also control permissions (such as location) and certain communications settings in your account
              or device preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">10. Security</h2>
            <p>
              We use technical and organizational safeguards designed to protect personal information. No method of
              transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">11. Children</h2>
            <p>
              Our Services are intended for users who can lawfully consent. If you believe a child has provided data
              without required consent, please contact us so we can review and address it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">12. Policy Updates</h2>
            <p>
              We may update this Privacy Policy periodically. Material updates will be reflected by a revised effective
              date and, where appropriate, additional notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">13. Contact</h2>
            <p>
              For privacy requests or questions, contact us via the{" "}
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

