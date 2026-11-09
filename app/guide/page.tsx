"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ProductCard } from "@/src/components/products/product-card";
import { getAccessorySuggestions } from "@/src/services/compatibility/accessories";
import { productRepository } from "@/src/services/products/repository";

const products = productRepository.getAll();
const accessories = productRepository.getAccessories();
const steps = ["Kategori", "Produkt", "Kjøretøy", "Resultat"];
const vehicleTypes = ["Bil", "Traktor", "Tilhenger", "ATV / UTV", "Anleggsmaskin", "Annet"];

function mainCategory(category: string) {
    return category.split("·")[0].trim();
}

const categories = [...new Set(products.map((product) => mainCategory(product.category)))]
    .sort((a, b) => a.localeCompare(b, "nb"));

const field = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2";
const primary =
    "rounded-lg bg-orange-700 px-4 py-2 font-semibold text-white hover:bg-orange-800 disabled:opacity-50";
const secondary =
    "rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-50";

type ChatMessage = {
    question: string;
    answer: string;
};

export default function GuidePage() {
    const [step, setStep] = useState(0);
    const [category, setCategory] = useState("");
    const [query, setQuery] = useState("");
    const [productId, setProductId] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [draft, setDraft] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const chatLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatLog = chatLogRef.current;

        if (chatLog) {
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    }, [messages]);

    const product = products.find((item) => item.id === productId);
    const search = query.trim().toLocaleLowerCase("nb");
    const matches = products
        .filter((item) => mainCategory(item.category) === category)
        .filter((item) =>
            `${item.name} ${item.sku} ${item.category}`.toLocaleLowerCase("nb").includes(search),
        )
        .sort((a, b) => a.name.localeCompare(b.name, "nb"));

    const vehicle = vehicleType
        ? [vehicleType, model.trim(), year].filter(Boolean).join(" · ")
        : "";

    const suggestions = product ? getAccessorySuggestions(product, accessories) : [];

    const nextDisabled =
        (step === 0 && !category) ||
        (step === 1 && !product) ||
        (step === 2 && Boolean(vehicleType && year && year.length !== 4));

    function changeCategory(value: string) {
        setCategory(value);
        setProductId("");
        setQuery("");
    }

    function changeVehicleType(value: string) {
        setVehicleType(value);
        setModel("");
        setYear("");
    }

    function sendMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const question = draft.trim();
        if (!question) return;

        let answer = "Velg først en kategori, for eksempel Arbeidslys eller Ryggekamera.";

        if (product && vehicle) {
            answer = `Passform for ${product.name} på ${vehicle} må sjekkes. Under «Sjekk kompatibilitet» på resultatsiden finner du produktets spesifikasjoner og eventuelt registrert tilbehør.`;
        } else if (product) {
            answer = `Du har valgt ${product.name}. Oppgi gjerne kjøretøy, merke, modell og årsmodell i guiden. På resultatsiden finner du produktopplysningene du kan sammenligne med kjøretøyet ditt.`;
        } else if (category) {
            answer = `Du har valgt ${category}. Søk etter produktnavn, varenummer eller underkategori i produktsteget.`;
        }

        setMessages((previous) => [...previous, { question, answer }]);
        setDraft("");
    }

    return (
        <section className="mx-auto max-w-5xl text-slate-900">
            <p className="mb-1 text-sm font-semibold text-orange-800">Produktguide</p>
            <h1 className="text-3xl font-bold tracking-tight">Finn riktig utstyr</h1>
            <p className="mt-2 text-slate-600">
                Velg hva du ser etter, så hjelper guiden deg å finne fram i katalogen.
            </p>

            <ol
                aria-label="Fremdrift"
                className="my-6 grid grid-cols-4 rounded-xl bg-slate-200 p-4 text-center text-xs sm:text-sm"
            >
                {steps.map((label, index) => (
                    <li key={label} aria-current={step === index ? "step" : undefined}>
                        <span
                            className={`mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full font-bold ${step === index ? "bg-orange-700 text-white" : "bg-white"
                                }`}
                        >
                            {index < step ? "✓" : index + 1}
                        </span>
                        {label}
                    </li>
                ))}
            </ol>

            <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="p-5 sm:p-8">
                    {step === 0 && (
                        <label className="block">
                            <span className="mb-2 block text-xl font-bold">Hva ser du etter?</span>
                            <select
                                className={field}
                                value={category}
                                onChange={(event) => changeCategory(event.target.value)}
                            >
                                <option value="">Velg kategori</option>
                                {categories.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </label>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Hvilket produkt ser du etter?</h2>
                            <label className="block text-sm font-medium">
                                Søk i {category}
                                <input
                                    className={field}
                                    type="search"
                                    placeholder="Produktnavn, varenummer eller underkategori"
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                        setProductId("");
                                    }}
                                />
                            </label>

                            {matches.length > 0 ? (
                                <label className="block text-sm font-medium">
                                    Velg produkt
                                    <select
                                        className={field}
                                        value={productId}
                                        onChange={(event) => setProductId(event.target.value)}
                                    >
                                        <option value="">Velg blant {matches.length} produkter</option>
                                        {matches.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} · {item.sku}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            ) : (
                                <p role="status" className="text-sm text-slate-600">
                                    Ingen produkter matcher søket.
                                </p>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Hva skal produktet brukes på?</h2>
                            <p className="text-sm text-slate-600">
                                Gå rett til resultatet hvis kjøretøy ikke er relevant.
                            </p>

                            <label className="block text-sm font-medium">
                                Type kjøretøy
                                <select
                                    className={field}
                                    value={vehicleType}
                                    onChange={(event) => changeVehicleType(event.target.value)}
                                >
                                    <option value="">Velg type (valgfritt)</option>
                                    {vehicleTypes.map((type) => (
                                        <option key={type}>{type}</option>
                                    ))}
                                </select>
                            </label>

                            {vehicleType && (
                                <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                                    <label className="block text-sm font-medium">
                                        Merke og modell
                                        <input
                                            className={field}
                                            value={model}
                                            placeholder="F.eks. John Deere 6330"
                                            onChange={(event) => setModel(event.target.value)}
                                        />
                                    </label>
                                    <label className="block text-sm font-medium">
                                        Årsmodell
                                        <input
                                            className={field}
                                            inputMode="numeric"
                                            value={year}
                                            placeholder="F.eks. 2010"
                                            onChange={(event) => setYear(event.target.value.replace(/\D/g, "").slice(0, 4))}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && product && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Produktet du valgte</h2>
                            <ProductCard product={product} />

                            <details className="rounded-lg border border-slate-200 p-4">
                                <summary className="cursor-pointer font-semibold">Sjekk kompatibilitet</summary>
                                <p className="mt-3 text-sm text-slate-600">
                                    {vehicle
                                        ? `Passform for ${vehicle} må sjekkes. Sammenlign opplysningene nedenfor med kjøretøyet ditt.`
                                        : "Sammenlign produktopplysningene med kjøretøyet eller utstyret du skal bruke."}
                                </p>

                                <dl className="mt-3 divide-y divide-slate-200 text-sm">
                                    {product.specifications.map(({ name, value, unit }, index) => (
                                        <div key={`${name}-${index}`} className="flex justify-between gap-3 py-2">
                                            <dt>{name}</dt>
                                            <dd className="text-right font-medium">
                                                {value}{unit ? ` ${unit}` : ""}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                {product.limitations.length > 0 && (
                                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                                        {product.limitations.map((note) => <li key={note}>{note}</li>)}
                                    </ul>
                                )}

                                {suggestions.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="font-semibold">Registrert tilbehør</h3>
                                        <ul className="mt-2 space-y-2 text-sm">
                                            {suggestions.map(({ product: item, status, reason }) => (
                                                <li key={item.id}>
                                                    <Link href={`/products/${item.slug}`} className="font-medium underline">
                                                        {item.name}
                                                    </Link>
                                                    {" · "}
                                                    {status === "compatible"
                                                        ? "Passer til produktet"
                                                        : status === "incompatible"
                                                            ? "Passer ikke til produktet"
                                                            : "Må sjekkes"}
                                                    <p className="text-slate-600">{reason}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </details>
                        </div>
                    )}

                    <div className="mt-6 flex gap-3">
                        {step > 0 && (
                            <button type="button" className={secondary} onClick={() => setStep(step - 1)}>
                                Tilbake
                            </button>
                        )}
                        {step < 3 && (
                            <button
                                type="button"
                                className={`${primary} ml-auto`}
                                disabled={nextDisabled}
                                onClick={() => setStep(step + 1)}
                            >
                                {step === 2 ? "Se resultat" : "Neste"}
                            </button>
                        )}
                    </div>
                </div>

                <aside className="min-w-0 border-t border-slate-200 bg-slate-50 p-5 sm:p-8 md:border-l md:border-t-0">
                    <h2 className="text-lg font-bold">Dine valg</h2>
                    <dl className="mt-3 space-y-3 break-words text-sm">
                        <div>
                            <dt className="font-semibold">Kategori</dt>
                            <dd>{category || "–"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold">Produkt</dt>
                            <dd>{product?.name || "–"}</dd>
                        </div>
                        <div>
                            <dt className="font-semibold">Kjøretøy</dt>
                            <dd>{vehicle || "–"}</dd>
                        </div>
                    </dl>

                    <section className="mt-6 border-t border-slate-200 pt-5">
                        <h2 className="text-lg font-bold">Produktchat</h2>
                        <div
                            ref={chatLogRef}
                            role="log"
                            aria-label="Chatmeldinger"
                            className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 text-sm"
                        >
                            <p className="rounded-lg bg-slate-100 p-2.5">
                                Hei! Trenger du hjelp med produktvalg eller kompatibilitet?
                            </p>
                            {messages.map(({ question, answer }, index) => (
                                <div key={index} className="space-y-2 break-words">
                                    <p className="ml-4 rounded-lg bg-orange-50 p-2.5">{question}</p>
                                    <p className="mr-4 rounded-lg bg-slate-100 p-2.5">{answer}</p>
                                </div>
                            ))}
                        </div>

                        <form className="mt-3 flex gap-2" onSubmit={sendMessage}>
                            <input
                                className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                                aria-label="Melding til produktchatten"
                                placeholder="Skriv et spørsmål …"
                                value={draft}
                                maxLength={500}
                                onChange={(event) => setDraft(event.target.value)}
                            />
                            <button type="submit" className={`${primary} text-sm`} disabled={!draft.trim()}>
                                Send
                            </button>
                        </form>
                        <p className="mt-2 text-xs text-slate-500">
                            Demo med faste svar basert på valgene dine.
                        </p>
                    </section>
                </aside>
            </div>
        </section>
    );
}