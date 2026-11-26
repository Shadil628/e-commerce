
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

function Products() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [brand, setBrand] = useState("All");
    const [sort, setSort] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: products = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts
    });

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch = product.title
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                category === "All" || product.category === category;

            const matchesBrand =
                brand === "All" || product.brand === brand;

            return matchesSearch && matchesCategory && matchesBrand;
        })
        .sort((a, b) => {
            if (sort === "low-high") return a.price - b.price;
            if (sort === "high-low") return b.price - a.price;
            return 0;
        });

    const productsPerPage = 10;
    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    const firstIndex = (currentPage - 1) * productsPerPage;

    const currentProducts = filteredProducts.slice(
        firstIndex,
        firstIndex + productsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, category, brand, sort]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F2F2F2] flex justify-center items-center">
                <h2>Loading products...</h2>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#F2F2F2] flex justify-center items-center text-red-600">
                {error.message}
            </div>
        );
    }

    return (
        <div className="bg-[#F2F2F2] min-h-screen p-8">

            {/* PRODUCTS HEADING */}
            <div className="products-heading">
                <div>
                    <p className="products-label">
                        ✦ CURATED FOR YOU
                    </p>

                    <h1>
                        Explore Our
                        <span> Collection.</span>
                    </h1>
                </div>

                <p className="products-subtitle">
                    Find something extraordinary for your everyday life.
                </p>
            </div>

            {/* PRODUCT FILTERS */}
            <div className="product-filters one-line-filters">

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="category-dropdown"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="category-dropdown"
                >
                    <option value="All">All Categories</option>
                    <option value="Mobiles">Mobiles</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Accessories">Accessories</option>
                </select>

                <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="category-dropdown"
                >
                    <option value="All">All Brands</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="HP">HP</option>
                    <option value="Dell">Dell</option>
                    <option value="ASUS">ASUS</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Sony">Sony</option>
                    <option value="JBL">JBL</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Google">Google</option>
                    <option value="Xiaomi">Xiaomi</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="category-dropdown"
                >
                    <option value="default">Default Sorting</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                </select>

            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

                {currentProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}

            </div>

            {/* EMPTY MESSAGE */}
            {filteredProducts.length === 0 && (
                <p className="text-center mt-10">
                    No products found.
                </p>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="pagination">

                    <button
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                        className="pagination-nav"
                    >
                        ← Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={
                                currentPage === index + 1
                                    ? "active"
                                    : ""
                            }
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-nav"
                    >
                        Next →
                    </button>

                </div>
            )}

        </div>
    );
}

export default Products;
