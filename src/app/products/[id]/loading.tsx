// Product detail loading skeleton
export default function ProductDetailLoading() {
  return (
    <div className="container py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex space-x-2 mb-8">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-4"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-4"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images skeleton */}
        <div>
          {/* Main image skeleton */}
          <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg mb-4"></div>
          
          {/* Thumbnail images skeleton */}
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-20 h-24 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Right: Product info skeleton */}
        <div className="space-y-6">
          {/* Title and price */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
          </div>

          {/* Color selection */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
            <div className="flex space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/6"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded w-32"></div>
          </div>

          {/* Add to cart button */}
          <div className="h-12 bg-gray-200 animate-pulse rounded"></div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}