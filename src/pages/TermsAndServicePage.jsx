import { motion } from "framer-motion";

const TermsAndServicePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl"
    >
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8 mt-20">
        Terms of Service
      </h1>

      {/* Introduction */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">1. Introduction</h2>
        <p className="text-gray-600 mt-2">
          Welcome to **TrendMart**! These Terms of Service outline the rules
          and regulations for using our e-commerce platform. By accessing or
          using our services, you agree to be bound by these terms. If you do
          not agree with any part of these terms, you must refrain from using
          our platform.
        </p>
      </section>

      {/* User Responsibilities */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          2. User Responsibilities
        </h2>
        <p className="text-gray-600 mt-2">
          As a user, you must ensure that your actions comply with all
          applicable laws and regulations. You are responsible for the security
          of your account and must not engage in fraudulent, abusive, or illegal
          activities. Any violations may lead to account suspension or permanent
          termination.
        </p>
      </section>

      {/* Account Registration */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          3. Account Registration
        </h2>
        <p className="text-gray-600 mt-2">
          To use certain features of TrendMart, you may be required to create an
          account. You must provide accurate and up-to-date information. You are
          solely responsible for safeguarding your login credentials and must
          not share your account details with others. If you suspect
          unauthorized access, notify us immediately.
        </p>
      </section>

      {/* Payments & Transactions */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          4. Payments & Transactions
        </h2>
        <p className="text-gray-600 mt-2">
          All purchases made through TrendMart are securely processed. By
          completing a transaction, you authorize us to charge your payment
          method. We do not store your financial information; payments are
          handled through secure third-party payment gateways.
        </p>
      </section>

      {/* Refund & Cancellation Policy */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          5. Refund & Cancellation Policy
        </h2>
        <p className="text-gray-600 mt-2">
          We understand that issues may arise with orders. Refunds and
          cancellations are subject to our <a href="/refund-policy" className="text-blue-500">Refund Policy</a>. If you wish to
          request a refund, please contact our support team with your order
          details.
        </p>
      </section>

      {/* Privacy Policy */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          6. Privacy & Data Protection
        </h2>
        <p className="text-gray-600 mt-2">
          We value your privacy and are committed to protecting your personal
          information. Any data collected is used strictly for enhancing your
          shopping experience. Please refer to our{" "}
          <a href="/privacy-policy" className="text-blue-500">
            Privacy Policy
          </a>{" "}
          for more details on how we handle your data.
        </p>
      </section>

      {/* Content Ownership */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          7. Intellectual Property & Content Ownership
        </h2>
        <p className="text-gray-600 mt-2">
          All content on TrendMart, including logos, graphics, and product
          descriptions, is the property of TrendMart or its licensors. Users are
          prohibited from copying, distributing, or using our content without
          written permission.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          8. Limitation of Liability
        </h2>
        <p className="text-gray-600 mt-2">
          While we strive to provide a seamless experience, we cannot guarantee
          that our platform will always be available or error-free. TrendMart is
          not liable for any damages, including loss of data or financial
          losses, resulting from the use of our platform.
        </p>
      </section>

      {/* Termination of Services */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          9. Termination of Services
        </h2>
        <p className="text-gray-600 mt-2">
          We reserve the right to suspend or terminate access to our platform
          for users who violate our terms. If your account is terminated, you
          may lose access to your order history and account data.
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          10. Changes to Terms
        </h2>
        <p className="text-gray-600 mt-2">
          We may update these Terms of Service periodically. Continued use of
          TrendMart after changes are published signifies your acceptance of the
          new terms.
        </p>
      </section>

      {/* Contact Information */}
      <section className="text-center mt-8">
        <p className="text-gray-700">
          If you have any questions regarding our Terms of Service, please
          contact us at{" "}
          <a href="mailto:support@trendmart.com" className="text-blue-500">
            support@trendmart.com
          </a>
          .
        </p>
      </section>
    </motion.div>
  );
};

export default TermsAndServicePage;
