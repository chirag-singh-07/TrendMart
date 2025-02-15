import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-2xl"
    >
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-12 mt-20">
        About Us
      </h1>

      {/* Our Story */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Our Story</h2>
        <p className="text-gray-600 mt-4">
          TrendMart started with a simple idea – to provide high-quality,
          stylish, and affordable clothing to fashion-conscious individuals. Our
          journey began in 2022, when a group of passionate entrepreneurs saw a
          gap in the market for a seamless shopping experience that blends
          fashion, affordability, and sustainability. Since then, we have
          evolved into a trusted brand, offering a diverse range of products
          catering to different styles and preferences.
        </p>
      </section>

      {/* Our Mission & Vision */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          Our Mission & Vision
        </h2>
        <p className="text-gray-600 mt-4">
          Our mission is to redefine online shopping by offering trendy,
          high-quality apparel that resonates with every personality. We believe
          in fostering inclusivity, affordability, and sustainability. Our
          vision is to become a globally recognized fashion platform where style
          meets innovation, and customers feel empowered through their clothing
          choices.
        </p>
      </section>

      {/* Our Values */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Our Values</h2>
        <ul className="list-disc ml-6 mt-4 text-gray-600">
          <li>
            <strong>Quality:</strong> Every product we offer is made with
            premium materials.
          </li>
          <li>
            <strong>Customer-Centric:</strong> We prioritize our customers’
            needs.
          </li>
          <li>
            <strong>Sustainability:</strong> Ethical production and eco-friendly
            packaging.
          </li>
          <li>
            <strong>Innovation:</strong> Always evolving with the latest trends.
          </li>
        </ul>
      </section>

      {/* Why Choose Us? */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Why Choose Us?</h2>
        <p className="text-gray-600 mt-4">
          With thousands of brands in the market, TrendMart stands out due to
          our <b>uncompromising quality,affordable prices,</b> and
          <b>customer-focused approach</b>. We offer <b>exclusive designs</b>, a
          seamless shopping experience, and a hassle-free return policy to
          ensure customer satisfaction.
        </p>
      </section>

      {/* Meet Our Team */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Meet Our Team</h2>
        <p className="text-gray-600 mt-4">
          Our team consists of{" "}
          <b>
            passionate designers, dedicated customer support representatives,
            and innovative marketers
          </b>{" "}
          who work tirelessly to bring you the best shopping experience.
        </p>
      </section>

      {/* Our Achievements */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          Our Achievements
        </h2>
        <p className="text-gray-600 mt-4">
          Over the years, TrendMart has received multiple awards for excellence
          in e-commerce and customer service. With{" "}
          <b>over 1 million happy customers</b>, we continue to set new
          standards in the fashion industry.
        </p>
      </section>

      {/* Customer Testimonials */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          Customer Testimonials
        </h2>
        <p className="text-gray-600 mt-4">
          Here’s what our customers have to say:
        </p>
        <ul className="list-disc ml-6 mt-4 text-gray-600">
          <li>
            {`"TrendMart has changed the way I shop for clothes! The quality is
            unbeatable!" – Ayesha K`}
            .
          </li>
          <li>
            {`"Fast delivery, great prices, and top-notch customer service!" –
            Rahul P.`}
          </li>
          <li>
            {`"I love how they focus on sustainability. Shopping guilt-free!" –
            Neha M.`}
          </li>
        </ul>
      </section>

      {/* Sustainability & Social Responsibility */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          Sustainability & Social Responsibility
        </h2>
        <p className="text-gray-600 mt-4">
          We believe in ethical business practices and{" "}
          <strong>sustainable production .</strong> TrendMart is committed to
          reducing its carbon footprint by using{" "}
          <b>
            eco-friendly packaging, sustainable fabrics, and fair labor policies
          </b>
          .
        </p>
      </section>

      {/* Careers & Opportunities */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          Careers & Opportunities
        </h2>
        <p className="text-gray-600 mt-4">
          Looking to join a dynamic, fast-growing company? We’re always on the
          lookout for <b>creative minds and dedicated professionals</b> . Check
          out our{" "}
          <a href="/careers" className="text-blue-500">
            Careers
          </a>{" "}
          page for open positions.
        </p>
      </section>

      {/* Contact Us */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Contact Us</h2>
        <p className="text-gray-600 mt-4">
          Have any questions? Reach out to us at{" "}
          <a href="mailto:support@trendmart.com" className="text-blue-500">
            support@trendmart.com
          </a>
          .
        </p>
      </section>
    </motion.div>
  );
};

export default AboutPage;
