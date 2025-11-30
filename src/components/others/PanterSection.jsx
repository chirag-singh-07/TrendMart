import { FaStore, FaTruck, FaWallet, FaCheckCircle } from "react-icons/fa";

const PartnerSection = () => {
  return (
    <section className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800">Sell on TrendMart</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Join thousands of sellers and grow your business with TrendMart.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
          <FaStore className="text-blue-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold">Create Your Store</h3>
          <p className="text-gray-600 text-center">
            Set up your online shop in minutes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
          <FaTruck className="text-green-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold">Easy Shipping</h3>
          <p className="text-gray-600 text-center">
            We handle the delivery for you.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
          <FaWallet className="text-yellow-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold">Secure Payments</h3>
          <p className="text-gray-600 text-center">
            Get paid fast and securely.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
          <FaCheckCircle className="text-purple-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold">Trusted Marketplace</h3>
          <p className="text-gray-600 text-center">
            Millions of customers are waiting.
          </p>
        </div>
      </div>

      <div className="text-center mt-10">
        <a href="https://trendmart-vendors.netlify.app" target="_blank">
          {" "}
          <button className="bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md">
            Start Selling Now
          </button>
        </a>
      </div>
    </section>
  );
};

export default PartnerSection;
