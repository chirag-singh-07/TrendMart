import { motion } from "framer-motion";

const CookiePolicyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl"
    >
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8 mt-20">
        Cookie Policy
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          1. What Are Cookies?
        </h2>
        <p className="text-gray-600 mt-2">
          Cookies are small text files stored on your device when you visit a
          website. They help us enhance your browsing experience by remembering
          preferences and improving website functionality.
        </p>
        <p className="text-gray-600 mt-2">
          These files contain information that helps websites recognize you,
          ensuring a smoother, more personalized interaction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          2. How We Use Cookies
        </h2>
        <p className="text-gray-600 mt-2">
          We use cookies for various purposes, including but not limited to:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>To remember login details and user preferences.</li>
          <li>To analyze website traffic and improve services.</li>
          <li>To personalize content and advertisements.</li>
          <li>To ensure the security and integrity of user accounts.</li>
          <li>To provide social media integration and interactive features.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          3. Types of Cookies We Use
        </h2>
        <p className="text-gray-600 mt-2">
          Our website may use different types of cookies, including:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>
            <strong>Essential Cookies:</strong> These are necessary for website
            functionality, enabling features like account login and security.
          </li>
          <li>
            <strong>Analytical Cookies:</strong> These help us understand how
            users interact with our website, allowing us to enhance the user
            experience.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> These track your browsing
            habits to provide personalized advertisements.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> These remember your
            preferences to enhance your browsing experience.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          4. Managing Cookies
        </h2>
        <p className="text-gray-600 mt-2">
          You have the option to manage cookies through your browser settings.
          Most browsers allow you to block or delete cookies as per your
          preference.
        </p>
        <p className="text-gray-600 mt-2">
          Please note that disabling cookies may affect the functionality of
          certain website features, including personalized settings and secure
          access.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          5. Third-Party Cookies
        </h2>
        <p className="text-gray-600 mt-2">
          Some third-party services we use, such as analytics providers and ad
          networks, may place cookies on your device. These cookies help us
          track performance and deliver relevant content.
        </p>
        <p className="text-gray-600 mt-2">
          We do not have direct control over these cookies, and they are subject
          to the respective third parties’ privacy policies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          6. Your Rights and Choices
        </h2>
        <p className="text-gray-600 mt-2">
          You have the right to control how cookies are used on your device.
          This includes the ability to opt-out of certain tracking cookies and
          modify your settings at any time.
        </p>
        <p className="text-gray-600 mt-2">
          If you wish to learn more about managing your cookie preferences,
          visit your browser's settings or consult the help documentation
          provided by your browser provider.
        </p>
      </section>

      <section className="text-center mt-8">
        <p className="text-gray-700">
          If you have any questions about our Cookie Policy, please contact us
          at{" "}
          <a href="mailto:support@trendmart.com" className="text-blue-500">
            support@trendmart.com
          </a>
          .
        </p>
      </section>
    </motion.div>
  );
};

export default CookiePolicyPage;
