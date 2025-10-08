import Link from 'next/link';

const ProductCard = ({ product }) => {
  const hasDiscount = product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 group">
      <div className="relative">
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {discountPercentage}% تخفیف
          </span>
        )}
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-48 object-cover group-hover:opacity-90"
        />
        <button className="absolute bottom-2 left-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <a className="block">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600">{product.title}</h3>
          </a>
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-gray-800 font-bold">{product.price.toLocaleString()} تومان</p>
            {hasDiscount && (
              <p className="text-gray-500 text-sm line-through">{product.originalPrice.toLocaleString()} تومان</p>
            )}
          </div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {product.shipping}
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 mr-1">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;