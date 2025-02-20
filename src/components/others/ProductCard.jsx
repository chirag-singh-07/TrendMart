import { Button } from "../ui/button";

const ProductCard = ({ title, desc, price }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg">
      <img
        alt={title}
        className="object-cover w-full h-60"
        height="240"
        src="https://placehold.co/240x360"
        width="360"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600">${price}</p>
        <Button className="w-full mt-4">Add to Cart</Button>
      </div>
    </div>
  );
};

export default ProductCard;
