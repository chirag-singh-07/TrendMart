import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

export const product = {
  id: 1,
  title: "Sneakers",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel turpis vel massa consectetur volutpat.",
  price: 199.99,
  salePrice: 150,
  rating: 4.5,
  image: "https://picsum.photos/id/237/200/300",
  colors: ["Black", "White", "Red", "Blue"],
  sizes: ["S", "M", "L", "XL"],
  quantity: 100,
  sold: 50,
  category: "footwear",
  brand: "Nike",
};

const ProductCard = () => {

  // fetch the all products 

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product.salePrice > 0 ? (
            <Badge
              className={`absolute top-2 left-2 bg-green-400 hover:bg-green-600`}
            >
              Sale
            </Badge>
          ) : null}
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {product?.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {product?.brand}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span
                className={`text-lg font-semibold text-primary ${
                  product?.salePrice > 0 ? "line-through" : " "
                }   `}
              >
                ${product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="text-lg font-semibold text-primary">
                  ${product?.salePrice}
                </span>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="">
            <Button className="w-full">Add to Cart</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
