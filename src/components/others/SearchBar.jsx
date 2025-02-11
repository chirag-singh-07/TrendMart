import { useState } from "react";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Search Query:", searchTerm); // Logs only on submit
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div
      className={`flex border-b shadow-md items-center gap-4 justify-center w-full transition-all duration-300 ${
        isOpen
          ? "absolute top-0 left-0 w-full backdrop-blur-md bg-black/30  h-24 z-50"
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 placeholder:text-gray-700"
            />
            <button
              onClick={handleSubmit}
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <Search className="size-7" type="submit" />
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSearchToggle}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <X className="size-7" />
          </Button>
        </form>
      ) : (
        <Search className="size-7" onClick={handleSearchToggle} />
      )}
    </div>
  );
};

export default SearchBar;
