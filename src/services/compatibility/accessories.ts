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

export function generatePackageSuggestions(
  baseProduct: Product,
  accessories: Product[],
): AccessorySuggestion[] {
  const explicit = getAccessorySuggestions(baseProduct, accessories).filter(
    (suggestion) =>
      suggestion.status === "compatible" ||
      (suggestion.status === "unknown" &&
        suggestion.relationship === "required"),
  );

  if (explicit.length > 0) {
    return explicit.slice(0, 4);
  }

  const normalizedCategory = baseProduct.category.toLocaleLowerCase("nb");
  const normalizedText = [
    baseProduct.name,
    baseProduct.description,
    baseProduct.shortDescription,
    ...baseProduct.features,
  ]
    .join(" ")
    .toLocaleLowerCase("nb");

  const matches: AccessorySuggestion[] = [];

  function addFallback(product: Product | undefined, reason: string) {
    if (
      product &&
      !matches.some((suggestion) => suggestion.product.id === product.id)
    ) {
      matches.push({
        product,
        relationship: "recommended",
        status: "compatible",
        reason,
      });
    }
  }

  if (
    normalizedCategory.includes("arbeidslys") ||
    normalizedCategory.includes("ekstralys") ||
    normalizedCategory.includes("led-bar") ||
    normalizedText.includes("arbeidslys") ||
    normalizedText.includes("ekstralys")
  ) {
    const cableCandidates = accessories.filter((accessory) => {
      const text = `${accessory.name} ${accessory.description} ${accessory.category}`
        .toLocaleLowerCase("nb");
      return (
        text.includes("kabelsett") ||
        text.includes("skjøtekabel") ||
        text.includes("kabel") ||
        text.includes("kontakt")
      );
    });

    const vehicleCable =
      cableCandidates.find((accessory) =>
        `${accessory.name} ${accessory.description}`
          .toLocaleLowerCase("nb")
          .includes("5416"),
      ) ??
      cableCandidates.find((accessory) => {
        const text = `${accessory.name} ${accessory.description}`
          .toLocaleLowerCase("nb");
        return text.includes("dt") && text.includes("2");
      }) ??
      cableCandidates.find((accessory) =>
        `${accessory.name} ${accessory.description}`
          .toLocaleLowerCase("nb")
          .includes("kabelsett"),
      );

    addFallback(
      vehicleCable,
      "Generert tilbehørspakke for elektrisk tilkobling av produktet.",
    );
  }

  if (
    normalizedCategory.includes("tilhenger") ||
    normalizedText.includes("tilhenger")
  ) {
    const trailerCable = accessories.find((accessory) => {
      const text = `${accessory.name} ${accessory.description}`
        .toLocaleLowerCase("nb");
      return text.includes("kabelsett") && text.includes("tilhenger");
    });
    addFallback(
      trailerCable,
      "Generert kabelsett som passer en vanlig tilhengerinstallasjon.",
    );
  }

  if (
    normalizedCategory.includes("kamera") ||
    normalizedText.includes("kamera")
  ) {
    const cameraCable = accessories.find((accessory) => {
      const text = `${accessory.name} ${accessory.description}`
        .toLocaleLowerCase("nb");
      return (
        text.includes("kabel") &&
        (text.includes("kamera") || text.includes("4-pin") || text.includes("rca"))
      );
    });
    addFallback(
      cameraCable,
      "Generert kabelløsning for tilkobling av kameraet.",
    );
  }

  const bracket = accessories.find((accessory) => {
    const text = `${accessory.name} ${accessory.description}`
      .toLocaleLowerCase("nb");
    return text.includes("brakett") || text.includes("festebr");
  });
  if (bracket) {
    addFallback(bracket, "Generert feste som kan brukes ved montering.");
  }

  return matches.slice(0, 4);
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
  const packageDiscountNok =
    selectedAccessories.length > 0
      ? Math.min(300, Math.max(50, Math.round(subtotalNok * 0.03)))
      : 0;

  return {
    lines,
    subtotalNok,
    packageDiscountNok,
    totalNok: subtotalNok - packageDiscountNok,
  };
}
