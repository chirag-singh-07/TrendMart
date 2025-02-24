export const sortOptions = [
  { id: 1, label: "Price: Low to High" },
  { id: 2, label: "Price: High to Low" },
  { id: 3, label: "Rating: High to Low" },
  { id: 4, label: "Rating: Low to High" },
];

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

export const paginationOptions = [
  { id: 10, label: "10 per page" },
  { id: 20, label: "20 per page" },
  { id: 30, label: "30 per page" },
  { id: 40, label: "40 per page" },
];

export const filterOptions = {
  Category: [
    {
      id: "men",
      label: "Men",
    },
    {
      id: "women",
      label: "Women",
    },
    {
      id: "kids",
      label: "Kids",
    },
    {
      id: "accessories",
      label: "Accessories",
    },
    {
      id: "footwear",
      label: "Footwear",
    },
  ],

  Brand: [
    {
      id: "adidas",
      label: "Adidas",
    },
    {
      id: "nike",
      label: "Nike",
    },
    {
      id: "puma",
      label: "Puma",
    },
    {
      id: "reebok",
      label: "Reebok",
    },
    {
      id: "vans",
      label: "Vans",
    },
    {
      id: "levi",
      label: "Levi's",
    },
    {
      id: "zara",
      label: "Zara",
    },
    {
      id: "other",
      label: "Other",
    },
  ],
};
