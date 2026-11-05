import { ButtonLink } from "@/src/components/ui/button-link";
import { Section } from "@/src/components/ui/section";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-slate-900 px-6 py-12 text-slate-50 shadow-sm sm:px-10">
        <p className="mb-3 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
          Prototype med demodata
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Finn riktig utstyr til jobben
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
          Fortell oss hva du skal bruke utstyret til, så hjelper vi deg med å finne
          produkter som passer dine behov.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/guide" variant="primary">
            Start produktguiden
          </ButtonLink>
          <ButtonLink href="/products" variant="secondary">
            Utforsk produkter
          </ButtonLink>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Slik fungerer guiden"
          description="Veiledningen følger en enkel beslutningsflyt fra behov til anbefaling."
        >
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>Velg bruksområde, miljø og bruksintensitet.</li>
            <li>Prioriter hva som er viktigst for deg.</li>
            <li>Få hovedanbefaling, alternativer og relevant tilbehør.</li>
          </ol>
        </Section>

        <Section
          title="Hva du får"
          description="Resultatet forklares tydelig og bygger på registrerte demodata."
        >
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Én hovedanbefaling med begrunnelse.</li>
            <li>Alternative valg for ulike behov.</li>
            <li>Kompatibelt tilbehør og pakketilbud.</li>
          </ul>
        </Section>

        <Section
          title="Bygget for videreutvikling"
          description="Datakilde og anbefalingslogikk er adskilt fra UI for enkel utvidelse."
        >
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Demodata i eget datalag.</li>
            <li>Forberedt for fremtidig Shopify-kobling.</li>
            <li>Kan utvides med AI-assistert veiledning senere.</li>
          </ul>
        </Section>
      </div>

      <Section
        eyebrow="Viktig"
        title="All informasjon i denne prototypen er fiktiv"
        description="Produkter, priser, spesifikasjoner og kompatibilitet er demodata laget for å demonstrere konseptet."
      >
        <p className="text-sm text-slate-600">
          Løsningen er laget som et utgangspunkt for JDD ProduktGuide og kan senere
          kobles til ekte produktdata.
        </p>
      </Section>
    </div>
  );
}
