export type Environment = "indoor" | "outdoor" | "demanding" | "mixed";

export type UsageIntensity =
  | "occasional"
  | "regular"
  | "daily"
  | "intensive";

export type Priority =
  | "price"
  | "quality"
  | "capacity"
  | "flexibility"
  | "durability";

export type GuideUseCase =
  | "maintenance"
  | "construction"
  | "transport"
  | "agriculture"
  | "parks"
  | "workshop"
  | "other";

export type RelationshipType = "required" | "recommended" | "optional";

export type CompatibilityStatus = "compatible" | "incompatible" | "unknown";

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface ProductCompatibility {
  productId: string;
  status: CompatibilityStatus;
  relationship: RelationshipType;
  note?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  kind: "main" | "accessory";
  shortDescription: string;
  description: string;
  image: string;
  priceNok: number;
  isDemo: boolean;
  demoNotice: string;
  useCases: GuideUseCase[];
  industries: string[];
  environments: Environment[];
  usageIntensity: UsageIntensity[];
  priorities: Priority[];
  features: string[];
  limitations: string[];
  specifications: ProductSpecification[];
  compatibility: ProductCompatibility[];
}

export interface GuideAnswers {
  useCase?: GuideUseCase;
  environment?: Environment;
  usageIntensity?: UsageIntensity;
  priority?: Priority;
  specialRequirements?: string;
  budgetNok?: number;
}

export interface GuideQuestionOption {
  value: string;
  label: string;
  hint?: string;
}

export interface GuideQuestion {
  id: keyof GuideAnswers;
  title: string;
  description?: string;
  optional?: boolean;
  type: "single-choice" | "text" | "number";
  options?: GuideQuestionOption[];
  placeholder?: string;
}

export interface RecommendationResult {
  productId: string;
  score: number;
  reasons: string[];
  limitations: string[];
  unmetAbsoluteRequirements: string[];
  matchedCriteria: string[];
}

export interface RankedRecommendation {
  bestMatch: RecommendationResult | null;
  alternatives: RecommendationResult[];
  allRanked: RecommendationResult[];
}

export interface AccessorySuggestion {
  product: Product;
  relationship: RelationshipType;
  status: CompatibilityStatus;
  reason: string;
}

export interface PackageLine {
  productId: string;
  name: string;
  priceNok: number;
}

export interface PackageSummary {
  lines: PackageLine[];
  subtotalNok: number;
  packageDiscountNok: number;
  totalNok: number;
}
