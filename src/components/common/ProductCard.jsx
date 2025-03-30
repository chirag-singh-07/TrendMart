import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

const ProductCard = ({ product, handleProductDetails }) => {
  // fetch the all products

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.salePrice > 0 ? (
            <Badge
              className={`absolute top-2 left-2 bg-green-400 hover:bg-green-600 text-black font-bold`}
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
          <CardFooter className=" bottom-0 ">
            <Button
              className="w-full"
              onClick={() => handleProductDetails(product?._id)}
            >
              View Details
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
