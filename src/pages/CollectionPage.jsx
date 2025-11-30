import ProductCard from "@/components/common/ProductCard";
import ProductFilter from "@/components/common/ProductFilter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/constants/filters";
import { useProductStore } from "@/store/productStore";
import { ArrowUpDown, Loader, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const createSearchParamsHelper = (filtersParams, sortBy) => {
  const searchParamsArray = [];

  for (const [key, value] of Object.entries(filtersParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      searchParamsArray.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  if (sortBy) {
    searchParamsArray.push(`sortBy=${sortBy}`);
  }

  return searchParamsArray.length > 0 ? searchParamsArray.join("&") : "";
};

const CollectionPage = () => {
  const { fetchProducts, products, isLoading } = useProductStore();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSort = (v) => {
    setSort(v);
  };

  const handleFilters = (getSectionId, getCurrentOption) => {
    let updatedFilters = { ...filters };

    if (!updatedFilters[getSectionId]) {
      updatedFilters[getSectionId] = [getCurrentOption];
    } else {
      const index = updatedFilters[getSectionId].indexOf(getCurrentOption);

      if (index === -1) {
        updatedFilters[getSectionId].push(getCurrentOption);
      } else {
        updatedFilters[getSectionId].splice(index, 1);
      }
    }

    if (updatedFilters[getSectionId].length === 0) {
      delete updatedFilters[getSectionId];
    }

    setFilters(updatedFilters);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
  };

  const handleProductDetails = (productId) => {
    // Navigate to product details page with productId
    navigate(`/product/${productId}`); // Navigate to product details page
  };

  // const handleAddToCart = (getProcudId) => {
  //   // Add product to cart with productId
  //   // Navigate to cart page
  //   console.log("prod", getProcudId);
  // };

  useEffect(() => {
    const storedFilters = sessionStorage.getItem("filters");
    if (storedFilters) {
      setFilters(JSON.parse(storedFilters));
    }
  }, []);

  useEffect(() => {
    const queryString = createSearchParamsHelper(filters, sort);
    setSearchParams(queryString);
  }, [filters, sort, setSearchParams]);

  useEffect(() => {
    fetchProducts({ filterParams: filters, sortParams: sort });
  }, [fetchProducts, filters, sort]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className=" grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilters={handleFilters} />
      <div className="bg-background w-full rounded-lg">
        <div className="p-4 broder-b flex  items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              {products.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="size-6" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((item) => (
                    <DropdownMenuRadioItem value={item.id} key={item.id}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Product list goes here */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              handleProductDetails={handleProductDetails}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
