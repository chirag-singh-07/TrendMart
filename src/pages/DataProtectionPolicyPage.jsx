import { motion } from "framer-motion";

const DataProtectionPolicyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl"
    >
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8 mt-20">
        Data Protection Policy
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          1. Introduction
        </h2>
        <p className="text-gray-600 mt-2">
          The Introduction section establishes the purpose of the Data
          Protection Policy and outlines its importance for users. It assures
          users that their personal data is collected, processed, and stored in
          compliance with applicable data protection laws such as the General
          Data Protection Regulation (GDPR) or other relevant regulations. The
          section explains that this policy aims to provide transparency about
          how data is handled, ensuring users feel confident when using the
          website. It also emphasizes that protecting user privacy is a top
          priority and that the company follows strict security measures to
          safeguard personal data. Additionally, this section may define key
          terms like "personal data", "processing", and "third-party services"
          to help users better understand the policy. Finally, it sets the
          expectation that by using the website, users agree to the terms
          outlined in this policy, with an option to contact support for any
          questions regarding data protection.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          2. What Data We Collect
        </h2>
        <p className="text-gray-600 mt-2">
          This section specifies the types of personal and non-personal data
          that the company collects from users. Personal data includes
          information such as name, email address, phone number, billing
          details, and location (if applicable). If the website offers login
          services, passwords and account details may also be collected
          securely. Additionally, this section explains that non-personal data,
          such as device information, browser type, IP address, and browsing
          behavior, is collected to improve the user experience. It is essential
          to clarify that sensitive data like financial information or
          government-issued IDs is only collected when necessary and stored
          securely. The section should also mention that data collection occurs
          through various means, including account registration, order
          processing, newsletter sign-ups, cookies, and tracking technologies.
          Providing a transparent list of collected data helps users understand
          what information they are sharing and how it will be used.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          3. How We Use Your Data
        </h2>
        <p className="text-gray-600 mt-2">
          In this section, the company explains the different purposes for which
          user data is utilized. The primary reasons for data collection
          include:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>
            <b>Account creation and management – </b>Storing user details to
            facilitate login and order tracking.
          </li>
          <li>
            <b>Order processing and payment transactions –</b> Ensuring smooth
            purchases, shipping, and refunds.
          </li>
          <li>
            <b>Website functionality and user experience improvements –</b>{" "}
            Customizing recommendations based on user preferences.
          </li>
          <li>
            <b>Security and fraud prevention –</b> Detecting suspicious
            activities and maintaining a safe platform.
          </li>
          <li>
            <b>Marketing and communication – </b> Sending promotional emails,
            newsletters, and updates (with user consent).
          </li>
        </ul>
        <p className="text-gray-600 mt-2">
          The company should clarify that data is never misused, sold, or shared
          without proper consent. If data is anonymized for research or
          analytics, that should also be stated. Additionally, users should be
          informed about how their data is used for personalization, such as
          showing relevant content based on past interactions. By outlining all
          these aspects, this section reassures users that their data is used
          responsibly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          4. Data Security Measures
        </h2>
        <p className="text-gray-600 mt-2">
          This section details the security measures taken to protect user data
          from unauthorized access, breaches, or cyber threats. It outlines
          security protocols such as encryption (SSL/TLS), firewalls, access
          controls, and multi-factor authentication (MFA) for handling sensitive
          data. Additionally, this section may highlight how secure payment
          processing is ensured through third-party providers like Stripe or
          PayPal, which comply with industry security standards. The company
          should also mention regular security audits, employee training, and
          data anonymization techniques that reduce risks of exposure. In case
          of a data breach, a protocol should be in place to notify affected
          users and regulatory authorities within a legally required timeframe.
          Lastly, users should be encouraged to take personal precautions, such
          as using strong passwords and avoiding sharing login credentials, to
          further enhance their security.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          5. Data Sharing and Third Parties
        </h2>
        <p className="text-gray-600 mt-2">
          Users need to understand who has access to their data and under what
          conditions it might be shared. This section clarifies that user data
          is not sold but may be shared with trusted third parties such as:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>
            <b>Shipping companies </b> (to deliver products).
          </li>
          <li>
            <b>Payment processors</b> (for handling transactions).
          </li>
          <li>
            <b>Analytics providers</b> (like Google Analytics to track user
            behavior).
          </li>
        </ul>
        <p className="text-gray-600 mt-2">
          Additionally, legal obligations may require data sharing with
          government authorities or law enforcement if necessary. The company
          should clearly state that all third-party partners adhere to strict
          data protection standards and do not misuse user information. A
          transparent approach reassures users that their data is shared only
          when absolutely required and with proper security measures in place.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          6. Your Rights Under Data Protection Laws
        </h2>
        <p className="text-gray-600 mt-2">
          Users have the right to access, modify, and delete their personal
          data. This section outlines key rights, including:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>
            <b>Right to Access – </b> Users can request details about what
            personal data is stored.
          </li>
          <li>
            <b>Right to Rectification – </b> Users can correct inaccurate or
            outdated information.
          </li>
          <li>
            <b>Right to Deletion (Right to Be Forgotten) - </b> Users can
            request data removal if it is no longer needed.
          </li>
          <li>
            <b>Right to Object - </b> Users can Users can object to data
            processing for marketing purposes.
          </li>
          <li>
            <b>Right to Data Portability – </b> Users can Users can request a
            copy of their data in a structured format. Companies must explain
            how users can exercise these rights, usually by emailing support or
            submitting a request through the website. It should also mention any
            exceptions where data retention is legally required (e.g., tax or
            fraud prevention laws). Providing this information ensures users
            feel in control of their personal information.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          7. Data Retention Policy
        </h2>
        <p className="text-gray-600 mt-2">
          This section explains how long user data is stored and when it is
          deleted. Companies typically retain user information:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>
            For as long as necessary to provide services (e.g., account details
            while active).
          </li>
          <li>
            <b>Right to Rectification – </b> Users can correct inaccurate or
            outdated information.
          </li>
          <li>
            To comply with legal obligations (e.g., financial records for tax
            purposes).
          </li>
          <li>
            <b>Until the user requests deletion </b> (subject to legal
            limitations). After the retention period, data is securely deleted
            or anonymized so it cannot be linked back to individuals. Users
            should also be informed about how to request data deletion and what
            exceptions might apply.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          8. International Data Transfers
        </h2>
        <p className="text-gray-600 mt-2">
          If the company operates globally, it may transfer user data across
          different countries. This section explains whether data is stored in
          servers located in different regions and what legal safeguards are in
          place. It should state that transfers comply with GDPR, Privacy
          Shield, or other regulations to ensure user data remains protected,
          regardless of location. If using third-party services that store data
          overseas (e.g., cloud hosting providers like AWS or Google Cloud),
          this should be disclosed with details about how these services uphold
          data protection laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          9. Cookies & Tracking Technologies
        </h2>
        <p className="text-gray-600 mt-2">
          This section explains how cookies and tracking technologies are used
          on the website. It should cover:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>
            <b>Essential Cookies – </b> Required for website functionality
            (e.g., login sessions).
          </li>
          <li>
            <b>Analytics Cookies – </b> Track user behavior for website
            improvements (e.g., Google Analytics).
          </li>
          <li>
            <b>Marketing Cookies – </b> Used for personalized ads (e.g.,
            Facebook Pixel). Users should be given the option to accept, reject,
            or customize cookie preferences. The company must also comply with
            cookie laws such as GDPR (EU) or CCPA (California) by providing a
            cookie consent banner.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          10. Contact Information & Complaints
        </h2>
        <p className="text-gray-600 mt-2">
          Finally, this section provides details on how users can contact the
          company for any questions or complaints related to data protection. It
          should include:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>
            <b>Email address </b>{" "}
            <a href="mailto:privacy@trendmart.com" className="text-blue-500">
              privacy@trendmart.com
            </a>{" "}
          </li>
          <li>
            <b>Analytics Cookies – </b> Track user behavior for website
            improvements (e.g., Google Analytics).
          </li>
          <li>
            <b>Mailing address </b>
            <a href="mailto:support@trendmart.com" className="text-blue-500">
              support@trendmart.com
            </a>
          </li>
        </ul>
        <p className="text-gray-600 mt-2">
          This section should also guide users on how to file complaints with
          data protection authorities if they believe their rights have been
          violated. Providing clear contact options ensures users feel supported
          and confident in their data privacy.
        </p>
      </section>
    </motion.div>
  );
};

export default DataProtectionPolicyPage;
