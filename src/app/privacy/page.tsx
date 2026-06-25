import Link from "next/link";
import type { Metadata } from "next";
import { POLICY_EFFECTIVE_DATE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy — reveal.",
  description:
    "Privacy policy for reveal., a revenue-intelligence and audit tool for restaurants. Covers waitlist marketing, application data, Plaid bank connectivity, point-of-sale integrations, retention, and deletion rights.",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <div className="privacy-page-inner">
        <header className="privacy-page-header">
          <p className="privacy-page-eyebrow">Privacy policy</p>
          <h1>Privacy</h1>
          <p className="privacy-page-meta">
            Effective {POLICY_EFFECTIVE_DATE} · Reveal Labs LLC · Lakewood,
            Colorado
          </p>
          <p className="privacy-page-lede">
            Reveal Labs LLC (&ldquo;Reveal,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us&rdquo;) operates the reveal. website and SaaS application
            that helps independent restaurants reconcile sales,
            delivery-marketplace payouts, banking activity, and vendor
            commitments. This policy describes what we collect, why, how long
            we keep it, and the rights you have over it. If anything below is
            unclear, reach us at{" "}
            <a href="mailto:chayadol@reveallabs.co">chayadol@reveallabs.co</a>.
          </p>
        </header>

        <section>
          <h2>1. Information we collect</h2>
          <p>
            <strong>What you give us directly.</strong> Account information
            (name, business name, email, password — stored only as a salted
            hash by our authentication provider), restaurant operational
            details you choose to enter (locations, vendors, leases, contracts,
            uploaded documents such as invoices and statements), and any
            messages you send us by email or in-app.
          </p>
          <p>
            <strong>Waitlist and marketing submissions.</strong> If you join
            the waitlist or subscribe to reveal. news, we receive the name,
            restaurant name, and email you submit. We use these only to contact
            you about reveal. and the news feed you signed up for.
          </p>
          <p>
            <strong>Information we receive from Plaid on your behalf.</strong>{" "}
            When you connect a bank account, we use <strong>Plaid Inc.</strong>{" "}
            as our bank-connectivity provider. With your explicit consent,
            Plaid acts as your data-access agent and provides Reveal with
            account metadata (institution, account name and type, masked
            account number), transaction records (date, amount, merchant,
            category, pending status), and recurring-payment summaries. You
            enter bank credentials directly inside Plaid Link — Reveal{" "}
            <strong>never sees or stores</strong> your online-banking username
            or password. Plaid&apos;s handling of this information is also
            governed by Plaid&apos;s{" "}
            <a
              href="https://plaid.com/legal/"
              target="_blank"
              rel="noopener noreferrer"
            >
              End User Privacy Policy
            </a>
            .
          </p>
          <p>
            <strong>Information we receive from your POS.</strong> When you
            connect a point-of-sale provider such as Clover, we receive sales,
            payment, employee, and inventory records for the locations you
            authorize.
          </p>
          <p>
            <strong>Information collected automatically.</strong> Structured
            application logs of actions you take inside the Service (with
            personal data minimized), IP address, browser type, and timestamps
            needed for security and abuse prevention. On the marketing site we
            use Vercel Analytics (page views, referrer, country — no personal
            data) and PostHog (anonymous event tracking — page views, modal
            opens, form submissions; memory-only persistence, no cross-session
            cookies, no session recording). We identify a visitor by email
            only after they submit a form to us, so we can attribute which
            content led to which sign-up.
          </p>
        </section>

        <section>
          <h2>2. How we use it</h2>
          <ul>
            <li>
              Provide, operate, and improve the Service — including running
              reconciliation, generating findings, and surfacing audit
              insights.
            </li>
            <li>Authenticate you and protect your account.</li>
            <li>Diagnose problems and respond to support requests.</li>
            <li>
              Communicate with you about your account, service updates, and
              material changes to this policy.
            </li>
            <li>Comply with legal obligations and enforce our agreements.</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal information, and we
            do not use bank or POS data for advertising.
          </p>
        </section>

        <section>
          <h2>3. How we share it</h2>
          <p>
            We share personal information only with: (a) service providers
            acting on our instructions and bound by confidentiality and
            security obligations — Plaid (bank connectivity), Supabase
            (database and authentication), Vercel (hosting and analytics),
            Google Workspace (corporate email), Clover (when used as your
            POS), GitHub (source control), and PostHog (aggregate
            marketing-site analytics); (b) authorities or other parties when
            legally required; and (c) successors in the event of a merger,
            acquisition, financing, or sale of assets, with notice to you and
            a continued obligation to honor this policy. We do not share,
            rent, or sell personal information for marketing purposes.
          </p>
        </section>

        <section>
          <h2>4. Plaid-specific disclosures</h2>
          <ul>
            <li>
              <strong>Consent.</strong> You authorize Reveal to access bank
              data through Plaid by completing the in-app consent flow that
              precedes Plaid Link. Your authorization can be withdrawn at any
              time (see §6).
            </li>
            <li>
              <strong>Scope.</strong> Reveal requests only the Plaid product
              scopes necessary to operate the Service. At v1.0 this is the
              Transactions product for the accounts you choose to connect.
              We&apos;ll update this disclosure if additional Plaid products
              are enabled.
            </li>
            <li>
              <strong>Storage.</strong> Plaid <code>access_token</code> values
              returned by Plaid Link are encrypted with AES-256-GCM before
              storage. Raw bank credentials are entered inside Plaid Link and
              are never transmitted to Reveal.
            </li>
            <li>
              <strong>Independent processing by Plaid.</strong> Plaid is an
              independent data processor; its collection and use of your
              information are also governed by Plaid&apos;s policies. You can
              contact Plaid directly via{" "}
              <a
                href="https://my.plaid.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Plaid Portal
              </a>{" "}
              or{" "}
              <a href="mailto:privacy@plaid.com">privacy@plaid.com</a> to
              manage or delete data Plaid holds about you.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. How long we keep it</h2>
          <p>
            We retain personal information for as long as your account is
            active and as needed to provide the Service, then on the
            following schedule:
          </p>
          <ul>
            <li>
              Active account data, including Plaid- and POS-sourced records:
              life of the account plus 90 days after closure.
            </li>
            <li>
              Plaid <code>access_token</code> after a bank Item is
              disconnected: deleted within 30 days.
            </li>
            <li>Application logs: 30 days hot, then up to 365 days archived.</li>
            <li>
              Authentication and security audit logs: 13 months (required for
              fraud and abuse investigations).
            </li>
            <li>
              Database backups: managed by our database provider per the
              active plan&apos;s stated retention window.
            </li>
            <li>
              Tax, financial, and legal records that we are required to keep
              by law: up to 7 years.
            </li>
            <li>
              Marketing and waitlist contacts: until you unsubscribe or after
              24 months of inactivity.
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Your rights and choices</h2>
          <ul>
            <li>
              <strong>Access</strong> the personal information we hold about
              you by emailing{" "}
              <a href="mailto:chayadol@reveallabs.co">
                chayadol@reveallabs.co
              </a>
              .
            </li>
            <li>
              <strong>Correct</strong> information you believe is inaccurate.
            </li>
            <li>
              <strong>Disconnect</strong> a connected bank from inside the
              Service. Disconnection revokes Reveal&apos;s Plaid{" "}
              <code>access_token</code> and stops further pulls.
            </li>
            <li>
              <strong>Delete</strong> your account and associated data. On
              request, we delete or de-identify what we hold within 30 days
              of verification, subject to limited legal-exception retention
              (tax records, fraud-prevention logs, and backups, which expire
              on their normal cycle).
            </li>
            <li>
              <strong>Withdraw consent</strong> for data flows that depend on
              your authorization (Plaid, POS).
            </li>
            <li>
              <strong>Unsubscribe</strong> from marketing email using the
              link in any message we send.
            </li>
          </ul>
          <p>
            Residents of California, Colorado, Virginia, Connecticut, Utah,
            and other states with comprehensive privacy laws have additional
            rights, including the right to know, delete, correct, port, and
            opt out of certain processing. Submit any such request to{" "}
            <a href="mailto:chayadol@reveallabs.co">chayadol@reveallabs.co</a>;
            we will respond within the statutory window.
          </p>
          <p>
            If you would like Plaid itself to delete data it holds, you can
            do so directly via{" "}
            <a
              href="https://my.plaid.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Plaid Portal
            </a>{" "}
            or by emailing{" "}
            <a href="mailto:privacy@plaid.com">privacy@plaid.com</a>.
          </p>
        </section>

        <section>
          <h2>7. Security</h2>
          <p>
            We protect personal information with TLS 1.2+ in transit,
            AES-256-GCM for stored Plaid and POS credentials, platform
            encryption at rest for the database, tenant-isolated access via
            row-level security keyed on a verified JWT claim, multi-factor
            authentication on administrative accounts, and a documented
            incident-response process. We rely on managed-platform patching
            (Vercel, Supabase, Google Workspace) and on GitHub Dependabot for
            dependency vulnerability alerts. No system can be 100% secure; we
            work continuously to improve our posture. To report a security
            concern, contact{" "}
            <a href="mailto:security@reveallabs.co">security@reveallabs.co</a>.
          </p>
        </section>

        <section>
          <h2>8. Cookies and tracking</h2>
          <p>
            The Service uses strictly necessary cookies to maintain your
            authenticated session and to remember non-sensitive interface
            preferences. We do not use cross-site advertising cookies and we
            do not record or replay your screen activity.
          </p>
        </section>

        <section>
          <h2>9. Children&apos;s privacy</h2>
          <p>
            The Service is not directed to individuals under 16, and we do
            not knowingly collect personal information from children. If you
            believe a child has provided us with personal information,
            contact us and we will delete it.
          </p>
        </section>

        <section>
          <h2>10. International users</h2>
          <p>
            The Service is operated from the United States. If you access it
            from outside the U.S., you understand that your information will
            be processed in the United States and other locations where our
            providers operate.
          </p>
        </section>

        <section>
          <h2>11. Changes to this policy</h2>
          <p>
            We&apos;ll update this policy when our practices change. If a
            change is material, we&apos;ll notify you by email or through the
            Service before it takes effect. The effective date at the top
            reflects the most recent revision.
          </p>
        </section>

        <section>
          <h2>12. Contact us</h2>
          <p>
            <strong>Privacy questions and rights requests:</strong>{" "}
            <a href="mailto:chayadol@reveallabs.co">
              chayadol@reveallabs.co
            </a>
          </p>
          <p>
            <strong>Security and incident reports:</strong>{" "}
            <a href="mailto:security@reveallabs.co">
              security@reveallabs.co
            </a>
          </p>
          <p>
            <strong>Mail:</strong> Reveal Labs LLC, 6728 W Adriatic Ave,
            Lakewood, CO 80227
          </p>
        </section>

        <footer className="privacy-page-footer">
          <Link href="/">← Back to home</Link>
        </footer>
      </div>
    </main>
  );
}
