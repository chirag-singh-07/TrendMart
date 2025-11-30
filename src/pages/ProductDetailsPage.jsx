import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";
import { HeartIcon, Loader2, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";

const ProductDetailsPage = () => {
  const { productDetails, fetchProductDetailsById, isLoading, error } =
    useProductStore();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const { id } = useParams();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (id) fetchProductDetailsById(id);
  }, [id, fetchProductDetailsById]);

  const handleAddToCart = () => {
    // Add product to cart logic goes here
    addToCart(productDetails?._id, 1);
    // console.log("id", productDetails._id);
    // alert("Product added to cart!");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-white text-black">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );

  if (!productDetails || error)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-black bg-white">
        Product not found.
      </div>
    );

  const handleReviewSubmit = () => {
    if (rating === 0) return alert("Please select a rating!");
    if (!reviewText.trim()) return alert("Review cannot be empty!");
    alert("Review added successfully!");
    setReviewText("");
    setRating(0);
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 md:px-6 py-12 bg-white text-black"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card className="overflow-hidden rounded-xl shadow-lg bg-gray-100">
          <CardContent className="p-0">
            <img
              src={productDetails.image}
              alt={productDetails.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </CardContent>
        </Card>

        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl font-bold">{productDetails.title}</h1>
          <p className="text-gray-600 text-sm">
            {productDetails.description.slice(0, 100)}...
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Category:</span>{" "}
            {productDetails.category} |
            <span className="font-semibold"> Brand:</span>{" "}
            {productDetails.brand}
          </p>

          <div className="flex flex-wrap gap-2">
            {productDetails.isBestSeller && <Badge>Best Seller</Badge>}
            {productDetails.isTrending && <Badge>Trending</Badge>}
            {productDetails.isFeature && <Badge>Featured</Badge>}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-black">
              ${productDetails.salePrice || productDetails.price}
            </span>
            {productDetails.salePrice && (
              <span className="text-gray-500 line-through text-lg">
                ${productDetails.price}
              </span>
            )}
          </div>
          <p
            className={`text-lg font-semibold ${
              productDetails.totalStock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {productDetails.totalStock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              <ShoppingBag size={20} /> Add to Cart
            </Button>
            <Button className="w-full bg-gray-300 hover:bg-gray-400 text-black">
              <HeartIcon size={20} /> Wishlist
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-300 pt-6  border-b">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <p className="text-gray-600 text-sm mb-8">
          {productDetails.description}
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {productDetails.reviews.length > 0 ? (
          productDetails.reviews.map((review, index) => (
            <Card key={index} className="mb-4 p-4 bg-gray-100">
              <div className="flex items-center space-x-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 mt-2">{review.review}</p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Write a Review</h2>
        <div className="flex space-x-2 mt-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              onClick={() => setRating(index + 1)}
              className="cursor-pointer"
            >
              {rating > index ? (
                <AiFillStar className="text-yellow-500" size={24} />
              ) : (
                <AiOutlineStar className="text-gray-500" size={24} />
              )}
            </span>
          ))}
        </div>
        <Textarea
          className="mt-3 bg-gray-100 text-black border-gray-300"
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <Button onClick={handleReviewSubmit} className="mt-3 ">
          Submit Review
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;
