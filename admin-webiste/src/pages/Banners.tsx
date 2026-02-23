import React, { useState } from "react";
import {
  Image,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Link2,
  AlertCircle,
} from "lucide-react";

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  status: "active" | "inactive" | "expired";
  position: "top" | "middle" | "bottom";
  startDate: string;
  endDate: string;
  clicks: number;
  views: number;
}

const Banners: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const banners: Banner[] = [
    {
      id: "BNR001",
      title: "Summer Sale 2024",
      image: "https://images.unsplash.com/photo-1467619004baf-d81a144cda4e?w=800",
      link: "/sale/summer",
      status: "active",
      position: "top",
      startDate: "2024-02-01",
      endDate: "2024-03-31",
      clicks: 1245,
      views: 15000,
    },
    {
      id: "BNR002",
      title: "New Arrivals",
      image: "https://images.unsplash.com/photo-1505228395891-9a51fc651312?w=800",
      link: "/new-arrivals",
      status: "active",
      position: "middle",
      startDate: "2024-02-10",
      endDate: "2024-04-30",
      clicks: 856,
      views: 12000,
    },
    {
      id: "BNR003",
      title: "Flash Deal",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800",
      link: "/deals",
      status: "active",
      position: "bottom",
      startDate: "2024-02-15",
      endDate: "2024-02-29",
      clicks: 567,
      views: 8900,
    },
    {
      id: "BNR004",
      title: "Winter Collection",
      image: "https://images.unsplash.com/photo-1524634126288-917f4a917d4f?w=800",
      link: "/winter",
      status: "inactive",
      position: "top",
      startDate: "2023-12-01",
      endDate: "2024-01-31",
      clicks: 2134,
      views: 25000,
    },
    {
      id: "BNR005",
      title: "Member Exclusive",
      image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800",
      link: "/members",
      status: "expired",
      position: "middle",
      startDate: "2024-01-01",
      endDate: "2024-01-15",
      clicks: 678,
      views: 9500,
    },
  ];

  const filteredBanners = banners.filter((banner) => {
    const matchesPosition =
      filterPosition === "all" || banner.position === filterPosition;
    const matchesStatus = filterStatus === "all" || banner.status === filterStatus;
    return matchesPosition && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "top":
        return "Top Section";
      case "middle":
        return "Middle Section";
      case "bottom":
        return "Bottom Section";
      default:
        return position;
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getClickRate = (clicks: number, views: number) => {
    return ((clicks / views) * 100).toFixed(2);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Banners Management
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Create and manage promotional banners
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Add Banner
        </button>
      </div>

      {/* Add Banner Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest">
            New Banner
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Banner Title
              </label>
              <input
                type="text"
                placeholder="e.g., Summer Sale"
                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Link URL
              </label>
              <input
                type="text"
                placeholder="e.g., /sale/summer"
                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Start Date
              </label>
              <input
                type="date"
                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                End Date
              </label>
              <input
                type="date"
                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
              Banner Image
            </label>
            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center hover:border-black transition-colors cursor-pointer">
              <Image size={24} className="mx-auto text-zinc-400 mb-2" />
              <p className="text-[9px] font-bold">
                Click to upload or drag and drop
              </p>
              <p className="text-[8px] text-zinc-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 rounded-xl border border-zinc-200 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button className="px-6 py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800">
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
              Filter by Position
            </label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
            >
              <option value="all">All Positions</option>
              <option value="top">Top Section</option>
              <option value="middle">Middle Section</option>
              <option value="bottom">Bottom Section</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {filteredBanners.length > 0 ? (
          filteredBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-black transition-colors group"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-56 h-40 bg-zinc-100 overflow-hidden flex-shrink-0">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black text-[11px] uppercase tracking-tighter">
                          {banner.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Link2 size={12} className="text-zinc-400" />
                          <p className="text-[9px] text-zinc-600">{banner.link}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex-shrink-0 ${getStatusColor(
                          banner.status
                        )}`}
                      >
                        {banner.status}
                      </span>
                    </div>

                    {/* Dates and Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-zinc-100">
                      <div>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">
                          Position
                        </p>
                        <p className="text-[9px] font-black">
                          {getPositionLabel(banner.position)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">
                          Start
                        </p>
                        <p className="text-[9px] font-black">
                          {formatDate(banner.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">
                          End
                        </p>
                        <p className="text-[9px] font-black">
                          {formatDate(banner.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">
                          Views
                        </p>
                        <p className="text-[9px] font-black">{banner.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">
                          Click Rate
                        </p>
                        <p className="text-[9px] font-black">
                          {getClickRate(banner.clicks, banner.views)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100">
                    <button className="px-4 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1">
                      <Eye size={12} />
                      Preview
                    </button>
                    <button className="px-4 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1">
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button className="px-4 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 text-red-600">
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
            <Image size={40} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
              No banners found
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
          <p className="text-3xl font-black">{banners.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-green-600 mb-2">
            Active
          </p>
          <p className="text-3xl font-black text-green-600">
            {banners.filter((b) => b.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-2">
            Total Views
          </p>
          <p className="text-3xl font-black text-blue-600">
            {(banners.reduce((sum, b) => sum + b.views, 0) / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-2">
            Total Clicks
          </p>
          <p className="text-3xl font-black text-purple-600">
            {banners.reduce((sum, b) => sum + b.clicks, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banners;
