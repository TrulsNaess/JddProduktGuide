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
          <li>Regelbasert og forklarbar anbefalingsmotor basert på demodata.</li>
          <li>Kompatibilitetsstyrte tilbehørsforslag og eksempel på pakketilbud.</li>
          <li>Arkitektur for fremtidig bytte av datakilde (f.eks. Shopify).</li>
        </ul>
      </Section>

      <Section
        title="Videre utvikling"
        description="Mulige neste steg etter prototypen."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Bytte demodata med ekte produktkatalog via repository-laget.</li>
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
