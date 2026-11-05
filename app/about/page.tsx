import Link from "next/link";
import { Section } from "@/src/components/ui/section";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Section
        eyebrow="Om løsningen"
        title="JDD ProduktGuide – prototype"
        description="Denne versjonen demonstrerer hvordan kunder kan gå fra behov til konkret produktanbefaling."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Trinnvis guide med fremdrift, lagring av svar og redigering underveis.</li>
          <li>Regelbaserte anbefalinger fra et utvalg ekte JDD-arbeidslys.</li>
          <li>Produktdetaljer og lenker til JDDs nettbutikk.</li>
          <li>Kompatibilitet og tilbehør er ikke verifisert i dette utvalget.</li>
          <li>Arkitektur for fremtidig bytte av datakilde (f.eks. Shopify).</li>
        </ul>
      </Section>

      <Section
        title="Videre utvikling"
        description="Mulige neste steg etter prototypen."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Utvide produktutvalget og registrere verifiserte produktregler.</li>
          <li>Legge til verifisert kompatibilitet og tilbehør.</li>
          <li>Legge til administrasjon av spørsmål, vekter og produktregler.</li>
          <li>Utvide med AI-assistert teksthjelp uten å overstyre faktiske produktdata.</li>
        </ul>
      </Section>

      <Link
        href="/guide"
        className="inline-flex rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
      >
        Start produktguiden
      </Link>
    </div>
  );
}
