// Global loading UI for better UX
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Logo skeleton */}
        <div className="w-32 h-8 bg-gray-200 animate-pulse rounded mb-4 mx-auto"></div>
        
        {/* Loading spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
        </div>
        
        {/* Loading text */}
        <p className="mt-4 text-gray-600 text-sm">Yükleniyor...</p>
        
        {/* Content skeleton */}
        <div className="mt-8 space-y-3 max-w-md mx-auto">
          <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}