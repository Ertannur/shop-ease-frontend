/**
 * Currency and number formatting utilities
 */

/**
 * Format number as Turkish Lira currency
 * @param value - The number to format
 * @returns Formatted string with TL currency symbol
 * @example formatTL(1234.56) // "₺1.234,56"
 */
export const formatTL = (value: number): string => {
  return new Intl.NumberFormat("tr-TR", { 
    style: "currency", 
    currency: "TRY" 
  }).format(value);
};

/**
 * Format number with Turkish locale (without currency symbol)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 * @example formatNumber(1234.56) // "1.234,56"
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format percentage with Turkish locale
 * @param value - The percentage value (0-1 or 0-100)
 * @param isDecimal - Whether the value is in decimal format (0-1) or percentage (0-100)
 * @returns Formatted percentage string
 * @example formatPercent(0.15) // "%15"
 * @example formatPercent(15, false) // "%15"
 */
export const formatPercent = (value: number, isDecimal: boolean = true): string => {
  const percentage = isDecimal ? value : value / 100;
  return new Intl.NumberFormat("tr-TR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(percentage);
};

/**
 * Format discount amount with Turkish Lira
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Object with formatted original, discounted prices and discount amount
 */
export const formatDiscount = (originalPrice: number, discountedPrice: number) => {
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = (discountAmount / originalPrice) * 100;
  
  return {
    original: formatTL(originalPrice),
    discounted: formatTL(discountedPrice),
    discountAmount: formatTL(discountAmount),
    discountPercentage: formatPercent(discountPercentage / 100)
  };
};
