import { GuideQuestion } from "@/src/types/domain";

export const guideQuestions: GuideQuestion[] = [
  {
    id: "useCase",
    title: "Hva skal du bruke utstyret til?",
    description:
      "Dette hjelper oss å finne produkter som passer arbeidsoppgaven du vil løse.",
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
    id: "environment",
    title: "Hvilket miljø skal utstyret brukes i?",
    description: "Miljøet påvirker robusthet, materialvalg og driftskrav.",
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
    description: "Bruksfrekvens hjelper oss å balansere kapasitet og levetid.",
    type: "single-choice",
    options: [
      { value: "occasional", label: "Av og til" },
      { value: "regular", label: "Regelmessig" },
      { value: "daily", label: "Daglig" },
      { value: "intensive", label: "Profesjonell og intensiv bruk" },
    ],
  },
  {
    id: "priority",
    title: "Hva er viktigst for deg?",
    optional: true,
    description:
      "Velg hva du vil vektlegge mest i anbefalingen. Du kan hoppe over dette spørsmålet.",
    type: "single-choice",
    options: [
      { value: "price", label: "Lavest mulig pris" },
      { value: "quality", label: "Best mulig kvalitet" },
      { value: "capacity", label: "Høy kapasitet og ytelse" },
      { value: "flexibility", label: "Fleksibilitet og flere bruksområder" },
      { value: "durability", label: "Lang levetid og driftssikkerhet" },
    ],
  },
  {
    id: "budgetNok",
    title: "Har du et omtrentlig budsjett i NOK?",
    optional: true,
    description: "Valgfritt: Brukes for å sortere bedre mellom like gode alternativer.",
    type: "number",
    placeholder: "f.eks. 5500",
  },
  {
    id: "specialRequirements",
    title: "Har du noen spesielle krav?",
    optional: true,
    description:
      "Valgfritt: Oppgi for eksempel dimensjoner, kapasitet, eller kompatibilitet med eksisterende utstyr.",
    type: "text",
    placeholder: "Skriv kort hva som er viktig for deg",
  },
];
