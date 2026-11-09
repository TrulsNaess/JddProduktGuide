import { GuideQuestion } from "@/src/types/domain";

export const guideQuestions: GuideQuestion[] = [
  {
    id: "categoryIntent",
    title: "Hvilken type produkt leter du etter?",
    description: "Velg kategori først. Du kan spesifisere mer i neste steg.",
    type: "text",
    placeholder: "F.eks. arbeidslys, ryggekamera, kabelsett",
  },
  {
    id: "productIntentText",
    title: "Beskriv behovet ditt kort",
    description: "Dette brukes til å finne relevante produkter uten at du må kjenne eksakt modellnavn.",
    type: "text",
    placeholder: "F.eks. trenger kraftig arbeidslys til traktor i mørke vinterforhold",
  },
  {
    id: "useCase",
    title: "Hva skal produktet brukes til?",
    type: "single-choice",
    options: [
      { value: "maintenance", label: "Vedlikehold og reparasjon" },
      { value: "construction", label: "Bygg og anlegg" },
      { value: "transport", label: "Transport og håndtering" },
      { value: "agriculture", label: "Landbruk og gårdsdrift" },
      { value: "parks", label: "Park og uteområder" },
      { value: "workshop", label: "Verksted og bil" },
      { value: "other", label: "Annet" },
    ],
  },
  {
    id: "valuePreference",
    title: "Hva vil du prioritere i anbefalingen?",
    description: "Du kan velge om guiden skal vekte beste totalvalg eller lavere pris høyest.",
    type: "single-choice",
    options: [
      { value: "best", label: "Best mulig match" },
      { value: "cheapest", label: "Billigste relevante alternativ" },
      { value: "balanced", label: "Balansert mellom pris og kvalitet" },
    ],
  },
  {
    id: "environment",
    title: "Hvilket miljø skal utstyret brukes i?",
    optional: true,
    type: "single-choice",
    options: [
      { value: "indoor", label: "Innendørs" },
      { value: "outdoor", label: "Utendørs" },
      { value: "demanding", label: "I krevende miljøer" },
      { value: "mixed", label: "Både innendørs og utendørs" },
    ],
  },
  {
    id: "usageIntensity",
    title: "Hvor ofte skal utstyret brukes?",
    optional: true,
    type: "single-choice",
    options: [
      { value: "occasional", label: "Av og til" },
      { value: "regular", label: "Regelmessig" },
      { value: "daily", label: "Daglig" },
      { value: "intensive", label: "Profesjonell og intensiv bruk" },
    ],
  },
  {
    id: "budgetNok",
    title: "Har du et omtrentlig budsjett i NOK?",
    optional: true,
    type: "number",
    placeholder: "f.eks. 5500",
  },
  {
    id: "specialRequirements",
    title: "Har du noen spesielle krav?",
    optional: true,
    type: "text",
    placeholder: "F.eks. dimensjoner, kapasitet, kontaktstandard eller kompatibilitet",
  },
];
