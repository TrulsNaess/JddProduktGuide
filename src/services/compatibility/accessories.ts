import {
  AccessorySuggestion,
  CompatibilityStatus,
  PackageSummary,
  Product,
  RelationshipType,
} from "@/src/types/domain";

function relationshipOrder(relationship: RelationshipType): number {
  if (relationship === "required") return 0;
  if (relationship === "recommended") return 1;
  return 2;
}

function statusOrder(status: CompatibilityStatus): number {
  if (status === "compatible") return 0;
  if (status === "unknown") return 1;
  return 2;
}

export function getAccessorySuggestions(
  baseProduct: Product,
  accessories: Product[],
): AccessorySuggestion[] {
  return baseProduct.compatibility
    .map((relation) => {
      const accessory = accessories.find((item) => item.id === relation.productId);
      if (!accessory) {
        return null;
      }

      return {
        product: accessory,
        relationship: relation.relationship,
        status: relation.status,
        reason: relation.note ?? "Relevans er hentet fra registrert kompatibilitet.",
      } as AccessorySuggestion;
    })
    .filter((item): item is AccessorySuggestion => item !== null)
    .sort((a, b) => {
      const relationshipDiff =
        relationshipOrder(a.relationship) - relationshipOrder(b.relationship);
      if (relationshipDiff !== 0) {
        return relationshipDiff;
      }

      return statusOrder(a.status) - statusOrder(b.status);
    });
}

export function buildPackageSummary(
  baseProduct: Product,
  selectedAccessories: Product[],
): PackageSummary {
  const lines = [
    { productId: baseProduct.id, name: baseProduct.name, priceNok: baseProduct.priceNok },
    ...selectedAccessories.map((accessory) => ({
      productId: accessory.id,
      name: accessory.name,
      priceNok: accessory.priceNok,
    })),
  ];

  const subtotalNok = lines.reduce((acc, line) => acc + line.priceNok, 0);
  const packageDiscountNok = selectedAccessories.length >= 2 ? 200 : 0;

  return {
    lines,
    subtotalNok,
    packageDiscountNok,
    totalNok: subtotalNok - packageDiscountNok,
  };
}
