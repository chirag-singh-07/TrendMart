import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";
import { Badge, HeartIcon, Loader2, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const ProductDetailsPage = () => {
  const { productDetails, fetchProductDetailsById } = useProductStore();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    fetchProductDetailsById(id);
  }, [id, fetchProductDetailsById]);

  if (!productDetails)
    return (
      <div className="text-center py-10 text-lg font-semibold h-screen flex items-center justify-center">
        <Loader2 className="text-lg animate-spin" />
      </div>
    );

  const handleReviewSubmit = () => {
    // if (rating === 0) return toast.error("Please select a rating!");
    // if (!reviewText.trim()) return toast.error("Review cannot be empty!");

    // addReview({ rating, review: reviewText });

    // toast.success("Review added successfully!");
    setReviewText("");
    setRating(0);
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Product Image */}
        <Card className="overflow-hidden rounded-xl shadow-lg">
          <CardContent className="p-0">
            <img
              src={productDetails.image}
              alt={productDetails.title}
              className="w-full h-[500px] object-cover"
            />
          </CardContent>
        </Card>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl font-bold">{productDetails.title}</h1>
          <p className="text-gray-500 text-sm">
            Category:{" "}
            <span className="font-semibold">{productDetails.category}</span> |
            Brand: <span className="font-semibold">{productDetails.brand}</span>
          </p>

          {/* Badge Section */}
          <div className="flex space-x-2">
            {productDetails.isBestSeller && (
              <Badge className="bg-yellow-500 text-white">Best Seller</Badge>
            )}
            {productDetails.isTrending && (
              <Badge className="bg-red-500 text-white">Trending</Badge>
            )}
            {productDetails.isFeature && (
              <Badge className="bg-blue-500 text-white">Featured</Badge>
            )}
          </div>

          {/* Price & Stock */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-red-500">
              ${productDetails.salePrice || productDetails.price}
            </span>
            {productDetails.salePrice && (
              <span className="text-gray-500 line-through text-lg">
                ${productDetails.price}
              </span>
            )}
          </div>
          <p
            className={`text-lg ${
              productDetails.totalStock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {productDetails.totalStock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button className="w-full">
              <ShoppingBag />
              Add to Cart
            </Button>
            <Button className="w-full">
              <HeartIcon />
              Add to WishList
            </Button>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-10 border-t border-b">
        <h2 className="text-2xl font-bold mb-4 mt-4">Product Description</h2>
        <p className="text-gray-700 text-sm mb-10">
          {productDetails.description}
        </p>
      </div>

      {/* ⭐ Reviews & Ratings Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {productDetails.reviews.length > 0 ? (
          productDetails.reviews.map((review, index) => (
            <Card key={index} className="mb-4 p-4">
              <div className="flex items-center space-x-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-800 mt-2">{review.review}</p>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>

      {/* 📝 Write a Review */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Write a Review</h2>
        <div className="flex space-x-2 mt-3">
          {Array.from({ length: 5 }).map((_, index) =>
            rating > index ? (
              <AiFillStar
                key={index}
                className="text-yellow-500 cursor-pointer"
                size={24}
                onClick={() => setRating(index + 1)}
              />
            ) : (
              <AiOutlineStar
                key={index}
                className="text-gray-300 cursor-pointer"
                size={24}
                onClick={() => setRating(index + 1)}
              />
            )
          )}
        </div>
        <Textarea
          className="mt-3"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <Button
          onClick={handleReviewSubmit}
          className="mt-3 bg-green-600 hover:bg-green-700"
        >
          Submit Review
        </Button>
      </div>

      {/* <div>
        <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 gap-8">
          {productDetails.map((relatedProduct, index) => (
            <Card key={index} className="shadow-lg rounded-xl">
              <CardContent className="p-4">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.title}
                  className="w-full h-[200px] object-cover"
                />
                <h3 className="text-xl font-bold mt-2">
                  {relatedProduct.title}
                </h3>
                <p className="text-gray-700 text-sm">
                  Category: {relatedProduct.category}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}
    </motion.div>
  );
};

export default ProductDetailsPage;
