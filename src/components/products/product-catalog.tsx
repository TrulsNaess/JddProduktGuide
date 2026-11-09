"use client";

import { useState } from "react";
import { ProductCard } from "@/src/components/products/product-card";
import { Product } from "@/src/types/domain";

interface ProductCategory {
  name: string;
  products: Product[];
}

interface ProductCatalogProps {
  categories: ProductCategory[];
}

export function ProductCatalog({ categories }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("nb");
  const selectedProducts = categories.find(
    (category) => category.name === "Installasjonsmateriell",
  )?.products;
  const subcategories = [
    ...new Set(
      selectedProducts?.map(
        (product) => product.category.split(" · ")[1] ?? "Annet",
      ) ?? [],
    ),
  ].sort((a, b) => a.localeCompare(b, "nb"));
  const visibleCategories = categories
    .filter(
      (category) =>
        selectedCategory === null || category.name === selectedCategory,
    )
    .map((category) => ({
      ...category,
      products: category.products.filter((product) => {
        const matchesSubcategory =
          category.name !== "Installasjonsmateriell" ||
          selectedSubcategory === null ||
          (product.category.split(" · ")[1] ?? "Annet") === selectedSubcategory;
        const searchableText = [
          product.name,
          product.sku,
          product.description,
          product.shortDescription,
          product.category,
          ...product.features,
        ]
          .join(" ")
          .toLocaleLowerCase("nb");

        return (
          matchesSubcategory &&
          (!normalizedQuery || searchableText.includes(normalizedQuery))
        );
      }),
    }))
    .filter((category) => category.products.length > 0);
  const visibleProductCount = visibleCategories.reduce(
    (total, category) => total + category.products.length,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="product-search"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Søk i produktene
        </label>
        <input
          id="product-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Søk etter produkt, varenummer eller beskrivelse"
          className="mb-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        <div
          aria-label="Filtrer produkter etter kategori"
          className="flex flex-wrap gap-2"
          role="group"
        >
          <button
            type="button"
            aria-pressed={selectedCategory === null}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              selectedCategory === null
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
            }`}
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubcategory(null);
            }}
          >
            Alle produkter
          </button>
          {categories.map(({ name, products }) => {
            const isSelected = selectedCategory === name;

            return (
              <button
                key={name}
                type="button"
                aria-pressed={isSelected}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
                onClick={() => {
                  setSelectedCategory(name);
                  setSelectedSubcategory(null);
                }}
              >
                {name}
                <span className="ml-2 text-xs opacity-70">{products.length}</span>
              </button>
            );
          })}
        </div>
        {selectedCategory === "Installasjonsmateriell" ? (
          <div
            aria-label="Filtrer installasjonsmateriell etter underkategori"
            className="mt-4 flex flex-wrap gap-2"
            role="group"
          >
            <button
              type="button"
              aria-pressed={selectedSubcategory === null}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selectedSubcategory === null
                  ? "border-amber-600 bg-amber-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
              onClick={() => setSelectedSubcategory(null)}
            >
              Alle underkategorier
            </button>
            {subcategories.map((subcategory) => (
              <button
                key={subcategory}
                type="button"
                aria-pressed={selectedSubcategory === subcategory}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selectedSubcategory === subcategory
                    ? "border-amber-600 bg-amber-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
                onClick={() => setSelectedSubcategory(subcategory)}
              >
                {subcategory}
              </button>
            ))}
          </div>
        ) : null}
        <p aria-live="polite" className="mt-3 text-sm text-slate-500">
          Viser {visibleProductCount}{" "}
          {visibleProductCount === 1 ? "produkt" : "produkter"}
          {selectedCategory ? ` i ${selectedCategory}` : ""}
          {selectedSubcategory ? ` · ${selectedSubcategory}` : ""}
          {normalizedQuery ? ` · søk: «${searchQuery.trim()}»` : ""}
        </p>
      </div>

      <div className="space-y-8">
        {visibleCategories.map(({ name, products }) => (
          <section
            key={name}
            aria-labelledby={`category-${name}`}
            className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0"
          >
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h3
                id={`category-${name}`}
                className="text-xl font-semibold text-slate-900"
              >
                {name}
              </h3>
              <p className="text-sm text-slate-500">
                {products.length}{" "}
                {products.length === 1 ? "produkt" : "produkter"}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  label={product.kind === "accessory" ? "Tilbehør" : undefined}
                />
              ))}
            </div>
          </section>
        ))}
        {visibleCategories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-600">
            Ingen produkter funnet. Prøv et annet søk eller filter.
          </p>
        ) : null}
      </div>
    </div>
  );
}
