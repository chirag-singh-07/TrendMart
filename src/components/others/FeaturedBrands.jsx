import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const brandLogos = {
  adidas: "/logos/adidas.svg",
  nike: "/logos/nike.svg",
  puma: "/logos/puma.svg",
  reebok: "/logos/reebok.svg",
  vans: "/logos/vans.svg",
  levi: "/logos/levis.svg",
  zara: "/logos/zara.svg",
  other: "/logos/other.svg",
};

const brands = [
  { id: "adidas", name: "Adidas" },
  { id: "nike", name: "Nike" },
  { id: "puma", name: "Puma" },

  { id: "levi", name: "Levi's" },

  //   { id: "other", name: "Other" },
];

const FeaturedBrands = () => {
  return (
    <motion.div
      className=" mx-auto px-4 md:px-6 py-12 bg-white text-black"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-center mb-10">Featured Brands</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            className="flex flex-col items-center p-6  rounded-2xl  hover:shadow-2xl transition duration-300"
          >
            <CardContent className="flex flex-col items-center">
              <img
                src={brandLogos[brand.id]}
                alt={brand.name}
                className="w-20 h-20 object-contain"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-800 sr-only">
                {brand.name}
              </h3>
              {/* <Badge className="mt-2 bg-gray-300 text-black px-3 py-1 rounded-full text-sm">
                Trending
              </Badge> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedBrands;
