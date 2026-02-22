import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
  Minus,
  Plus,
} from "lucide-react";
import { products, type Product } from "../data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const found = products.find((p) => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        window.scrollTo(0, 0);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl font-black">Loading...</div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb / Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-transparent -ml-4 text-muted-foreground hover:text-foreground group"
        >
          <ChevronLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to browsing
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-24">
          {/* Left: Image Gallery (Static for now) */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3rem] bg-[#F7F7F7] ring-1 ring-black/5">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {product.discount > 0 && (
                <Badge className="absolute top-8 left-8 bg-black text-white px-4 py-2 text-xs font-bold rounded-full border-none">
                  {product.discount}% OFF
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-8 right-8 h-12 w-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl transition-all border-none ${isLiked ? "text-red-500" : "text-foreground"}`}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </Button>
            </div>

            {/* Thumbnails (Simulated) */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl overflow-hidden cursor-pointer ring-2 transition-all ${i === 0 ? "ring-black" : "ring-transparent hover:ring-black/20 opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={product.image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight uppercase whitespace-pre-wrap">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full">
                    <Star size={14} fill="white" />
                    <span className="text-xs font-bold">{product.rating}</span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {product.reviewCount} Certified Reviews
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xl md:text-2xl text-muted-foreground line-through opacity-40 font-semibold decoration-2">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-widest">
                  Inclusive of all taxes
                </p>
              </div>

              <Separator className="opacity-50" />

              {/* Size Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Select Size
                  </span>
                  <Button
                    variant="link"
                    className="text-xs font-bold uppercase tracking-widest p-0 h-auto"
                  >
                    Size Guide
                  </Button>
                </div>
                <div className="flex gap-3">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-2xl font-bold text-sm border-2 transition-all ${selectedSize === size ? "bg-black text-white border-black shadow-xl scale-105" : "bg-transparent text-foreground border-border hover:border-black/20"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center justify-between bg-muted/50 rounded-2xl h-16 px-6 sm:w-40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-lg font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <Button className="h-16 flex-grow rounded-2xl bg-black text-white hover:bg-primary transition-all shadow-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-[0.1em] border-none group">
                  <ShoppingCart
                    size={20}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Add to Shopping Cart
                </Button>
              </div>

              {/* USP List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-3xl bg-muted/30">
                  <ShieldCheck className="text-primary" size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Original & Authentic
                  </span>
                </div>
                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-3xl bg-muted/30">
                  <Truck className="text-primary" size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Free Express Shipping
                  </span>
                </div>
                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-3xl bg-muted/30">
                  <RotateCcw className="text-primary" size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    14 Days Easy Return
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-12 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Product Details
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Experience the perfect blend of modern aesthetics and
                  unparalleled craftsmanship. This item is part of our TrendMart
                  signature collection, designed for those who appreciate
                  limited edition fashion and premium materials. Every detail is
                  meticulously refined to ensure you stand out with effortless
                  elegance.
                </p>
                <ul className="grid grid-cols-2 gap-y-3 gap-x-8 pt-4">
                  {[
                    "Premium Cotton Blend",
                    "Precision Stitching",
                    "Exclusive Colorway",
                    "Reinforced Silhouette",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                    >
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b pb-6 border-border/40">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase italic">
              You Might Also <span className="text-primary">Like</span>
            </h2>
            <Button
              variant="link"
              className="font-bold uppercase tracking-widest text-xs p-0 h-auto"
            >
              View Collection
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
