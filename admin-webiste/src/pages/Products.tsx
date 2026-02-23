import React, { useState } from "react";
import {
  Box,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "out-of-stock";
  rating: number;
  reviews: number;
  image: string;
}

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const products: Product[] = [
    {
      id: "PRD001",
      name: "Wireless Headphones",
      category: "Electronics",
      price: 2499,
      stock: 45,
      status: "active",
      rating: 4.5,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    },
    {
      id: "PRD002",
      name: "Smart Watch",
      category: "Electronics",
      price: 4999,
      stock: 12,
      status: "active",
      rating: 4.2,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    },
    {
      id: "PRD003",
      name: "Cotton T-Shirt",
      category: "Apparel",
      price: 599,
      stock: 0,
      status: "out-of-stock",
      rating: 3.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1592862471733-74474b2145ac?w=400",
    },
    {
      id: "PRD004",
      name: "Leather Wallet",
      category: "Accessories",
      price: 1299,
      stock: 78,
      status: "active",
      rating: 4.6,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1627123234116-9b549dfb183b?w=400",
    },
    {
      id: "PRD005",
      name: "Running Shoes",
      category: "Footwear",
      price: 3499,
      stock: 5,
      status: "active",
      rating: 4.3,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "out-of-stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.3) return "text-green-600";
    if (rating >= 3.8) return "text-yellow-600";
    return "text-red-600";
  };

  const isLowStock = (stock: number) => stock > 0 && stock <= 10;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Products Management
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Manage inventory, pricing, and product details
          </p>
        </div>
        <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 w-fit">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
              Search Products
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black focus:bg-white text-[10px] font-bold"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {filteredProducts.some((p) => isLowStock(p.stock)) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-yellow-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="font-black text-[10px] uppercase tracking-widest text-yellow-900">
              Low stock alert
            </p>
            <p className="text-[9px] text-yellow-800 mt-1">
              {filteredProducts.filter((p) => isLowStock(p.stock)).length}{" "}
              products have low stock levels
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-black transition-colors group"
            >
              {/* Image */}
              <div className="relative h-40 bg-zinc-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {isLowStock(product.stock) && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest">
                    Low Stock
                  </div>
                )}
                {product.status === "out-of-stock" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                  {product.category}
                </p>
                <h3 className="font-black text-[10px] uppercase tracking-tighter line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <span className={`font-black text-[10px] ${getRatingColor(product.rating)}`}>
                    ⭐ {product.rating}
                  </span>
                  <span className="text-[8px] text-zinc-500">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price and Stock */}
                <div className="flex items-center justify-between">
                  <p className="font-black text-[11px]">₹{product.price}</p>
                  <p className="text-[9px] text-zinc-500">
                    Stock: {product.stock}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full inline-block ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                  <button className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1">
                    <Eye size={12} />
                    View
                  </button>
                  <button className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1">
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-red-600">
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
              No products found
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Box size={20} className="text-zinc-600" />
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
              Total Products
            </p>
          </div>
          <p className="text-2xl font-black">{products.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-yellow-600" />
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
              Low Stock
            </p>
          </div>
          <p className="text-2xl font-black text-yellow-600">
            {products.filter((p) => isLowStock(p.stock)).length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Layers size={20} className="text-red-600" />
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
              Out of Stock
            </p>
          </div>
          <p className="text-2xl font-black text-red-600">
            {products.filter((p) => p.status === "out-of-stock").length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Products;
