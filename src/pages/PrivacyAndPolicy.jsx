import { motion } from "framer-motion";
const PrivacyAndPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl"
    >
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8 mt-20">
        Privacy Policy
      </h1>

      {/* Introduction */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">1. Introduction</h2>
        <p className="text-gray-600 mt-2">
          At <strong>TrendMart</strong>, we value your privacy. This Privacy Policy explains
          how we collect, use, disclose, and protect your personal information
          when you visit or use our website.
        </p>
      </section>

      {/* Data Collection */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">2. Information We Collect</h2>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>Personal information (e.g., name, email, phone number).</li>
          <li>Billing information (for transactions and orders).</li>
          <li>Usage data (e.g., pages visited, interactions, and preferences).</li>
        </ul>
      </section>

      {/* Data Usage */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">3. How We Use Your Data</h2>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>Process transactions and deliver products.</li>
          <li>Improve user experience and website performance.</li>
          <li>Send updates, promotions, and customer support messages.</li>
        </ul>
      </section>

      {/* Third-Party Sharing */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">4. Third-Party Services</h2>
        <p className="text-gray-600 mt-2">
          We may share your data with trusted third-party services such as
          payment processors and analytics providers. We do not sell or trade
          your personal data.
        </p>
      </section>

      {/* Security Measures */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">5. Data Security</h2>
        <p className="text-gray-600 mt-2">
          We implement security measures to protect your data from unauthorized
          access, alteration, or disclosure. However, no online service is 100%
          secure, so we cannot guarantee absolute security.
        </p>
      </section>

      {/* Cookies Policy */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">6. Cookies Policy</h2>
        <p className="text-gray-600 mt-2">
          Our website uses cookies to enhance user experience. You can manage
          cookie preferences in your browser settings.
        </p>
      </section>

      {/* Changes to Policy */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">7. Changes to This Policy</h2>
        <p className="text-gray-600 mt-2">
          We may update our Privacy Policy from time to time. We will notify
          users of significant changes through our website or via email.
        </p>
      </section>

      {/* Contact Information */}
      <section className="text-center mt-8">
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us
          at {" "}
          <a href="mailto:support@trendmart.com" className="text-blue-500">
            support@trendmart.com
          </a>
          .
        </p>
      </section>
    </motion.div>
  );
};

export default PrivacyAndPolicy;
