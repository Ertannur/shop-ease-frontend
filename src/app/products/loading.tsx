// Products page loading skeleton
export default function ProductsLoading() {
  return (
    <div className="container py-8">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3 mb-8"></div>
      
      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200 animate-pulse rounded-lg mb-4"></div>
            
            {/* Content skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}