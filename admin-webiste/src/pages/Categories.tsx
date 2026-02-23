import React, { useState } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  ChevronRight,
  Package,
  AlertCircle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  products: number;
  image: string;
  parent?: string;
  status: "active" | "inactive";
}

const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const categories: Category[] = [
    {
      id: "CAT001",
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and gadgets",
      products: 156,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      status: "active",
    },
    {
      id: "CAT002",
      name: "Apparel",
      slug: "apparel",
      description: "Clothing and fashion items",
      products: 342,
      image: "https://images.unsplash.com/photo-1489987046614-102ee263e936?w=400",
      status: "active",
    },
    {
      id: "CAT003",
      name: "Accessories",
      slug: "accessories",
      description: "Bags, belts, and other accessories",
      products: 89,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
      status: "active",
    },
    {
      id: "CAT004",
      name: "Footwear",
      slug: "footwear",
      description: "Shoes and footwear items",
      products: 124,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      status: "active",
    },
    {
      id: "CAT005",
      name: "Sports",
      slug: "sports",
      description: "Sports equipment and gear",
      products: 67,
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
      status: "inactive",
    },
  ];

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || category.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.slug) {
      setShowAddForm(false);
      setNewCategory({ name: "", slug: "", description: "" });
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Categories Management
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Create and organize product categories
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest">
            New Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="e.g., Electronics"
                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Slug
              </label>
              <input
                type="text"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder="e.g., electronics"
                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
              Description
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              placeholder="Category description..."
              className="w-full h-24 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 rounded-xl border border-zinc-200 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="px-6 py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
              Search Categories
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
                placeholder="Search by name or description..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black focus:bg-white text-[10px] font-bold"
              />
            </div>
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
            </select>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-black transition-colors group"
            >
              {/* Image */}
              <div className="relative h-40 bg-zinc-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div
                  className={`absolute top-3 right-3 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(
                    category.status
                  )}`}
                >
                  {category.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                    {category.slug}
                  </p>
                  <h3 className="font-black text-[11px] uppercase tracking-tighter mt-1">
                    {category.name}
                  </h3>
                </div>

                <p className="text-[9px] text-zinc-600 line-clamp-2">
                  {category.description}
                </p>

                {/* Products Count */}
                <div className="flex items-center gap-2 py-3 border-y border-zinc-100">
                  <Package size={14} className="text-zinc-400" />
                  <p className="text-[9px] font-bold text-zinc-600">
                    {category.products} products
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
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
            <Layers size={40} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
              No categories found
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">
            Total
          </p>
          <p className="text-3xl font-black">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-green-600 mb-2">
            Active
          </p>
          <p className="text-3xl font-black text-green-600">
            {categories.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">
            Inactive
          </p>
          <p className="text-3xl font-black">
            {categories.filter((c) => c.status === "inactive").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-2">
            Products
          </p>
          <p className="text-3xl font-black text-blue-600">
            {categories.reduce((sum, c) => sum + c.products, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Categories;
