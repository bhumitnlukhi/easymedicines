export type VerificationStatus = 'verified' | 'unverified' | 'pending_review' | 'demo';

export type MatchConfidence = 'exact' | 'high' | 'medium' | 'low' | 'unmatched';

export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'prescription_only' | 'discontinued';

export interface ProductKeyInformation {
  uses?: string[];
  sideEffects?: string[];
  precautions?: string[];
  storage?: string;
  dosageGuidelines?: string;
  contraindications?: string[];
}

export interface RawSpreadsheetRecord {
  rowNumber: number;
  originalName: string;
  originalPrice: number | string;
  originalMrp?: number | string;
  originalCategory?: string;
  originalBrand?: string;
  rawColumns: Record<string, any>;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  genericName?: string;
  activeIngredients?: string[];
  strength?: string;
  dosageForm?: string; // Tablet, Syrup, Injection, Capsule, Ointment, etc.
  packSize?: string;   // e.g. "Strip of 10 tablets", "Bottle of 100ml"
  category: string;
  description: string;
  keyInformation?: ProductKeyInformation;
  price: number;       // In Indian Rupees (INR) or source currency
  mrp?: number;        // Only when explicitly verified from source
  currency: string;    // e.g. 'INR'
  imageUrl: string;
  gallery?: string[];
  prescriptionRequired: boolean;
  availabilityStatus: AvailabilityStatus;
  manufacturer?: string;
  
  // Auditing and Source Tracing Fields
  sourceSpreadsheetRow?: number;
  sourceProductName?: string;
  originalPriceRaw?: string;
  isPriceOnRequest?: boolean;
  matchConfidence: MatchConfidence;
  verificationStatus: VerificationStatus;
  dataWarnings?: string[];
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  itemCount?: number;
  imageUrl?: string;
}

export interface CatalogValidationReport {
  timestamp: string;
  sourceFile: string;
  totalRows: number;
  validProducts: number;
  duplicateRows: { row: number; identifier: string; reason: string }[];
  missingRequiredFields: { row: number; missing: string[] }[];
  ambiguousMatches: { row: number; originalName: string; issue: string; confidence: MatchConfidence }[];
  missingImages: { id: string; name: string }[];
  prescriptionReviewRequired: { id: string; name: string; reason: string }[];
  priceDiscrepancies: { id: string; name: string; price: number; mrp?: number; issue: string }[];
}

export type ProductSortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc';

export interface ProductFilterState {
  category?: string;
  brand?: string[];
  prescriptionRequired?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  searchQuery?: string;
  sortBy?: ProductSortOption;
}
