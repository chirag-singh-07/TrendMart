import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Category from "../product/models/category.model.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const categories = [
  {
    name: "Electronics",
    description:
      "High-performance gadgets, communication devices, and computing hardware.",
    slug: "electronics",
    level: 0,
    displayOrder: 1,
    subcategories: [
      {
        name: "Smartphones",
        slug: "smartphones",
        level: 1,
        description: "Latest flagship and budget mobile devices.",
      },
      {
        name: "Laptops",
        slug: "laptops",
        level: 1,
        description: "Professional, gaming, and ultra-portable computing.",
      },
      {
        name: "Smart Watches",
        slug: "smart-watches",
        level: 1,
        description: "Wearable technology and fitness trackers.",
      },
      {
        name: "Audio & Headphones",
        slug: "audio-headphones",
        level: 1,
        description: "Noise-cancelling, wireless, and studio-grade audio.",
      },
      {
        name: "Cameras",
        slug: "cameras",
        level: 1,
        description: "DSLR, mirrorless, and action photography gear.",
      },
      {
        name: "Gaming Consoles",
        slug: "gaming-consoles",
        level: 1,
        description: "Next-gen gaming systems and accessories.",
      },
      {
        name: "Monitors",
        slug: "monitors",
        level: 1,
        description: "4K, Gaming, and Professional displays.",
      },
      { name: "Printers & Scanners", slug: "printers-scanners", level: 1 },
      {
        name: "Storage Devices",
        slug: "storage-devices",
        level: 1,
        description: "SSDs, HDDs, and Flash drives.",
      },
      {
        name: "Electronics Accessories",
        slug: "electronics-accessories",
        level: 1,
        description: "Chargers, cables, case protection, and peripherals.",
      },
    ],
  },
  {
    name: "Fashion",
    description:
      "Trend-setting apparel, heritage footwear, and luxury accessories.",
    slug: "fashion",
    level: 0,
    displayOrder: 2,
    subcategories: [
      {
        name: "Men's Apparel",
        slug: "mens-wear",
        level: 1,
        description: "Formal, casual, and athletic wear for men.",
      },
      {
        name: "Women's Apparel",
        slug: "womens-wear",
        level: 1,
        description: "Designer dresses, tops, and high-fashion essentials.",
      },
      {
        name: "Boys Fashion",
        slug: "boys-fashion",
        level: 1,
        description: "Comfortable and stylish clothes for boys.",
      },
      {
        name: "Girls Fashion",
        slug: "girls-fashion",
        level: 1,
        description: "Trendy outfits and accessories for girls.",
      },
      {
        name: "Footwear",
        slug: "footwear",
        level: 1,
        description: "Sneakers, boots, and formal shoes.",
      },
      {
        name: "Watches & Jewelry",
        slug: "jewelry-watches",
        level: 1,
        description: "Luxury timepieces and fine ornaments.",
      },
      {
        name: "Bags & Luggage",
        slug: "bags-luggage",
        level: 1,
        description: "Travel gear, backpacks, and designer handbags.",
      },
      {
        name: "Eyewear",
        slug: "eyewear",
        level: 1,
        description: "Sunglasses and spectacle frames.",
      },
      { name: "Lingerie & Sleepwear", slug: "lingerie-sleepwear", level: 1 },
    ],
  },
  {
    name: "Home & Kitchen",
    description:
      "Premium interior essentials, culinary tools, and modern furniture.",
    slug: "home-kitchen",
    level: 0,
    displayOrder: 3,
    subcategories: [
      {
        name: "Kitchen Appliances",
        slug: "kitchen-appliances",
        level: 1,
        description: "Smart ovens, blenders, and coffee machines.",
      },
      {
        name: "Furniture",
        slug: "furniture",
        level: 1,
        description: "Living room, bedroom, and office setups.",
      },
      {
        name: "Home Decor",
        slug: "home-decor",
        level: 1,
        description: "Wall art, lighting, and decorative accents.",
      },
      {
        name: "Bedding & Bath",
        slug: "bedding-bath",
        level: 1,
        description: "Luxury linens and bathroom essentials.",
      },
      {
        name: "Garden & Outdoor",
        slug: "garden-outdoor",
        level: 1,
        description: "Patio furniture and landscaping tools.",
      },
      {
        name: "Storage & Organization",
        slug: "storage-organization",
        level: 1,
        description: "Closet systems and kitchen storage.",
      },
      {
        name: "Smart Home",
        slug: "smart-home",
        level: 1,
        description: "Security cameras, smart plugs, and lighting.",
      },
      { name: "Tools & Utility", slug: "home-tools", level: 1 },
    ],
  },
  {
    name: "Beauty & Health",
    description:
      "Curated skincare, professional makeup, and holistic wellness.",
    slug: "beauty-health",
    level: 0,
    displayOrder: 4,
    subcategories: [
      {
        name: "Skincare",
        slug: "skincare",
        level: 1,
        description: "Serums, moisturizers, and sun protection.",
      },
      {
        name: "Makeup",
        slug: "makeup",
        level: 1,
        description: "Professional-grade cosmetics for face and eyes.",
      },
      {
        name: "Hair Care",
        slug: "hair-care",
        level: 1,
        description: "Shampoo, styling tools, and treatments.",
      },
      {
        name: "Fragrances",
        slug: "fragrances",
        level: 1,
        description: "Luxury perfumes and colognes.",
      },
      {
        name: "Wellness & Supplements",
        slug: "wellness-supplements",
        level: 1,
        description: "Vitamins, protein, and health monitoring.",
      },
      {
        name: "Personal Care",
        slug: "personal-care",
        level: 1,
        description: "Oral care, grooming, and hygiene.",
      },
      { name: "Ayurvedic & Natural", slug: "ayurvedic-natural", level: 1 },
    ],
  },
  {
    name: "Sports & Outdoors",
    description:
      "Professional athletic gear, fitness equipment, and adventure essentials.",
    slug: "sports-outdoors",
    level: 0,
    displayOrder: 5,
    subcategories: [
      {
        name: "Fitness & Gym",
        slug: "fitness-gym",
        level: 1,
        description: "Weightlifting, yoga, and cardio equipment.",
      },
      {
        name: "Outdoor Adventure",
        slug: "outdoor-adventure",
        level: 1,
        description: "Camping, hiking, and climbing gear.",
      },
      {
        name: "Cycling",
        slug: "cycling",
        level: 1,
        description: "Bicycles and protective performance gear.",
      },
      {
        name: "Team Sports",
        slug: "team-sports",
        level: 1,
        description: "Cricket, football, and basketball equipment.",
      },
      { name: "Swimming", slug: "swimming", level: 1 },
      { name: "Martial Arts", slug: "martial-arts", level: 1 },
    ],
  },
  {
    name: "Grocery & Gourmet",
    description:
      "Organic fresh produce, daily pantry needs, and artisanal food.",
    slug: "grocery",
    level: 0,
    displayOrder: 6,
    subcategories: [
      {
        name: "Fruits & Vegetables",
        slug: "fruits-veggies",
        level: 1,
        description: "Farm-fresh organic produce.",
      },
      {
        name: "Snacks & Confectionery",
        slug: "snacks",
        level: 1,
        description: "Chocolates, chips, and healthy bites.",
      },
      {
        name: "Beverages",
        slug: "beverages",
        level: 1,
        description: "Cold-pressed juices, tea, and coffee.",
      },
      {
        name: "Breakfast & Dairy",
        slug: "breakfast-dairy",
        level: 1,
        description: "Milk, cereals, and organic eggs.",
      },
      {
        name: "Staples & Spices",
        slug: "staples-spices",
        level: 1,
        description: "Rice, pulses, and authentic spices.",
      },
      { name: "Frozen Foods", slug: "frozen-foods", level: 1 },
      { name: "Gourmet Selection", slug: "gourmet", level: 1 },
    ],
  },
  {
    name: "Appliances",
    description: "Large heavy-duty appliances for modern home efficiency.",
    slug: "appliances",
    level: 0,
    displayOrder: 7,
    subcategories: [
      { name: "Refrigerators", slug: "refrigerators", level: 1 },
      { name: "Washing Machines", slug: "washing-machines", level: 1 },
      { name: "Air Conditioners", slug: "air-conditioners", level: 1 },
      { name: "Televisions", slug: "televisions", level: 1 },
      { name: "Microwaves", slug: "microwaves", level: 1 },
    ],
  },
  {
    name: "Books & Media",
    description:
      "Global literature, educational resources, and entertainment media.",
    slug: "books-media",
    level: 0,
    displayOrder: 8,
    subcategories: [
      { name: "Fiction Books", slug: "fiction-books", level: 1 },
      { name: "Non-Fiction Books", slug: "non-fiction-books", level: 1 },
      {
        name: "Academic & Professional Books",
        slug: "educational-books",
        level: 1,
      },
      { name: "Comics & Manga", slug: "comics-manga", level: 1 },
      { name: "Music & Movies", slug: "music-movies", level: 1 },
    ],
  },
  {
    name: "Toys & Baby Care",
    description:
      "Developmental toys and essential care for infants and children.",
    slug: "toys-baby-care",
    level: 0,
    displayOrder: 9,
    subcategories: [
      {
        name: "Baby Gear",
        slug: "baby-gear",
        level: 1,
        description: "Strollers, car seats, and carriers.",
      },
      { name: "Baby Grooming", slug: "baby-grooming", level: 1 },
      { name: "Educational Toys", slug: "educational-toys", level: 1 },
      { name: "Board Games & Puzzles", slug: "board-games", level: 1 },
      { name: "Action Figures", slug: "action-figures", level: 1 },
    ],
  },
  {
    name: "Automotive",
    description:
      "Premium vehicle accessories, performance parts, and maintenance tools.",
    slug: "automotive",
    level: 0,
    displayOrder: 10,
    subcategories: [
      { name: "Car Accessories", slug: "car-accessories", level: 1 },
      { name: "Bike Accessories", slug: "bike-accessories", level: 1 },
      { name: "Vehicle Maintenance & Care", slug: "car-care", level: 1 },
      { name: "Tires & Wheels", slug: "tires-wheels", level: 1 },
      { name: "Auto Electronics", slug: "auto-electronics", level: 1 },
    ],
  },
  {
    name: "Pet Supplies",
    description: "Premium nutrition and care products for all domestic pets.",
    slug: "pet-supplies",
    level: 0,
    displayOrder: 11,
    subcategories: [
      { name: "Dog Supplies", slug: "dog-supplies", level: 1 },
      { name: "Cat Supplies", slug: "cat-supplies", level: 1 },
      {
        name: "Fish & Aquatic Accessories",
        slug: "aquatic-supplies",
        level: 1,
      },
      { name: "Bird Supplies", slug: "bird-supplies", level: 1 },
    ],
  },
  {
    name: "Industrial & Office",
    description:
      "Enterprise solutions, office supplies, and industrial equipment.",
    slug: "industrial-office",
    level: 0,
    displayOrder: 12,
    subcategories: [
      { name: "Office Stationery", slug: "office-stationery", level: 1 },
      { name: "Industrial & Power Tools", slug: "industrial-tools", level: 1 },
      { name: "Lab & Scientific Equipment", slug: "lab-equipment", level: 1 },
      {
        name: "Packing & Shipping Materials",
        slug: "packing-materials",
        level: 1,
      },
    ],
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Authenticated with MongoDB Cluster");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("🗑️  Purged legacy taxonomy registry.");

    const usedNames = new Set();

    for (const catData of categories) {
      const { subcategories, ...rootData } = catData;

      if (usedNames.has(rootData.name)) {
        console.warn(`⚠️ Skipping duplicate root category: ${rootData.name}`);
        continue;
      }
      usedNames.add(rootData.name);

      const rootCat = await Category.create(rootData);
      console.log(`🌿 Root Entity Synchronized: ${rootCat.name}`);

      if (subcategories && subcategories.length > 0) {
        for (const subData of subcategories) {
          if (usedNames.has(subData.name)) {
            console.warn(
              `   ⚠️ Skipping duplicate subcategory: ${subData.name}`,
            );
            continue;
          }
          usedNames.add(subData.name);

          await Category.create({
            ...subData,
            parentCategoryId: rootCat._id,
          });
          console.log(`   └─ Sub-Node Created: ${subData.name}`);
        }
      }
    }

    console.log("✨ Global Category Taxonomy Seeding Completed Successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Critical Seeding Error:", error);
    process.exit(1);
  }
}

seed();
