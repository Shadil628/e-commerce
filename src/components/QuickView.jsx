
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function QuickView({ product, onClose, onAddToCart, onWishlist }) {
//     const navigate = useNavigate();

//     const [isZoomed, setIsZoomed] = useState(false);
//     const [selectedColor, setSelectedColor] = useState(
//         product.colors?.[0]?.name ||
//         product.colors?.[0] ||
//         ""
//     );

//     const images = product.images?.length
//         ? product.images
//         : [product.image];

//     const [activeImage, setActiveImage] = useState(0);

//     const originalPrice = Number(
//         product.originalPrice ||
//         product.oldPrice ||
//         product.compareAtPrice ||
//         0
//     );

//     const price = Number(product.price || 0);

//     const discount = originalPrice > price
//         ? Math.round(((originalPrice - price) / originalPrice) * 100)
//         : 0;

//     const savings = originalPrice > price
//         ? originalPrice - price
//         : 0;

//     const stock = Number(product.stock || 0);

//     const handleBuyNow = () => {
//         if (stock <= 0) return;

//         const buyNowItem = {
//             ...product,
//             selectedColor,
//             quantity: 1
//         };

//         navigate("/checkout", {
//             state: { buyNowItem }
//         });

//         onClose();
//     };

//     const handleAddToCart = () => {
//         onAddToCart({
//             ...product,
//             selectedColor
//         });
//     };

//     const handleWishlist = () => {
//         onWishlist({
//             ...product,
//             selectedColor
//         });
//     };

//     return (
//         <div className="quick-page">

//             {/* BACK BUTTON */}

//             <button
//                 className="quick-back-button"
//                 onClick={onClose}
//             >
//                 ← Back to Collection
//             </button>

//             <div className="quick-product-layout">

//                 {/* LEFT IMAGE CARD */}

//                 <div className="quick-image-card">

//                     <span className="quick-featured-badge">
//                         ✦ FEATURED PRODUCT
//                     </span>

//                     <div
//                         className={`quick-product-image ${
//                             isZoomed ? "zoom-active" : ""
//                         }`}
//                         onMouseEnter={() => setIsZoomed(true)}
//                         onMouseLeave={() => setIsZoomed(false)}
//                     >
//                         <img
//                             src={images[activeImage]}
//                             alt={product.title}
//                             style={{
//                                 transform: isZoomed
//                                     ? "scale(1.7)"
//                                     : "scale(1)"
//                             }}
//                         />

//                         {images.length > 1 && (
//                             <>
//                                 <button
//                                     className="quick-image-arrow prev"
//                                     onClick={() => {
//                                         setIsZoomed(false);
//                                         setActiveImage(
//                                             (activeImage - 1 + images.length) %
//                                             images.length
//                                         );
//                                     }}
//                                 >
//                                     ‹
//                                 </button>

//                                 <button
//                                     className="quick-image-arrow next"
//                                     onClick={() => {
//                                         setIsZoomed(false);
//                                         setActiveImage(
//                                             (activeImage + 1) % images.length
//                                         );
//                                     }}
//                                 >
//                                     ›
//                                 </button>
//                             </>
//                         )}
//                     </div>

//                     {images.length > 1 && (
//                         <div className="quick-image-thumbnails">
//                             {images.map((image, index) => (
//                                 <button
//                                     key={index}
//                                     className={
//                                         activeImage === index ? "active" : ""
//                                     }
//                                     onClick={() => {
//                                         setActiveImage(index);
//                                         setIsZoomed(false);
//                                     }}
//                                 >
//                                     <img src={image} alt="" />
//                                 </button>
//                             ))}
//                         </div>
//                     )}

//                 </div>

//                 {/* RIGHT DETAILS CARD */}

//                 <div className="quick-info-card">

//                     <p className="quick-product-category">
//                         {product.category || product.brand}
//                     </p>

//                     <h1 className="quick-product-title">
//                         {product.title}
//                     </h1>

//                     <p className="quick-product-description">
//                         {product.description}
//                     </p>

//                     {/* PRICE */}

//                     <div className="quick-price-section">

//                         <div className="quick-price-line">

//                             <span className="quick-current-price">
//                                 ₹{price.toLocaleString("en-IN")}
//                             </span>

//                             {originalPrice > price && (
//                                 <>
//                                     <span className="quick-original-price">
//                                         ₹{originalPrice.toLocaleString("en-IN")}
//                                     </span>

//                                     <span className="quick-discount-badge">
//                                         {discount}% OFF
//                                     </span>
//                                 </>
//                             )}

//                         </div>

//                         {savings > 0 && (
//                             <p className="quick-savings">
//                                 You save ₹{savings.toLocaleString("en-IN")}
//                             </p>
//                         )}

//                     </div>

//                     {/* STOCK */}

//                     <div className="quick-stock">
//                         <span className={
//                             stock > 0 ? "stock-dot" : "stock-dot out"
//                         } />

//                         {stock > 0
//                             ? `${stock} units available`
//                             : "Currently unavailable"}
//                     </div>

//                     {/* COLOURS */}

//                     {product.colors?.length > 0 && (
//                         <div className="quick-page-colors">

//                             <h3>Choose Colour</h3>

//                             <div className="quick-page-color-list">

//                                 {product.colors.map((color) => {
//                                     const colorName =
//                                         typeof color === "string"
//                                             ? color
//                                             : color.name;

//                                     const colorHex =
//                                         typeof color === "string"
//                                             ? color
//                                             : color.hex;

//                                     return (
//                                         <button
//                                             key={colorName}
//                                             title={colorName}
//                                             aria-label={colorName}
//                                             className={`quick-page-color ${
//                                                 selectedColor === colorName
//                                                     ? "active"
//                                                     : ""
//                                             }`}
//                                             style={{
//                                                 backgroundColor: colorHex
//                                             }}
//                                             onClick={() =>
//                                                 setSelectedColor(colorName)
//                                             }
//                                         />
//                                     );
//                                 })}

//                             </div>

//                             <p className="quick-selected-color">
//                                 Selected: {selectedColor}
//                             </p>

//                         </div>
//                     )}

//                     {/* SPECIFICATIONS */}

//                     {product.specifications && (
//                         <div className="quick-page-specifications">

//                             <h3>Specifications</h3>

//                             {Object.entries(product.specifications).map(
//                                 ([key, value]) => (
//                                     <div className="quick-spec-row" key={key}>
//                                         <span>{key}</span>
//                                         <strong>
//                                             {typeof value === "object"
//                                                 ? JSON.stringify(value)
//                                                 : value}
//                                         </strong>
//                                     </div>
//                                 )
//                             )}

//                         </div>
//                     )}

//                     <div className="quick-info-divider" />

//                     {/* ACTION BUTTONS */}

//                     <div className="quick-page-actions">

//                         <button
//                             className="quick-page-cart"
//                             disabled={stock <= 0}
//                             onClick={handleAddToCart}
//                         >
//                             Add to Cart ↗
//                         </button>

//                         <button
//                             className="quick-page-buy"
//                             disabled={stock <= 0}
//                             onClick={handleBuyNow}
//                         >
//                             Buy Now ↗
//                         </button>

//                     </div>

//                     <p className="quick-page-footer">
//                         Quality products. Better everyday experiences.
//                     </p>

//                     <button
//                         className="quick-page-wishlist"
//                         onClick={handleWishlist}
//                     >
//                         ♡ Add to Wishlist
//                     </button>

//                 </div>

//             </div>
//         </div>
//     );
// }

// export default QuickView;











