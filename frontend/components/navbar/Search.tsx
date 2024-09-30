"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

interface Product {
  id: string;
  _id: string;
  name: string;
}

export default function Search() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const productsData = await response.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("");
    setFilteredProducts(products);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterProducts(query);
    setIsSearchOpen(true);
  };

  const filterProducts = (query: string) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const clicked = (ID: string) => {
    setSearchQuery("");
    router.push(`/shop/${ID}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <div className="relative flex items-center" ref={searchRef}>
        {isSearchOpen && (
          <input
            type="text"
            placeholder="Search products"
            className={`bg-white border border-gray-300 rounded-md shadow-md focus:outline-none px-3 py-1 h-[26px] sm:h-[28px] md:h-[30px] lg:h-[32px] xl:h-[32px] 2xl:hs-[34px] w-[170px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[300px] 2xl:w-[350px]`}
            value={searchQuery}
            onChange={handleSearchInputChange}
            onClick={() => setIsSearchOpen(true)}
          />
        )}
        <FaSearch
          className={`transition-all ease-in-out duration-150 ${
            isSearchOpen
              ? "text-black size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px] 2xl:size-[26px]"
              : "text-white size-[21px] sm:size-[23px] md:size-[25px] lg:size-[27px] 2xl:size-[29px]"
          } cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 mr-2`}
          onClick={toggleSearch}
        />
      </div>
      {isSearchOpen && searchQuery && (
        <div className="absolute z-30 bottom-0 translate-y-full bg-white border border-gray-300 rounded-md shadow-md text-sm md:text-base w-48 md:w-64 max-h-96 overflow-auto">
          {filteredProducts.length === 0 ? (
            <p className="py-2 px-4">No items found</p>
          ) : (
            <ul className="py-1">
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => clicked(product._id)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
