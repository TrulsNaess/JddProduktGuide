import { Product } from "@/src/types/domain";
import electricalInstallData from "./electrical-install-products.json";

const dataNotice =
  "Produktinformasjon og pris er hentet fra JDD Utstyr. Pris og tilgjengelighet kan endres. Bruksområde- og prioritetsmerking er foreløpig prototypemetadata.";

interface JddProductSource {
  sku: string;
  name: string;
  sourceUrl: string;
  image: string;
  priceNok: number;
  category: string;
  description: string;
  useCases: Product["useCases"];
  industries: string[];
  priorities: Product["priorities"];
  features: string[];
  specifications?: Product["specifications"];
  kind?: Product["kind"];
  compatibility?: Product["compatibility"];
  limitations?: Product["limitations"];
}

function createJddProduct(source: JddProductSource): Product {
  return {
    ...source,
    id: `JDD-${source.sku}`,
    slug: source.sku.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    kind: source.kind ?? "main",
    shortDescription: source.description,
    isDemo: false,
    dataNotice,
    environments: ["outdoor", "mixed"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    limitations:
      source.limitations ?? ["Kontroller produktvariant og egnethet før kjøp."],
    specifications: source.specifications ?? [],
    compatibility: source.compatibility ?? [],
  };
}

const electricalCompatibilityBySku: Record<string, Product["compatibility"]> = {
  "132848": [
    {
      productId: "JDD-L7322",
      status: "compatible",
      relationship: "optional",
      note:
        "Settets DT-kontakter omfatter 2-pins DT, samme kontaktserie og pinneantall som arbeidslyset. Kontroller kjønn og kabling før montering.",
    },
  ],
  "135427": [
    {
      productId: "JDD-L7322",
      status: "compatible",
      relationship: "optional",
      note:
        "Settets DT-kontakter omfatter 2-pins DT, samme kontaktserie og pinneantall som arbeidslyset. Kontroller kjønn og kabling før montering.",
    },
  ],
  "135849": [
    {
      productId: "JDD-L7322",
      status: "unknown",
      relationship: "optional",
      note:
        "Begge bruker 2-pins DT. Kjønn og pinneoppsett for lampens kontakt er ikke spesifisert her, så bekreft dette før bestilling.",
    },
  ],
  "135850": [
    {
      productId: "JDD-L7322",
      status: "unknown",
      relationship: "optional",
      note:
        "Begge bruker 2-pins DT. Kjønn og pinneoppsett for lampens kontakt er ikke spesifisert her, så bekreft dette før bestilling.",
    },
  ],
  "5416": [
    {
      productId: "JDD-L7322",
      status: "compatible",
      relationship: "optional",
      note:
        "Skjøtekabelen har DT2 hun- og hankontakt og er oppgitt med 2 meter kabel. Kontroller kabelføring og elektriske krav ved montering.",
    },
  ],
  "5418": [
    {
      productId: "JDD-L7322",
      status: "unknown",
      relationship: "optional",
      note:
        "Overgangen har en 2-pins DT-side, men arbeidslysets kontaktskjønn og pinneoppsett er ikke spesifisert. Bekreft dette før bestilling.",
    },
  ],
  DT2F: [
    {
      productId: "JDD-L7322",
      status: "unknown",
      relationship: "optional",
      note:
        "Samme DT2-serie og pinneantall som arbeidslyset, men kjønn og pinneoppsett for lampens kontakt er ikke oppgitt.",
    },
  ],
  DT2M: [
    {
      productId: "JDD-L7322",
      status: "unknown",
      relationship: "optional",
      note:
        "Samme DT2-serie og pinneantall som arbeidslyset, men kjønn og pinneoppsett for lampens kontakt er ikke oppgitt.",
    },
  ],
  KAB01: [
    {
      productId: "JDD-HD769",
      status: "unknown",
      relationship: "optional",
      note:
        "Kameraet og kabelen har 4-pins tilkobling, men pinneoppsett og kontakttype er ikke verifisert som like.",
    },
  ],
  KAB02: [
    {
      productId: "JDD-HD769",
      status: "unknown",
      relationship: "optional",
      note:
        "Kameraet og kabelen har 4-pins tilkobling, men pinneoppsett og kontakttype er ikke verifisert som like.",
    },
  ],
  KAB03: [
    {
      productId: "JDD-HD769",
      status: "unknown",
      relationship: "optional",
      note:
        "Kabelen overfører mellom 4- og 5-pins kontakt. Kameraet er oppgitt med 4-pins tilkobling, men pinneoppsett og kontaktvariant må bekreftes.",
    },
  ],
  KAB05: [
    {
      productId: "JDD-HD769",
      status: "unknown",
      relationship: "optional",
      note:
        "Kabelen går mellom RCA og 4-pins kontakt. Kameraets pinneoppsett og videostandard er ikke verifisert mot kabelen.",
    },
  ],
  "KAB4PIN-RCA": [
    {
      productId: "JDD-HD769",
      status: "unknown",
      relationship: "optional",
      note:
        "Kabelen går mellom 4-pins kontakt og RCA. Kameraets pinneoppsett og videostandard er ikke verifisert mot kabelen.",
    },
  ],
  "556-37": [
    {
      productId: "JDD-HD769",
      status: "unknown",
      relationship: "optional",
      note:
        "Overgangen har 4-pins kontakt i den ene enden, men krever også en 8-pins ADA-skjermkabel. Kontroller kameramodell og pinneoppsett.",
    },
  ],
  "5300": [
    {
      productId: "JDD-131007",
      status: "compatible",
      relationship: "optional",
      note:
        "Begge er for 12 V tilhengeranlegg med 13-polet tilkobling. Testeren kontrollerer bilens kontakt før tilhengerkabelsettet kobles til.",
    },
    {
      productId: "JDD-5345",
      status: "unknown",
      relationship: "optional",
      note:
        "Begge har 13-polet tilkobling. Testeren kontrollerer bilens kontakt; bekreft spenning og bruksmåte for kabelsettet før kjøp.",
    },
    {
      productId: "JDD-SETT-L4400-1",
      status: "unknown",
      relationship: "optional",
      note:
        "Begge har 13-polet tilkobling. Testeren kontrollerer bilens kontakt; bekreft spenning og bruksmåte for lyssettet før kjøp.",
    },
  ],
  EPTA03: [
    {
      productId: "JDD-T170",
      status: "compatible",
      relationship: "optional",
      note:
        "Testeren støtter 7-polet tilkobling, og lyssettet er oppgitt med 7-polet støpsel. Testeren brukes til å kontrollere kjøretøyets kontakt.",
    },
    {
      productId: "JDD-131006",
      status: "compatible",
      relationship: "optional",
      note:
        "Begge gjelder 12 V tilhengeranlegg med 7-polet tilkobling. Testeren kontrollerer bilens kontakt før kabelsettet kobles til.",
    },
  ],
};

function getElectricalProductFeatures(name: string, category: string): string[] {
  const text = `${name} ${category}`;
  const standards = Array.from(
    text.matchAll(
      /\b(?:HDSCS|MCP|DTM|DTP|ATP|DT|Deutsch|AMP|Superseal|NATO|EBS|ADR|ABS|Anderson)\b/gi,
    ),
    ([value]) => value.toUpperCase(),
  );
  const details = Array.from(
    name.matchAll(/\b\d+(?:[.,]\d+)?\s?(?:pin|polet|pol|A|V|mm²|mm2|cm|m)\b/gi),
    ([value]) => value,
  );

  return [...new Set([...standards, ...details, category.split("·").at(-1)?.trim() ?? category])].slice(
    0,
    4,
  );
}

const electricalInstallProducts: Product[] = electricalInstallData.map((source) => {
  const isTrailerElectrical = source.category.includes("tilhenger");

  return createJddProduct({
    ...source,
    useCases: isTrailerElectrical
      ? ["transport", "maintenance", "agriculture"]
      : ["maintenance", "workshop", "construction", "transport", "agriculture"],
    industries: isTrailerElectrical
      ? ["Transport", "Verksted", "Landbruk"]
      : ["Verksted", "Transport", "Entreprenør", "Landbruk"],
    priorities: ["flexibility", "quality", "durability"],
    features: getElectricalProductFeatures(source.name, source.category),
    kind: "accessory",
    compatibility: electricalCompatibilityBySku[source.sku] ?? [],
    limitations: [
      "Kontroller kontaktserie, kjønn, pinneantall, kabeltverrsnitt og spenning før montering.",
    ],
  });
});

const expandedProductAreas = {
  drivingLights: {
    category: "Ekstralys · LED-barer",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["capacity", "quality", "durability"],
  },
  warningLights: {
    category: "Varsellys · varsellys",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["quality", "durability", "flexibility"],
  },
  cameras: {
    category: "Ryggekamera · kamera og opptakere",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["quality", "flexibility", "durability"],
  },
  trailer: {
    category: "Tilhenger · kabler og kontakter",
    useCases: ["transport", "maintenance"],
    industries: ["Transport", "Verksted"],
    priorities: ["price", "flexibility"],
  },
  portableLights: {
    category: "Lommelykter · hode- og håndlykter",
    useCases: ["maintenance", "workshop", "construction", "agriculture"],
    industries: ["Verksted", "Entreprenør", "Landbruk"],
    priorities: ["flexibility", "quality", "price"],
  },
  loadSecuring: {
    category: "Lastsikring · stropper",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["price", "durability"],
  },
  carCare: {
    category: "Bilpleie · rengjøring og vedlikehold",
    useCases: ["maintenance", "workshop"],
    industries: ["Verksted", "Transport"],
    priorities: ["price", "flexibility"],
  },
  agriculture: {
    category: "Landbruk · slitedeler og festemateriell",
    useCases: ["agriculture", "maintenance"],
    industries: ["Landbruk"],
    priorities: ["durability", "quality"],
  },
} satisfies Record<
  string,
  Pick<JddProductSource, "category" | "useCases" | "industries" | "priorities">
>;

type ExpandedProductArea = keyof typeof expandedProductAreas;
type ExpandedJddProduct = Omit<
  JddProductSource,
  "category" | "useCases" | "industries" | "priorities"
> & { area: ExpandedProductArea };

const expandedJddProducts: Product[] = (
  [
    {
      area: "drivingLights",
      sku: "L7035-S",
      name: "Lumary Ignite 30 Black edition fjernlys",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/l7035-s/lumary-ignite-30-black-edition-fjernlys-spot-ekstralys-med-e-merke-ref-30",
      image:
        "https://www.jddutstyr.no/thumbnails/l7035-s.900.webp?v=639213617970670000",
      priceNok: 486,
      description: "Kompakt Lumary Ignite-fjernlys med spotlys for kjøretøy.",
      features: ["Fjernlys", "Spotlys", "Black Edition"],
    },
    {
      area: "drivingLights",
      sku: "L7011",
      name: "Lumary Vixen SR21 Black Edition LED-bar, combo beam",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/l7011/ledbar-lumary-vixen-sr21-black-edition-fjernlys-combo-beam-18511lm-ref-45",
      image:
        "https://www.jddutstyr.no/thumbnails/l7010.900.webp?v=639213630160700000",
      priceNok: 1194,
      description:
        "21-tommers Lumary Vixen SR21 LED-bar med combo beam-lysbilde.",
      features: ["21 tommer", "Combo beam", "Black Edition"],
    },
    {
      area: "drivingLights",
      sku: "L7010",
      name: "Lumary Vixen SR21 Black Edition LED-bar, spot",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/l7010/ledbar-lumary-vixen-sr21-black-edition-fjernlys-spot-13000lm-ref-45",
      image:
        "https://www.jddutstyr.no/thumbnails/l7010_20.900.webp?v=639213607179700000",
      priceNok: 1194,
      description:
        "21-tommers Lumary Vixen SR21 LED-bar med spotlys for fjernlys.",
      features: ["21 tommer", "Spotlys", "Black Edition"],
    },
    {
      area: "drivingLights",
      sku: "L7522-2",
      name: "Lumary Vixen DR22C kurvet dobbel LED-bar",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/l7522-2/lumary-vixen-dr22c-kurvet-dobbel-ledbar-dynamisk-parklys-side-og-skyve-brakett",
      image:
        "https://www.jddutstyr.no/thumbnails/l7522__.900.webp?v=639149506444030000",
      priceNok: 2773,
      description:
        "Kurvet dobbel LED-bar i Lumary Vixen DR-serien med dynamisk posisjonslys.",
      features: ["Kurvet dobbel LED-bar", "Dynamisk posisjonslys"],
    },
    {
      area: "drivingLights",
      sku: "L7411-2",
      name: "Lumary Vixen SR10 rett enrad LED-bar",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/l7411-2/lumary-vixen-sr10-rett-enrad-ledbar-uten-parklys-med-side-og-skyve-brakett",
      image:
        "https://www.jddutstyr.no/thumbnails/l7411_1_7.900.webp?v=639213630160700000",
      priceNok: 1106,
      description:
        "Rett enrad LED-bar fra Lumary Vixen SR-serien uten parklys.",
      features: ["Rett enrad LED-bar", "Uten parklys"],
    },
    {
      area: "drivingLights",
      sku: "L7413-2",
      name: "Lumary Vixen SR32 rett enrad LED-bar",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/l7413-2/lumary-vixen-sr32-rett-enrad-ledbar-dynamisk-parklys-side-og-skyve-brakette",
      image:
        "https://www.jddutstyr.no/thumbnails/l7413__.900.webp?v=639213631845970000",
      priceNok: 2773,
      description:
        "32-tommers rett LED-bar fra Lumary Vixen SR-serien med dynamisk posisjonslys.",
      features: ["32 tommer", "Rett enrad LED-bar", "Dynamisk posisjonslys"],
    },
    {
      area: "warningLights",
      sku: "V6130",
      name: "Varsellampe Lumary Mini LED med 3-boltfeste",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/v6130/varsellampe-lumary-mini-led-aluminium-3-bolt-r10-r65-kl1-10-30v",
      image:
        "https://www.jddutstyr.no/thumbnails/v6130_20.900.webp?v=638725083784500000",
      priceNok: 732,
      description:
        "Kompakt Lumary Mini LED-varsellampe med aluminiumsfot og 3-boltfeste.",
      features: ["Aluminiumsfot", "3-boltfeste", "10–30 V"],
    },
    {
      area: "warningLights",
      sku: "V6120",
      name: "Varsellampe Lumary Mini LED med piggfeste",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/v6120/varsellampe-lumary-mini-led-aluminium-piggfeste-r10-r65",
      image:
        "https://www.jddutstyr.no/thumbnails/v6120_20.900.webp?v=638725083784500000",
      priceNok: 824,
      description:
        "Lavbygd Lumary Mini LED-varsellampe med aluminiumsfot og piggfeste.",
      features: ["Lav profil", "Aluminiumsfot", "Piggfeste"],
    },
    {
      area: "warningLights",
      sku: "V4111",
      name: "Lumary lavprofil LED-varsellampe med magnet",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/v4111/varsellampe-lumary-lavprofil-led-magnet-sigarettplugg-48w-12-m%c3%b8nster",
      image:
        "https://www.jddutstyr.no/thumbnails/v4111_20.900.webp?v=638725083784500000",
      priceNok: 1109,
      description:
        "Lavprofil LED-varsellampe fra Lumary med magnetfeste og sigarettplugg.",
      features: ["Magnetfeste", "Sigarettplugg", "Lav profil"],
    },
    {
      area: "warningLights",
      sku: "V2118",
      name: "Lumary Econ roterende varsellys med piggfeste",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/v2118/lumary-econ-varselampe-for-pigg-montasje-velg-blinkm%c3%b8nsterved-%c3%a5-ta-av-glasset",
      image:
        "https://www.jddutstyr.no/thumbnails/milj%C3%B8bilder/wt-313dp_%281%29.900.webp?v=638725062963300000",
      priceNok: 552,
      description:
        "Roterende Lumary Econ-varsellys med fleksifot og piggmontering.",
      features: ["Roterende varsellys", "Fleksifot", "Piggmontering"],
    },
    {
      area: "warningLights",
      sku: "V4110",
      name: "Lumary lavprofil LED-varsellampe med 3-boltfeste",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/v4110/varsellampe-lumary-lavprofil-led-3-bolt-montering-48w-12-blinkm%c3%b8nster",
      image:
        "https://www.jddutstyr.no/thumbnails/v4110_20.900.webp?v=638725083784500000",
      priceNok: 871,
      description:
        "Lavprofil LED-varsellampe fra Lumary for montering med tre bolter.",
      features: ["Lav profil", "3-boltfeste", "LED"],
    },
    {
      area: "warningLights",
      sku: "V4112",
      name: "Lumary lavprofil varsellampe med røde LED",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/v4112/varsellys-lumary-lavprofil-med-r%c3%b8de-led-magnet-montering-og-sigarettplugg",
      image:
        "https://www.jddutstyr.no/thumbnails/v4112_20.900.webp?v=638725082844370000",
      priceNok: 1109,
      description:
        "Lavprofil varsellampe med røde LED, magnetfeste og sigarettplugg.",
      features: ["Røde LED", "Magnetfeste", "Sigarettplugg"],
    },
    {
      area: "cameras",
      sku: "DV456CVGW",
      name: "4-kanals HD analog videoopptaker med GPS og Wi-Fi",
      sourceUrl:
        "https://www.jddutstyr.no/sd-kamera/dv456cvgw/4-kanals-hd-analog-video-opptaker-med-innebygd-gps-og-wifi",
      image:
        "https://www.jddutstyr.no/thumbnails/dv456cvgw_7.900.webp?v=638725060632330000",
      priceNok: 5260,
      description:
        "Firekanals videoopptaker for kjøretøy med innebygd GPS og Wi-Fi.",
      features: ["4 kanaler", "GPS", "Wi-Fi"],
    },
    {
      area: "cameras",
      sku: "HD685",
      name: "HD-ryggekamera med bildekorreksjon",
      sourceUrl:
        "https://www.jddutstyr.no/24c/hd685/ryggekamera-med-unik-bildekorreksjon-100-170-hd-og-smart-ir",
      image:
        "https://www.jddutstyr.no/thumbnails/hd685_20.900.webp?v=638725071547570000",
      priceNok: 1642,
      description:
        "HD-ryggekamera med automatisk bildekorreksjon og Smart IR.",
      features: ["HD-bilde", "Automatisk bildekorreksjon", "Smart IR"],
    },
    {
      area: "cameras",
      sku: "HD664",
      name: "Ryggekamera med speilbrakett for blindsone",
      sourceUrl:
        "https://www.jddutstyr.no/24c/hd664/ryggekamera-med-speilbrakett-til-blindso-synsvinkel-er-110-med-hd-bilder",
      image:
        "https://www.jddutstyr.no/thumbnails/hd664_3.900.webp?v=638724359232100000",
      priceNok: 1536,
      description:
        "HD-kamera med utbyggingsbrakett for montering ved speil eller tak.",
      features: ["HD-bilde", "Speilbrakett", "110° synsvinkel"],
    },
    {
      area: "cameras",
      sku: "HD410",
      name: "HD-ryggekamera med 150° bilde",
      sourceUrl:
        "https://www.jddutstyr.no/24c/hd410/hd-ryggekamera-med-150-bilde-justerbar-linse-til-blinsdsone-og-ryggin",
      image:
        "https://www.jddutstyr.no/thumbnails/hd410_20.900.webp?v=638725090664470000",
      priceNok: 1691,
      description:
        "HD-kamera med justerbar linse for rygging eller visning av blindsonen.",
      features: ["HD-bilde", "150° synsvinkel", "Justerbar linse"],
    },
    {
      area: "cameras",
      sku: "HD676",
      name: "Blindsonekamera med 150° HD-bilde",
      sourceUrl:
        "https://www.jddutstyr.no/24c/hd676/blindsonekamera-med-150-hd-bilde-se-tilbeh%c3%b8r-for-speilbrakett",
      image:
        "https://www.jddutstyr.no/thumbnails/hd676_20.900.webp?v=638725091324470000",
      priceNok: 1565,
      description:
        "Allround HD-kamera for montering forover eller bakover på kjøretøy.",
      features: ["HD-bilde", "150° synsvinkel", "Forover- eller bakovermontering"],
    },
    {
      area: "cameras",
      sku: "HD769",
      name: "Ryggekamera med justerbar 150° linse",
      sourceUrl:
        "https://www.jddutstyr.no/24c/hd769/ryggekamera-med-justerbar-linse-150-syn-for-caravan-med-hd-bilder",
      image:
        "https://www.jddutstyr.no/thumbnails/hd769.900.webp?v=638725089421530000",
      priceNok: 1585,
      description:
        "HD-ryggekamera med vridbar linse for justering av synsretningen.",
      features: ["HD-bilde", "150° synsvinkel", "4-pins tilkobling"],
      compatibility: [
        {
          productId: "JDD-KAB01",
          status: "unknown",
          relationship: "optional",
          note:
            "Kameraet og kabelen har 4-pins tilkobling, men pinneoppsett og kontakttype er ikke verifisert som like.",
        },
        {
          productId: "JDD-KAB02",
          status: "unknown",
          relationship: "optional",
          note:
            "Kameraet og kabelen har 4-pins tilkobling, men pinneoppsett og kontakttype er ikke verifisert som like.",
        },
        {
          productId: "JDD-KAB03",
          status: "unknown",
          relationship: "optional",
          note:
            "Kabelen overfører mellom 4- og 5-pins kontakt. Kameraet er oppgitt med 4-pins tilkobling, men pinneoppsett og kontaktvariant må bekreftes.",
        },
        {
          productId: "JDD-KAB05",
          status: "unknown",
          relationship: "optional",
          note:
            "Kabelen går mellom RCA og 4-pins kontakt. Kameraets pinneoppsett og videostandard er ikke verifisert mot kabelen.",
        },
        {
          productId: "JDD-KAB4PIN-RCA",
          status: "unknown",
          relationship: "optional",
          note:
            "Kabelen går mellom 4-pins kontakt og RCA. Kameraets pinneoppsett og videostandard er ikke verifisert mot kabelen.",
        },
        {
          productId: "JDD-556-37",
          status: "unknown",
          relationship: "optional",
          note:
            "Overgangen har 4-pins kontakt i den ene enden, men krever også en 8-pins ADA-skjermkabel. Kontroller kameramodell og pinneoppsett.",
        },
      ],
    },
    {
      area: "cameras",
      sku: "CW638",
      name: "Blindsone- og universalkamera med 150° bilde",
      sourceUrl:
        "https://www.jddutstyr.no/24c/cw638/blindsone-og-universalt-kamera-med-150-bilde",
      image:
        "https://www.jddutstyr.no/thumbnails/cw-638_20.900.webp?v=638725091324470000",
      priceNok: 1097,
      description: "Universalkamera for blindsonevisning med 150° synsvinkel.",
      features: ["150° synsvinkel", "Universalkamera"],
    },
    {
      area: "trailer",
      sku: "5345",
      name: "13-polet kabelsett til tilhenger, 9 meter",
      sourceUrl:
        "https://www.jddutstyr.no/tilhenger-7-og-13-polet/5345/13-polet-kabelsett-til-tilhenger-9-meter-kabel-og-bajonett-kontakter",
      image:
        "https://www.jddutstyr.no/thumbnails/5345_20.900.webp?v=638725097393770000",
      priceNok: 663,
      description:
        "Kabelsett for tilhenger med 13-polet støpsel og kabler til baklykter.",
      features: ["13-polet støpsel", "9 meter kabel", "Bajonettkontakter"],
      compatibility: [
        {
          productId: "JDD-E1462",
          status: "compatible",
          relationship: "optional",
          note:
            "Begge produktene bruker 5-polede bajonettkontakter. Forgreningen er oppgitt for tilkobling av to lamper; kontroller lampevariant og belastning før montering.",
        },
        {
          productId: "JDD-5300",
          status: "unknown",
          relationship: "optional",
          note:
            "Begge har 13-polet tilkobling. Testeren kontrollerer bilens kontakt; bekreft spenning og bruksmåte for kabelsettet før kjøp.",
        },
      ],
    },
    {
      area: "trailer",
      sku: "131007",
      name: "12 V tilhengerkabelsett, 7 meter, 13-polet",
      sourceUrl:
        "https://www.jddutstyr.no/derax/131007/12v-tilhenger-kabelsett-7-meter-13-polet-7m-med-kabel-til-markeringslys",
      image:
        "https://www.jddutstyr.no/thumbnails/131007.900.webp?v=638725060632330000",
      priceNok: 716,
      description:
        "12 V kabelsett med 13-polet støpsel, bajonettkontakter og uttak for markeringslys.",
      features: ["13-polet støpsel", "7 meter kabel", "Markeringslyskabler"],
      compatibility: [
        {
          productId: "JDD-E1462",
          status: "compatible",
          relationship: "optional",
          note:
            "Kabelsettet har 5-polede bajonettkontakter, samme kontakttype som forgreningen. Kontroller lampevariant og belastning før montering.",
        },
        {
          productId: "JDD-5300",
          status: "compatible",
          relationship: "optional",
          note:
            "Begge er for 12 V tilhengeranlegg med 13-polet tilkobling. Testeren kontrollerer bilens kontakt før tilhengerkabelsettet kobles til.",
        },
      ],
    },
    {
      area: "trailer",
      sku: "131006",
      name: "12 V tilhengerkabelsett, 7 meter, 7-polet",
      sourceUrl:
        "https://www.jddutstyr.no/derax/131006/12v-tilhenger-kabelsett-7-meter-7-polet-7m-med-kabel-til-markeringslys",
      image:
        "https://www.jddutstyr.no/thumbnails/131006.900.webp?v=638725060632330000",
      priceNok: 655,
      description:
        "12 V kabelsett med 7-polet støpsel, bajonettkontakter og uttak for markeringslys.",
      features: ["7-polet støpsel", "7 meter kabel", "Markeringslyskabler"],
      compatibility: [
        {
          productId: "JDD-E1462",
          status: "compatible",
          relationship: "optional",
          note:
            "Kabelsettet har 5-polede bajonettkontakter, samme kontakttype som forgreningen. Kontroller lampevariant og belastning før montering.",
        },
        {
          productId: "JDD-EPTA03",
          status: "compatible",
          relationship: "optional",
          note:
            "Testeren støtter 7-polet tilkobling, og kabelsettet har 7-polet støpsel. Testeren brukes til å kontrollere kjøretøyets kontakt.",
        },
      ],
    },
    {
      area: "trailer",
      sku: "E1407",
      name: "7-leder tilhengerkabel",
      sourceUrl:
        "https://www.jddutstyr.no/7-leder/e1407/7-leder-tilhengerkabel-6-x-0-6mm--plus--1-x-1-0mm2",
      image:
        "https://www.jddutstyr.no/thumbnails/e1407_20.900.webp?v=638725097393770000",
      priceNok: 40,
      description: "7-leder kabel for elektrisk tilkobling av tilhenger.",
      features: ["7 ledere"],
      specifications: [
        { name: "Ledertverrsnitt", value: "6 × 0,6 + 1 × 1,0", unit: "mm²" },
      ],
    },
    {
      area: "trailer",
      sku: "E1462",
      name: "5-polet baklyktkontakt",
      sourceUrl:
        "https://www.jddutstyr.no/til-baklykter/e1462/5-polet-baklykt-kontakt-forgrening-til-to-lamper",
      image:
        "https://www.jddutstyr.no/thumbnails/e1462_20.900.webp?v=638725097393770000",
      priceNok: 119,
      description:
        "5-polet kontakt for forgrening mellom tilhengerkabel og to baklykter.",
      features: ["5-polet kontakt", "Forgrening til to lamper"],
      kind: "accessory",
      compatibility: [
        {
          productId: "JDD-5345",
          status: "compatible",
          relationship: "optional",
          note:
            "Begge produktene bruker 5-polede bajonettkontakter. Forgreningen er oppgitt for tilkobling av to lamper; kontroller lampevariant og belastning før montering.",
        },
        {
          productId: "JDD-131007",
          status: "compatible",
          relationship: "optional",
          note:
            "Begge produktene bruker 5-polede bajonettkontakter. Forgreningen er oppgitt for tilkobling av to lamper; kontroller lampevariant og belastning før montering.",
        },
        {
          productId: "JDD-131006",
          status: "compatible",
          relationship: "optional",
          note:
            "Begge produktene bruker 5-polede bajonettkontakter. Forgreningen er oppgitt for tilkobling av to lamper; kontroller lampevariant og belastning før montering.",
        },
      ],
    },
    {
      area: "trailer",
      sku: "5315",
      name: "Gul og grønn 5-polet bajonettkontakt",
      sourceUrl:
        "https://www.jddutstyr.no/til-baklykter/5315/gul-og-gr%c3%b8nn-5-polet-bajonet-kontakter-til-baklys",
      image:
        "https://www.jddutstyr.no/thumbnails/5315_20.900.webp?v=638725096583200000",
      priceNok: 92,
      description: "5-polet bajonettkontakt for tilhengerens baklys.",
      features: ["5-polet", "Bajonettkontakt"],
    },
    {
      area: "trailer",
      sku: "133827",
      name: "7-polet bajonettkontakt med 1 meter kabel",
      sourceUrl:
        "https://www.jddutstyr.no/bayonett-amp-og-hdscs/133827/7-polet-bajonet-kontakt-med-1-meter-kabe-1-meter-kabel-til-baklykt",
      image:
        "https://www.jddutstyr.no/thumbnails/133827.900.webp?v=638724336637870000",
      priceNok: 137,
      description:
        "Bajonettkontakt med 1 meter kabel for tilkobling til baklykt.",
      features: ["7-polet kontakt", "1 meter kabel"],
    },
    {
      area: "portableLights",
      sku: "S-HL82",
      name: "Superfire HL82 hodelykt med bevegelsessensor",
      sourceUrl:
        "https://www.jddutstyr.no/superfire/s-hl82/superfire-hl82-motion-sensor-hodelykt-bevegelsessensor-og-justerbar-vinkel",
      image:
        "https://www.jddutstyr.no/thumbnails/s-hl82.900.webp?v=638555094716970000",
      priceNok: 156,
      description:
        "Hodelykt fra Superfire med bevegelsessensor og justerbar lysvinkel.",
      features: ["Bevegelsessensor", "Justerbar vinkel"],
    },
    {
      area: "portableLights",
      sku: "S-HL60",
      name: "Superfire LED-hodelykt med USB-lading",
      sourceUrl:
        "https://www.jddutstyr.no/superfire/s-hl60/superfire-led-hodelykt-med-usb-lading-2500-lumen--36-watt--295-gram",
      image:
        "https://www.jddutstyr.no/thumbnails/s-hl60.900.webp?v=638555076461100000",
      priceNok: 366,
      description:
        "USB-ladbar Superfire-hodelykt med oppgitt lysstyrke på 2500 lumen.",
      features: ["USB-lading", "2500 lm", "36 W"],
      specifications: [
        { name: "Lysstyrke", value: "2500", unit: "lm" },
        { name: "Effekt", value: "36", unit: "W" },
      ],
    },
    {
      area: "portableLights",
      sku: "S-HL08",
      name: "Superfire LED-hodelykt med USB-lading",
      sourceUrl:
        "https://www.jddutstyr.no/superfire/s-hl08/superfire-led-hodelykt-med-usb-lading-2000-lumen-og-kun-225-gram",
      image:
        "https://www.jddutstyr.no/thumbnails/hl08.900.webp?v=638725116197230000",
      priceNok: 423,
      description:
        "USB-ladbar Superfire-hodelykt med oppgitt lysstyrke på 2000 lumen.",
      features: ["USB-lading", "2000 lm", "225 g"],
      specifications: [
        { name: "Lysstyrke", value: "2000", unit: "lm" },
        { name: "Vekt", value: "225", unit: "g" },
      ],
    },
    {
      area: "portableLights",
      sku: "S-TH03",
      name: "Superfire TH03 vinkellykt og hodelykt",
      sourceUrl:
        "https://www.jddutstyr.no/superfire/s-th03/superfire-th03-vinkellykt-og-hodelykt-460-lumen-og-kun-58-gram",
      image:
        "https://www.jddutstyr.no/thumbnails/s-th03.900.webp?v=638990575601070000",
      priceNok: 209,
      description:
        "Kompakt vinkellykt som også kan brukes som hodelykt, med roterbart lampehode.",
      features: ["460 lm", "180° roterbar", "58 g"],
      specifications: [
        { name: "Lysstyrke", value: "460", unit: "lm" },
        { name: "Vekt", value: "58", unit: "g" },
      ],
    },
    {
      area: "portableLights",
      sku: "L1407",
      name: "Lumary Edge FL 3500 oppladbar lommelykt",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/l1407/lumary-edge-fl-3500-lommelykt-oppladbar--3500-lumen",
      image:
        "https://www.jddutstyr.no/thumbnails/l1407_1.900.webp?v=639246263749370000",
      priceNok: 833,
      description:
        "Oppladbar Lumary-lommelykt med oppgitt lysstyrke på 3500 lumen og USB-C-lading.",
      features: ["3500 lm", "USB-C-lading", "IP54"],
      specifications: [
        { name: "Lysstyrke", value: "3500", unit: "lm" },
        { name: "Rekkevidde", value: "300", unit: "m" },
        { name: "Kapslingsgrad", value: "IP54" },
      ],
    },
    {
      area: "portableLights",
      sku: "L1413",
      name: "Lumary Edge FL 20000 oppladbar lommelykt",
      sourceUrl:
        "https://www.jddutstyr.no/lumary/l1413/lumary-edge-fl-20000-lommelykt-oppladbar--20-000-lumen",
      image:
        "https://www.jddutstyr.no/thumbnails/l1413_1.900.webp?v=639246335582570000",
      priceNok: 2793,
      description:
        "Oppladbar Lumary-lommelykt med opptil 20 000 lumen og oppgitt rekkevidde på 175 meter.",
      features: ["Opptil 20 000 lm", "175 m rekkevidde", "IP54"],
      specifications: [
        { name: "Lysstyrke", value: "20 000", unit: "lm" },
        { name: "Rekkevidde", value: "175", unit: "m" },
        { name: "Kapslingsgrad", value: "IP54" },
      ],
    },
    {
      area: "loadSecuring",
      sku: "133053",
      name: "Sett med 5 lange båndstropper, 1–2 meter",
      sourceUrl:
        "https://www.jddutstyr.no/jdd/133053/sett-med-5stk-lange-b%c3%a5ndstropper1-2meter-kan-brukes-til-nesten-alt",
      image:
        "https://www.jddutstyr.no/thumbnails/101556-2.900.webp?v=638845392231970000",
      priceNok: 168,
      description:
        "Sett med fem båndstropper i ulike lengder for sikring av last og utstyr.",
      features: ["5 stropper", "Lengder fra 1 til 2 meter"],
    },
    {
      area: "loadSecuring",
      sku: "133883",
      name: "Sett med 10 DERAX lange båndstropper",
      sourceUrl:
        "https://www.jddutstyr.no/derax/133883/sett-med-10stk-derax-lange-b%c3%a5ndstropper-100-200cm",
      image:
        "https://www.jddutstyr.no/thumbnails/101556-1.900.webp?v=638845392231970000",
      priceNok: 297,
      description:
        "Sett med ti DERAX-båndstropper i lengder fra 100 til 200 cm.",
      features: ["10 stropper", "Lengder fra 100 til 200 cm"],
    },
    {
      area: "loadSecuring",
      sku: "EPACC034",
      name: "Elastisk stropp 100 cm",
      sourceUrl:
        "https://www.jddutstyr.no/einparts/epacc034/elastisk-stropp-100cm-tykkelse-8mm-kroker-2",
      image:
        "https://www.jddutstyr.no/thumbnails/epacc034.900.webp?v=638558248497530000",
      priceNok: 29,
      description: "100 cm elastisk stropp med kroker i begge ender.",
      features: ["100 cm", "8 mm tykkelse", "2 kroker"],
      specifications: [{ name: "Lengde", value: "100", unit: "cm" }],
    },
    {
      area: "loadSecuring",
      sku: "EPACC035",
      name: "Elastiske stropper 200 cm, 2 stk",
      sourceUrl:
        "https://www.jddutstyr.no/einparts/epacc035/elastisk-stropp-200cm-2-stk-tykkelse-8mm-kroker-2",
      image:
        "https://www.jddutstyr.no/thumbnails/epacc035.900.webp?v=638557778171000000",
      priceNok: 65,
      description: "Sett med to 200 cm elastiske stropper med kroker.",
      features: ["2 stropper", "200 cm", "8 mm tykkelse"],
      specifications: [{ name: "Lengde", value: "200", unit: "cm" }],
    },
    {
      area: "loadSecuring",
      sku: "EPACC036",
      name: "Elastiske stropper 60 cm, 4 stk",
      sourceUrl:
        "https://www.jddutstyr.no/einparts/epacc036/elastisk-stropp-60cm-4-stk-tykkelse-8mm-kroker-2",
      image:
        "https://www.jddutstyr.no/thumbnails/epacc036.900.webp?v=638557778171000000",
      priceNok: 65,
      description: "Sett med fire 60 cm elastiske stropper med kroker.",
      features: ["4 stropper", "60 cm", "8 mm tykkelse"],
      specifications: [{ name: "Lengde", value: "60", unit: "cm" }],
    },
    {
      area: "carCare",
      sku: "PL-1013",
      name: "Prolab+ Interior Detailer",
      sourceUrl:
        "https://www.jddutstyr.no/prolab-plus/pl-1013/prolab-plus--interior-detailer-matt-interi%c3%b8rrens-500ml",
      image:
        "https://www.jddutstyr.no/thumbnails/pl-1013-1.900.webp?v=639124388442430000",
      priceNok: 90,
      description:
        "Interiørrens fra Prolab+ utviklet for rengjøring med matt finish.",
      features: ["Interiørrens", "500 ml", "Matt finish"],
      specifications: [{ name: "Volum", value: "500", unit: "ml" }],
    },
    {
      area: "carCare",
      sku: "PL-1019",
      name: "Prolab+ Leather Care",
      sourceUrl:
        "https://www.jddutstyr.no/prolab-plus/pl-1019/prolab-plus--leather-care-skinnkrem-og-beskyttelse-500ml",
      image:
        "https://www.jddutstyr.no/thumbnails/pl-1019-1.900.webp?v=639124388442430000",
      priceNok: 104,
      description:
        "Skinnpleieprodukt fra Prolab+ for pleie og beskyttelse av skinninteriør.",
      features: ["Skinnpleie", "Beskyttelse", "500 ml"],
      specifications: [{ name: "Volum", value: "500", unit: "ml" }],
    },
    {
      area: "carCare",
      sku: "PL-1000",
      name: "Prolab+ All Purpose Cleaner",
      sourceUrl:
        "https://www.jddutstyr.no/prolab-plus/pl-1000/prolab-plus--all-purpose-cleaner-konsentrert-universalrens-1000ml",
      image:
        "https://www.jddutstyr.no/thumbnails/pl-1000-1.900.webp?v=639112504063830000",
      priceNok: 132,
      description:
        "Konsentrert universalrengjøring fra Prolab+ for rengjøring av kjøretøy.",
      features: ["Universalrens", "Konsentrert", "1000 ml"],
      specifications: [{ name: "Volum", value: "1000", unit: "ml" }],
    },
    {
      area: "carCare",
      sku: "PL-1018",
      name: "Prolab+ Leather Cleaner",
      sourceUrl:
        "https://www.jddutstyr.no/prolab-plus/pl-1018/prolab-plus--leather-cleaner-effektiv-skinnrens-500ml",
      image:
        "https://www.jddutstyr.no/thumbnails/pl-1018-1.900.webp?v=639124388442430000",
      priceNok: 118,
      description:
        "Rengjøringsprodukt fra Prolab+ for skinnseter og skinninteriør.",
      features: ["Skinnrens", "500 ml"],
      specifications: [{ name: "Volum", value: "500", unit: "ml" }],
    },
    {
      area: "carCare",
      sku: "9661",
      name: "Turtle Wax Pro Interiörtvätt 5 L",
      sourceUrl:
        "https://www.jddutstyr.no/turtle-wax-professional/9661/turtle-wax-pro-interi%c3%b6rtv%c3%a4tt-5l-effektiv-og-sk%c3%a5nsom-innvendig-rengj%c3%b8ring",
      image:
        "https://www.jddutstyr.no/thumbnails/9661_turtle-wax-pro-interiortvatt-5l.900.webp?v=638536501461830000",
      priceNok: 529,
      description:
        "Konsentrert rengjøringsmiddel fra Turtle Wax for bilens interiør.",
      features: ["Interiørrens", "5 liter", "Konsentrert"],
      specifications: [{ name: "Volum", value: "5", unit: "l" }],
    },
    {
      area: "carCare",
      sku: "K9664",
      name: "Autoglym Odour Eliminator 500 ml",
      sourceUrl:
        "https://www.jddutstyr.no/autoglym/k9664/autoglym-odour-eliminator-500-ml-luktfrisker-og-od%c3%b8r-eliminator",
      image:
        "https://www.jddutstyr.no/thumbnails/k9664.900.webp?v=638531732586930000",
      priceNok: 189,
      description:
        "Luktfjerner fra Autoglym for bruk i kjøretøyets interiør.",
      features: ["Luktfjerner", "500 ml"],
      specifications: [{ name: "Volum", value: "500", unit: "ml" }],
    },
    {
      area: "agriculture",
      sku: "30-MU10-2",
      name: "Låsemutter M10 × 1,5, klasse 8.8",
      sourceUrl:
        "https://www.jddutstyr.no/industriehof/30-mu10-2/l%c3%a5semutter-m10x1-5-8-dot-8-passer-til-bomech-gylleteknikk",
      image:
        "https://www.jddutstyr.no/thumbnails/30-mu10-2.900.webp?v=639076702364370000",
      priceNok: 3,
      description:
        "Selvlåsende M10-mutter oppført for bruk i landbruksmaskiner.",
      features: ["M10 × 1,5", "Klasse 8.8"],
      specifications: [
        { name: "Gjengedimensjon", value: "M10 × 1,5" },
        { name: "Fasthetsklasse", value: "8.8" },
      ],
    },
    {
      area: "agriculture",
      sku: "1234KV",
      name: "Plogbolt M12 × 1,75 × 34, klasse 12.9",
      sourceUrl:
        "https://www.jddutstyr.no/industriehof/1234kv/plogbolt-m12x1-75x34-12-dot-9-mutter-din-934",
      image:
        "https://www.jddutstyr.no/thumbnails/1234kv.900.webp?v=639076704983400000",
      priceNok: 9,
      description:
        "Plogbolt med mutter, oppført for ploger fra Krone og Kuhn-Huard.",
      features: ["M12 × 1,75", "34 mm", "Klasse 12.9"],
      specifications: [
        { name: "Gjengedimensjon", value: "M12 × 1,75" },
        { name: "Lengde", value: "34", unit: "mm" },
        { name: "Fasthetsklasse", value: "12.9" },
      ],
    },
    {
      area: "agriculture",
      sku: "1.10.KIT-3",
      name: "Harvspiss-sett 210 × 35 × 6 mm",
      sourceUrl:
        "https://www.jddutstyr.no/industriehof/1-dot-10-dot-kit-3/harvspiss-sett-210x35x6-mm",
      image:
        "https://www.jddutstyr.no/thumbnails/1_10_kit-3.900.webp?v=639076708776670000",
      priceNok: 1334,
      description: "Gåsefotformet harvspiss-sett for harvtinder.",
      features: ["210 × 35 × 6 mm", "Sett"],
      specifications: [
        { name: "Mål", value: "210 × 35 × 6", unit: "mm" },
      ],
    },
    {
      area: "agriculture",
      sku: "104593110",
      name: "Bolt M10 × 1,5 × 45, klasse 10.9",
      sourceUrl:
        "https://www.jddutstyr.no/industriehof/104593110/bolt-m10x1-5x45-10-dot-9-u-mutter",
      image:
        "https://www.jddutstyr.no/thumbnails/104593110.900.webp?v=639076705351400000",
      priceNok: 10,
      description: "Sekskantbolt oppført som reservedel til harv.",
      features: ["M10 × 1,5", "45 mm", "Klasse 10.9"],
      specifications: [
        { name: "Gjengedimensjon", value: "M10 × 1,5" },
        { name: "Lengde", value: "45", unit: "mm" },
        { name: "Fasthetsklasse", value: "10.9" },
      ],
    },
    {
      area: "agriculture",
      sku: "10.1045-2",
      name: "Slitedel til Väderstad Rapid",
      sourceUrl:
        "https://www.jddutstyr.no/industriehof/10-dot-1045-2/slitedel-til-v%c3%a4derstad-rapid-300-400-c-s",
      image:
        "https://www.jddutstyr.no/thumbnails/10_1045-2.900.webp?v=639076708242800000",
      priceNok: 235,
      description:
        "Slitedel oppført for Väderstad Rapid 300/400 C/S.",
      features: ["Reservedel til jordbearbeiding", "Väderstad Rapid 300/400 C/S"],
    },
    {
      area: "agriculture",
      sku: "10.1054",
      name: "Sloddeplanketind 45 × 10 mm",
      sourceUrl:
        "https://www.jddutstyr.no/industriehof/10-dot-1054/sloddeplanketind-45x10-mm-til-kuhn-megant-450-500-560-600",
      image:
        "https://www.jddutstyr.no/thumbnails/10_1054.900.webp?v=639076708167770000",
      priceNok: 452,
      description:
        "Sloddeplanketind oppført for Kuhn Megant-modellene 450, 500, 560 og 600.",
      features: ["45 × 10 mm", "Kuhn Megant 450/500/560/600"],
      specifications: [{ name: "Mål", value: "45 × 10", unit: "mm" }],
    },
    {
      area: "agriculture",
      sku: "101.5120",
      name: "Sporløsertind til Kongskilde Stonebear",
      sourceUrl:
        "https://www.jddutstyr.no/industriehof/101-dot-5120/sporl%c3%b8sertind-til-kongskilde-stonebear",
      image:
        "https://www.jddutstyr.no/thumbnails/industri/101_5120.900.webp?v=639053155536000000",
      priceNok: 537,
      description:
        "Sporløsertind oppført som reservedel til Kongskilde Stonebear.",
      features: ["Reservedel til steinoppsamler", "Kongskilde Stonebear"],
    },
  ] satisfies ExpandedJddProduct[]
).map(({ area, ...product }) =>
  createJddProduct({ ...expandedProductAreas[area], ...product }),
);

const additionalJddProducts: Product[] = [
  ...electricalInstallProducts,
  ...expandedJddProducts,
  createJddProduct({
    sku: "V2235",
    name: "Varsellysbjelke Lumary Blaze 100 cm",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/v2235/varsellysbjelke-lumary-blaze-silver-line-100-cm-nattsenking-nano",
    image: "https://www.jddutstyr.no/thumbnails/v2240__3.900.webp?v=638948187093330000",
    priceNok: 8568,
    category: "Varsellys · varsellysbjelker",
    description:
      "100 cm LED-varsellysbjelke med 32 blinkmønstre, nattsenking og oransje strobelys.",
    useCases: ["construction", "transport", "agriculture"],
    industries: ["Entreprenør", "Transport", "Landbruk"],
    priorities: ["quality", "durability"],
    features: ["100 cm", "32 blinkmønstre", "Nattsenking"],
    specifications: [
      { name: "Lengde", value: "100", unit: "cm" },
      { name: "Blinkmønstre", value: "32" },
    ],
  }),
  createJddProduct({
    sku: "V5030",
    name: "Varsellysbjelke Lumary Guardian Silver Line",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/v5030/varsellysbjelke-lumary-guardian-silver-line-106-cm-med-oransej-glass",
    image: "https://www.jddutstyr.no/thumbnails/v5030.900.webp?v=638725159749130000",
    priceNok: 7416,
    category: "Varsellys · varsellysbjelker",
    description:
      "106 cm varsellysbjelke i Lumarys Guardian-serie for kjøretøy og arbeidsmaskiner.",
    useCases: ["construction", "transport", "agriculture"],
    industries: ["Entreprenør", "Transport", "Landbruk"],
    priorities: ["quality", "durability"],
    features: ["106 cm", "Oransje glass", "Guardian-serien"],
    specifications: [{ name: "Lengde", value: "106", unit: "cm" }],
  }),
  createJddProduct({
    sku: "V7000",
    name: "Lumary All In One takbjelke 121 cm",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/v7000/lumary-all-in-one-takbjelke-121-cm-ekstralys-varsellys-arbeidslys-baklykter",
    image: "https://www.jddutstyr.no/thumbnails/v7000_1.900.webp?v=638724355296600000",
    priceNok: 8339,
    category: "Varsellys · kombinasjonsbjelker",
    description:
      "Takbjelke som kombinerer varsellys, ekstralys, arbeidslys og baklys.",
    useCases: ["construction", "transport", "agriculture"],
    industries: ["Entreprenør", "Transport", "Landbruk"],
    priorities: ["capacity", "flexibility"],
    features: ["121 cm", "Varsellys", "Ekstralys", "Arbeidslys og baklys"],
    specifications: [{ name: "Lengde", value: "121", unit: "cm" }],
  }),
  createJddProduct({
    sku: "12-30411-E",
    name: "107 cm Vision Alert 12+ varsellysbjelke",
    sourceUrl:
      "https://www.jddutstyr.no/ecco/12-30411-e/107cm-vision-alert-12-plus--varsellysbro-mange-funksjoner",
    image: "https://www.jddutstyr.no/thumbnails/12-30411-e_20.900.webp?v=638725088109970000",
    priceNok: 6701,
    category: "Varsellys · varsellysbjelker",
    description:
      "107 cm Vision Alert-varsellysbjelke med kontrollboks for flere kjøretøytyper.",
    useCases: ["construction", "transport"],
    industries: ["Entreprenør", "Transport"],
    priorities: ["quality", "durability"],
    features: ["107 cm", "Kontrollboks", "Vision Alert 12+"],
    specifications: [{ name: "Lengde", value: "107", unit: "cm" }],
  }),
  createJddProduct({
    sku: "V5015",
    name: "Varsellysbjelke Lumary Guardian 77 cm",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/v5015/varsellysbjelke-lumary-guardian-silver-line-77-cm-med-oransje-glass",
    image: "https://www.jddutstyr.no/thumbnails/v5015-1.900.webp?v=638725159749130000",
    priceNok: 5839,
    category: "Varsellys · varsellysbjelker",
    description:
      "77 cm varsellysbjelke fra Lumary Guardian-serien med oransje glass.",
    useCases: ["construction", "transport", "agriculture"],
    industries: ["Entreprenør", "Transport", "Landbruk"],
    priorities: ["price", "durability"],
    features: ["77 cm", "Oransje glass", "Guardian-serien"],
    specifications: [{ name: "Lengde", value: "77", unit: "cm" }],
  }),
  createJddProduct({
    sku: "SETTHD140-ADA32",
    name: "AI ryggekamerasett med ADA-teknologi",
    sourceUrl:
      "https://www.jddutstyr.no/24c/setthd140-ada32/ai-ryggekamerasett-med-ada-teknologi-varsler-n%c3%a5r-personer-er-i-ryggesonen",
    image: "https://www.jddutstyr.no/thumbnails/setthd140-ada32.900.webp?v=638725045697970000",
    priceNok: 8988,
    category: "Ryggekamera · komplette sett",
    description:
      "Komplett sett med 7-tommers HD-skjerm og kamera med ADA-varsling for ryggesonen.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["quality", "durability"],
    features: ["7-tommers HD-skjerm", "ADA-varsling", "Kamera inkludert"],
    specifications: [{ name: "Skjerm", value: "7", unit: "tommer" }],
  }),
  createJddProduct({
    sku: "HDQ121-871",
    name: "7-tommers trådløst HD ryggekamerasett med Quad",
    sourceUrl:
      "https://www.jddutstyr.no/24c/hdq121-871/7-tr%c3%a5dl%c3%b8st-hd-ryggekamerasett-med-quad-sett-med-skjerm-og-ett-kamera-med-varme",
    image: "https://www.jddutstyr.no/thumbnails/hdq121-871.900.webp?v=638725066708270000",
    priceNok: 5978,
    category: "Ryggekamera · trådløse sett",
    description:
      "Trådløst HD-sett med 7-tommers skjerm og kamera med varme.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["quality", "flexibility"],
    features: ["Trådløst HD-bilde", "7-tommers skjerm", "Kamera med varme"],
    specifications: [{ name: "Skjerm", value: "7", unit: "tommer" }],
  }),
  createJddProduct({
    sku: "HDQ121-897",
    name: "7-tommers mobilt trådløst HD ryggekamerasett",
    sourceUrl:
      "https://www.jddutstyr.no/24c/hdq121-897/7-tr%c3%a5dl%c3%b8st-mobilt-hd-ryggekamerasett-mobilt--and--brukervennlig-opptil-4-kamera",
    image: "https://www.jddutstyr.no/thumbnails/hdq121-897.900.webp?v=638725065903870000",
    priceNok: 7219,
    category: "Ryggekamera · mobile sett",
    description:
      "Flyttbart trådløst kamerasett med batteridrevet kamera og magnetfeste.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["flexibility", "quality"],
    features: ["Flyttbart mellom maskiner", "Magnetfeste", "Batteridrevet kamera"],
    specifications: [{ name: "Skjerm", value: "7", unit: "tommer" }],
  }),
  createJddProduct({
    sku: "HDQ295-871-2",
    name: "9-tommers trådløst proff HD ryggekamerasett",
    sourceUrl:
      "https://www.jddutstyr.no/24c/hdq295-871-2/9-tr%c3%a5dl%c3%b8st-proff-hd-ryggekamerasett-med-2-stk-ryggekamera-med-hd-bilde",
    image: "https://www.jddutstyr.no/thumbnails/hdq295-871-2.900.webp?v=638725064906430000",
    priceNok: 9943,
    category: "Ryggekamera · trådløse sett",
    description:
      "Profesjonelt trådløst HD-sett med 9-tommers skjerm og støtte for flere kamerabilder.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["capacity", "quality"],
    features: ["9-tommers HD-skjerm", "Touch", "Flere kamerakanaler"],
    specifications: [{ name: "Skjerm", value: "9", unit: "tommer" }],
  }),
  createJddProduct({
    sku: "HDQ125-835-871",
    name: "7-tommers trådløst sett med to HD-kameraer",
    sourceUrl:
      "https://www.jddutstyr.no/24c/hdq125-835-871/7-tr%c3%a5dl%c3%b8st-sett-med-to-hd-kamera-ett-med-varme-og-ett-med-lukkefunksjon",
    image: "https://www.jddutstyr.no/thumbnails/hdq125-835-871.900.webp?v=638725066708270000",
    priceNok: 9678,
    category: "Ryggekamera · trådløse sett",
    description:
      "Trådløst HD-sett med 7-tommers skjerm og to kameraer med ulike funksjoner.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["capacity", "flexibility"],
    features: ["7-tommers HD-skjerm", "To kameraer", "Kamera med varme"],
    specifications: [{ name: "Kameraer", value: "2 stk." }],
  }),
  createJddProduct({
    sku: "T160",
    name: "Lumary Tail multibar 4 i 1",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/t160/lumary-tail-multibar-4-i-1-ryggelys-bremselys--blinklys",
    image: "https://www.jddutstyr.no/thumbnails/t160.900.webp?v=638725041161870000",
    priceNok: 924,
    category: "Baklykter · multifunksjonslys",
    description:
      "Baklykt med ryggelys, bremselys, bakposisjonslys og blinklys i én enhet.",
    useCases: ["transport", "agriculture"],
    industries: ["Transport", "Landbruk"],
    priorities: ["flexibility", "durability"],
    features: ["Ryggelys", "Bremselys", "Bakposisjonslys", "Blinklys"],
  }),
  createJddProduct({
    sku: "SETT-L4400-1",
    name: "Sett med to runde baklys",
    sourceUrl:
      "https://www.jddutstyr.no/fristom/sett-l4400-1/sett-med-2-stk-runde-baklys-for-begge-sider-bajonett-kontakt",
    image: "https://www.jddutstyr.no/thumbnails/sett-l4400-1.900.webp?v=638725067555800000",
    priceNok: 2211,
    category: "Baklykter · tilhenger",
    description:
      "Sett med to runde baklys og kabelsett for montering på tilhenger.",
    useCases: ["transport", "agriculture"],
    industries: ["Transport", "Landbruk"],
    priorities: ["flexibility", "quality"],
    features: ["To baklys", "13-polet støpsel", "Kabelsett inkludert"],
    specifications: [{ name: "Baklys", value: "2 stk." }],
    compatibility: [
      {
        productId: "JDD-5300",
        status: "unknown",
        relationship: "optional",
        note:
          "Begge har 13-polet tilkobling. Testeren kontrollerer bilens kontakt; bekreft spenning og bruksmåte for lyssettet før kjøp.",
      },
    ],
  }),
  createJddProduct({
    sku: "L1853",
    name: "Baklyktsett i LED med magneter",
    sourceUrl:
      "https://www.jddutstyr.no/truckled/l1853/baklyktsett-i-led-med-trekanter-og-magneter",
    image: "https://www.jddutstyr.no/thumbnails/l1853_20.900.webp?v=638725096583200000",
    priceNok: 591,
    category: "Baklykter · magnetsett",
    description:
      "LED-baklyktsett med magneter og reflekstrekanter for midlertidig montering.",
    useCases: ["transport", "agriculture"],
    industries: ["Transport", "Landbruk"],
    priorities: ["price", "flexibility"],
    features: ["LED", "Magnetfeste", "Reflekstrekanter", "12/24 V"],
    specifications: [{ name: "Spenning", value: "12/24", unit: "V" }],
  }),
  createJddProduct({
    sku: "T170",
    name: "Lumary trådløst 7-polet baklyktsett",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/t170/lumary-tr%c3%a5dl%c3%b8st-7-polet-baklyktsett-med-magneter-og-usb-lading-i-koffert",
    image: "https://www.jddutstyr.no/thumbnails/t170_3.900.webp?v=638724354164930000",
    priceNok: 1303,
    category: "Baklykter · trådløse sett",
    description:
      "Trådløst tilhengerlyssett med magnetfeste og oppladbare lykter.",
    useCases: ["transport", "agriculture"],
    industries: ["Transport", "Landbruk"],
    priorities: ["flexibility", "quality"],
    features: ["Trådløst", "Magnetfeste", "USB-lading", "7-polet"],
    compatibility: [
      {
        productId: "JDD-5310",
        status: "compatible",
        relationship: "optional",
        note:
          "Begge bruker 12 V og 7-polet tilhengerkontakt. Testeren kontrollerer bilens kontakt før bruk av lyssettet.",
      },
      {
        productId: "JDD-EPTA03",
        status: "compatible",
        relationship: "optional",
        note:
          "Testeren støtter 7-polet tilkobling, og lyssettet er oppgitt med 7-polet støpsel. Testeren brukes til å kontrollere kjøretøyets kontakt.",
      },
    ],
  }),
  createJddProduct({
    sku: "L1401",
    name: "Lumary Edge HL 450 hodelykt",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l1401/lumary-edge-hl-450-hodelykt-oppladbar--450-lumen",
    image: "https://www.jddutstyr.no/thumbnails/l1401-1.900.webp?v=639275833652100000",
    priceNok: 179,
    category: "Hodelykter · oppladbare",
    description:
      "Lett, oppladbar hodelykt med 450 lm, sensorstyring og USB-C-lading.",
    useCases: ["maintenance", "workshop", "other"],
    industries: ["Verksted", "Vedlikehold", "Fritid"],
    priorities: ["price", "flexibility"],
    features: ["450 lm", "Sensorstyring", "USB-C-lading"],
    specifications: [{ name: "Lysstyrke", value: "450", unit: "lm" }],
  }),
  createJddProduct({
    sku: "L1412",
    name: "Lumary Edge HL 2000 hodelykt",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l1412/lumary-edge-hl-2000-hodelykt-oppladbar--2000-lumen",
    image: "https://www.jddutstyr.no/thumbnails/l1412_1.900.webp?v=639246332305930000",
    priceNok: 958,
    category: "Hodelykter · oppladbare",
    description:
      "Oppladbar hodelykt med opptil 2000 lm, boost-modus og 170 m rekkevidde.",
    useCases: ["maintenance", "construction", "workshop", "other"],
    industries: ["Verksted", "Entreprenør", "Vedlikehold"],
    priorities: ["capacity", "quality"],
    features: ["2000 lm", "170 m rekkevidde", "USB-C-lading", "IP54"],
    specifications: [
      { name: "Lysstyrke", value: "2000", unit: "lm" },
      { name: "Rekkevidde", value: "170", unit: "m" },
    ],
  }),
  createJddProduct({
    sku: "L1411",
    name: "Lumary Edge HL 700 hodelykt",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l1411/lumary-edge-hl-700-hodelykt-oppladbar--700-lumen",
    image: "https://www.jddutstyr.no/thumbnails/l1411_1.900.webp?v=639246296519530000",
    priceNok: 608,
    category: "Hodelykter · oppladbare",
    description:
      "Oppladbar hodelykt med 700 lm, rødt lys og USB-C-lading.",
    useCases: ["maintenance", "workshop", "other"],
    industries: ["Verksted", "Vedlikehold", "Fritid"],
    priorities: ["quality", "flexibility"],
    features: ["700 lm", "Rødt lys", "USB-C-lading", "IP54"],
    specifications: [{ name: "Lysstyrke", value: "700", unit: "lm" }],
  }),
  createJddProduct({
    sku: "L1402",
    name: "Lumary Edge HL 800 hodelykt",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l1402/lumary-edge-hl-800-hodelykt-oppladbar--800-lumen",
    image: "https://www.jddutstyr.no/thumbnails/l1402_1.900.webp?v=639246224430270000",
    priceNok: 697,
    category: "Hodelykter · oppladbare",
    description:
      "Hodelykt med spot- og flomlys, 800 lm og opptil fire timers batteritid.",
    useCases: ["maintenance", "construction", "workshop", "other"],
    industries: ["Verksted", "Entreprenør", "Vedlikehold"],
    priorities: ["capacity", "quality"],
    features: ["800 lm", "Spot- og flomlys", "USB-C-lading", "IP54"],
    specifications: [
      { name: "Lysstyrke", value: "800", unit: "lm" },
      { name: "Batteritid", value: "Opptil 4 timer" },
    ],
  }),
  createJddProduct({
    sku: "133274",
    name: "Sett med 20 Derax båndstropper",
    sourceUrl:
      "https://www.jddutstyr.no/derax/133274/sett-med-hele-20stk-derax-b%c3%a5ndstropper-0-5-til-2meter-dot-kan-brukes-til-nesten-alt",
    image: "https://www.jddutstyr.no/thumbnails/101556-8.900.webp?v=638845389144370000",
    priceNok: 559,
    category: "Lastsikring · båndstropper",
    description:
      "Sett med 20 stropper i ulike lengder for surring og sikring av last.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["price", "flexibility"],
    features: ["20 stropper", "Lengder fra 50 til 200 cm", "Automatisk lås"],
    specifications: [{ name: "Antall", value: "20 stk." }],
  }),
  createJddProduct({
    sku: "133888",
    name: "Sett med 10 lange båndstropper 2 m",
    sourceUrl:
      "https://www.jddutstyr.no/jdd/133888/sett-med-10stk-lange-b%c3%a5ndstropper-2m-kan-brukes-til-nesten-alt",
    image: "https://www.jddutstyr.no/thumbnails/101556-1.900.webp?v=638845392231970000",
    priceNok: 378,
    category: "Lastsikring · båndstropper",
    description:
      "Sett med ti 2-meters båndstropper med automatisk lås for surring av last.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["price", "flexibility"],
    features: ["10 stropper", "2 m lengde", "Automatisk lås"],
    specifications: [
      { name: "Antall", value: "10 stk." },
      { name: "Lengde", value: "200", unit: "cm" },
    ],
  }),
  createJddProduct({
    sku: "101562",
    name: "Sett med fem korte båndstropper",
    sourceUrl:
      "https://www.jddutstyr.no/jdd/101562/sett-med-5stk-korte-b%c3%a5ndstropper50-100cm-kan-brukes-til-nesten-alt",
    image: "https://www.jddutstyr.no/thumbnails/101556-2.900.webp?v=638845392231970000",
    priceNok: 119,
    category: "Lastsikring · båndstropper",
    description:
      "Fem korte stropper fra 50 til 100 cm for sikring av mindre last og utstyr.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["price", "flexibility"],
    features: ["5 stropper", "Lengder fra 50 til 100 cm", "Automatisk lås"],
    specifications: [{ name: "Antall", value: "5 stk." }],
  }),
  createJddProduct({
    sku: "133882",
    name: "Sett med 10 Derax korte båndstropper",
    sourceUrl:
      "https://www.jddutstyr.no/derax/133882/sett-med-10stk-derax-korte-b%c3%a5ndstropper-50-100cm",
    image: "https://www.jddutstyr.no/thumbnails/101556-1.900.webp?v=638845392231970000",
    priceNok: 262,
    category: "Lastsikring · båndstropper",
    description:
      "Sett med ti korte stropper i lengder fra 50 til 100 cm for lastsikring.",
    useCases: ["transport", "construction", "agriculture"],
    industries: ["Transport", "Entreprenør", "Landbruk"],
    priorities: ["price", "flexibility"],
    features: ["10 stropper", "Lengder fra 50 til 100 cm", "Automatisk lås"],
    specifications: [{ name: "Antall", value: "10 stk." }],
  }),
  createJddProduct({
    sku: "132854",
    name: "Krympetang til DT, DTM og DTP-kontakter",
    sourceUrl:
      "https://www.jddutstyr.no/derax/132854/krympetang-til-dt-dtm-og-dtp-kontakter-leveres-med-tre-krympekjefter",
    image: "https://www.jddutstyr.no/thumbnails/132854_3.900.webp?v=638725037908230000",
    priceNok: 3169,
    category: "Verktøy · elektrisk installasjon",
    description:
      "Krympetang med tre kjefter for montering av DT-, DTM- og DTP-kontakter.",
    useCases: ["workshop", "maintenance"],
    industries: ["Verksted", "Vedlikehold", "Elektrisk installasjon"],
    priorities: ["quality", "durability"],
    features: ["Tre krympekjefter", "DT-, DTM- og DTP-kontakter"],
    specifications: [{ name: "Vekt", value: "0,7", unit: "kg" }],
  }),
  createJddProduct({
    sku: "132855",
    name: "Luftslange med blåsepistol",
    sourceUrl:
      "https://www.jddutstyr.no/derax/132855/luftslange-med-bl%c3%a5sepistol-sett-for-trykkluftrengj%c3%b8ring",
    image: "https://www.jddutstyr.no/thumbnails/132855_5.900.webp?v=638725037908230000",
    priceNok: 296,
    category: "Verktøy · trykkluft",
    description:
      "Sett med spiralluftslange, T-stykke og blåsepistol for rengjøring med trykkluft.",
    useCases: ["workshop", "maintenance"],
    industries: ["Verksted", "Vedlikehold"],
    priorities: ["price", "flexibility"],
    features: ["Spiralluftslange", "Blåsepistol", "T-stykke"],
  }),
  createJddProduct({
    sku: "132802",
    name: "Universalt terminal-pin verktøysett",
    sourceUrl:
      "https://www.jddutstyr.no/derax/132802/universalt-terminal-pin-verkt%c3%b8ysett-23-vert%c3%b8y-til-%c3%a5-demontere-str%c3%b8mstikkere",
    image: "https://www.jddutstyr.no/thumbnails/132802.900.webp?v=638725044591500000",
    priceNok: 1039,
    category: "Verktøy · elektrisk installasjon",
    description:
      "Sett med 23 verktøy for å løsne ledningspinner fra ulike elektriske kontakter.",
    useCases: ["workshop", "maintenance"],
    industries: ["Verksted", "Vedlikehold", "Elektrisk installasjon"],
    priorities: ["quality", "flexibility"],
    features: ["23 verktøy", "Grep med gummihåndtak", "For elektriske kontakter"],
    specifications: [{ name: "Antall verktøy", value: "23" }],
  }),
  createJddProduct({
    sku: "5310",
    name: "7-polet tester til tilhengerkontakt",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/5310/7-polet-tester-til-tilhengerkontakt-for-12-volt-med-led-indikatorer",
    image: "https://www.jddutstyr.no/thumbnails/5310_2.900.webp?v=638724359232100000",
    priceNok: 308,
    category: "Verktøy · tilhenger",
    description:
      "12 V tester med LED-indikatorer for kontroll av 7-polet tilhengerkontakt.",
    useCases: ["workshop", "maintenance", "transport"],
    industries: ["Verksted", "Transport", "Vedlikehold"],
    priorities: ["price", "flexibility"],
    features: ["7-polet kontakt", "12 V", "LED-indikatorer"],
    kind: "accessory",
    compatibility: [
      {
        productId: "JDD-T170",
        status: "compatible",
        relationship: "optional",
        note:
          "Begge bruker 12 V og 7-polet tilhengerkontakt. Testeren kontrollerer bilens kontakt før bruk av lyssettet.",
      },
    ],
    specifications: [
      { name: "Spenning", value: "12", unit: "V" },
      { name: "Kontakt", value: "7-polet" },
    ],
  }),
  createJddProduct({
    sku: "PL-1012",
    name: "Prolab+ Engine Cleaner",
    sourceUrl:
      "https://www.jddutstyr.no/prolab-plus/pl-1012/prolab-plus--engine-cleaner-aktiv-motorvask-500ml",
    image: "https://www.jddutstyr.no/thumbnails/pl-1012-1.900.webp?v=639124383764800000",
    priceNok: 104,
    category: "Bil- og maskinpleie · motorvask",
    description:
      "Aktiv motorvask som bidrar til å løse opp oljesøl og smuss i motorrommet.",
    useCases: ["maintenance", "workshop"],
    industries: ["Verksted", "Bilpleie", "Vedlikehold"],
    priorities: ["price", "flexibility"],
    features: ["Motorromsrens", "500 ml"],
    specifications: [{ name: "Volum", value: "500", unit: "ml" }],
  }),
  createJddProduct({
    sku: "PL-1001",
    name: "Prolab+ Mud Wash",
    sourceUrl:
      "https://www.jddutstyr.no/prolab-plus/pl-1001/prolab-plus--mud-wash-effektiv-vask-1000ml",
    image: "https://www.jddutstyr.no/thumbnails/pl-1001-1.900.webp?v=639201493793630000",
    priceNok: 90,
    category: "Bil- og maskinpleie · forvask",
    description:
      "Vaskemiddel utviklet for å løsne gjørme fra motorsykler, sykler og maskiner.",
    useCases: ["maintenance", "agriculture", "other"],
    industries: ["Bilpleie", "Landbruk", "Verksted"],
    priorities: ["price", "flexibility"],
    features: ["Forvask", "For kjøretøy og maskiner", "1000 ml"],
    specifications: [{ name: "Volum", value: "1000", unit: "ml" }],
  }),
  createJddProduct({
    sku: "K9792",
    name: "Autoglym Polar Wash 2,5 l",
    sourceUrl:
      "https://www.jddutstyr.no/autoglym/k9792/autoglym-polar-wash-2-5-l-h%c3%b8ytrykkshampoo",
    image: "https://www.jddutstyr.no/thumbnails/k9792.900.webp?v=638556866120400000",
    priceNok: 319,
    category: "Bil- og maskinpleie · høytrykkssjampo",
    description:
      "Sjampo for bruk med høytrykksspyler som del av Autoglyms Polar-serie.",
    useCases: ["maintenance", "workshop", "other"],
    industries: ["Bilpleie", "Verksted"],
    priorities: ["quality", "flexibility"],
    features: ["For høytrykksspyler", "2,5 l"],
    specifications: [{ name: "Volum", value: "2,5", unit: "l" }],
  }),
  createJddProduct({
    sku: "K9787",
    name: "Autoglym Polar Blast 2,5 l",
    sourceUrl:
      "https://www.jddutstyr.no/autoglym/k9787/autoglym-polar-blast-2-5-l-skums%c3%a5pe-forvask-avfetting",
    image: "https://www.jddutstyr.no/thumbnails/k9787.900.webp?v=638556866120400000",
    priceNok: 381,
    category: "Bil- og maskinpleie · forvask",
    description:
      "Høytskummende forvask som legger et skumlag på kjøretøyets overflate.",
    useCases: ["maintenance", "workshop", "other"],
    industries: ["Bilpleie", "Verksted"],
    priorities: ["quality", "flexibility"],
    features: ["Forvask", "Høytskummende", "2,5 l"],
    specifications: [{ name: "Volum", value: "2,5", unit: "l" }],
  }),
  createJddProduct({
    sku: "1.10.130S",
    name: "Harvspiss 210 × 35 × 6 mm",
    sourceUrl:
      "https://www.jddutstyr.no/industriehof/1-dot-10-dot-130s/harvspiss-210x35x6-mm-til-v%c3%a4derstad-front-tiller",
    image: "https://www.jddutstyr.no/thumbnails/1_10_130s.900.webp?v=639076682368170000",
    priceNok: 41,
    category: "Landbruk · jordarbeiding",
    description:
      "Harvspiss for jordarbeiding; kontroller redskapsmodell og mål før valg.",
    useCases: ["agriculture"],
    industries: ["Landbruk"],
    priorities: ["price", "durability"],
    features: ["210 × 35 × 6 mm", "Harvspiss"],
    specifications: [{ name: "Mål", value: "210 × 35 × 6", unit: "mm" }],
  }),
  createJddProduct({
    sku: "1.10.KIT-2",
    name: "Harvspiss sett 210 × 35 × 6 mm",
    sourceUrl:
      "https://www.jddutstyr.no/industriehof/1-dot-10-dot-kit-2/harvspiss-sett-210x35x6-mm",
    image: "https://www.jddutstyr.no/thumbnails/1_10_kit-2.900.webp?v=639076708776670000",
    priceNok: 1286,
    category: "Landbruk · jordarbeiding",
    description:
      "Sett med gåsefot-skjær for harvtinder; kontroller redskapstype før bestilling.",
    useCases: ["agriculture"],
    industries: ["Landbruk"],
    priorities: ["durability", "capacity"],
    features: ["Sett med harvspisser", "For harvtinder"],
  }),
  createJddProduct({
    sku: "1.10.KIT",
    name: "Harvspiss sett 190 × 35 × 6 mm",
    sourceUrl:
      "https://www.jddutstyr.no/industriehof/1-dot-10-dot-kit/harvspiss-sett-190x35x6-mm",
    image: "https://www.jddutstyr.no/thumbnails/1_10_kit.900.webp?v=639076708776670000",
    priceNok: 1119,
    category: "Landbruk · jordarbeiding",
    description:
      "Harvspiss-sett med 190 mm skjær til jordarbeiding.",
    useCases: ["agriculture"],
    industries: ["Landbruk"],
    priorities: ["durability", "capacity"],
    features: ["190 mm skjær", "Sett til harvtinder"],
    specifications: [{ name: "Skjærlengde", value: "190", unit: "mm" }],
  }),
  createJddProduct({
    sku: "1.10.1038",
    name: "Vingeskjær høyre 160 × 4 mm",
    sourceUrl:
      "https://www.jddutstyr.no/industriehof/1-dot-10-dot-1038/vingeskj%c3%a6r-h%c3%b8yre-160x4-mm",
    image: "https://www.jddutstyr.no/thumbnails/1_10_1038.900.webp?v=639076709139000000",
    priceNok: 743,
    category: "Landbruk · ugras- og radrensing",
    description:
      "Høyre vingeskjær for ugras- og radrensing; kontroller maskinmodell før valg.",
    useCases: ["agriculture", "parks"],
    industries: ["Landbruk", "Landskapspleie"],
    priorities: ["durability", "quality"],
    features: ["Høyre side", "160 × 4 mm", "For radrensing"],
    specifications: [{ name: "Mål", value: "160 × 4", unit: "mm" }],
  }),
  createJddProduct({
    sku: "63-EPO-53",
    name: "Slagjern 120 × 40 mm",
    sourceUrl:
      "https://www.jddutstyr.no/industriehof/63-epo-53/slagjern-120x40-mm-hull-14x38",
    image: "https://www.jddutstyr.no/thumbnails/63-epo-53.900.webp?v=639076694298130000",
    priceNok: 97,
    category: "Landbruk · kantslått og landskap",
    description:
      "Slagjern for kantslått og landskapsarbeid; kontroller mål og maskinmodell.",
    useCases: ["agriculture", "parks"],
    industries: ["Landbruk", "Kommune", "Landskapspleie"],
    priorities: ["price", "durability"],
    features: ["120 × 40 mm", "For kantslått"],
    specifications: [{ name: "Mål", value: "120 × 40", unit: "mm" }],
  }),
  createJddProduct({
    sku: "63-IND-96",
    name: "Slagjern 150 × 108 mm",
    sourceUrl:
      "https://www.jddutstyr.no/industriehof/63-ind-96/slagjern-150x108-mm-hull-26-5",
    image: "https://www.jddutstyr.no/thumbnails/63-ind-96.900.webp?v=639076709324400000",
    priceNok: 413,
    category: "Landbruk · kantslått og landskap",
    description:
      "Slitesterkt slagjern for kantslått og landskapspleie; kontroller maskinmodell.",
    useCases: ["agriculture", "parks"],
    industries: ["Landbruk", "Kommune", "Landskapspleie"],
    priorities: ["durability", "quality"],
    features: ["150 × 108 mm", "For landskapspleie"],
    specifications: [{ name: "Mål", value: "150 × 108", unit: "mm" }],
  }),
  createJddProduct({
    sku: "63-NOB-45",
    name: "Slagjern 81 × 40 mm",
    sourceUrl:
      "https://www.jddutstyr.no/industriehof/63-nob-45/slagjern-81x40-mm-til-ino-mmt",
    image: "https://www.jddutstyr.no/thumbnails/63-nob-45.900.webp?v=639076709324400000",
    priceNok: 194,
    category: "Landbruk · kantslått og landskap",
    description:
      "Slagjern til kantslått; kontroller festemål og kompatibel maskin før valg.",
    useCases: ["agriculture", "parks"],
    industries: ["Landbruk", "Kommune", "Landskapspleie"],
    priorities: ["price", "durability"],
    features: ["81 × 40 mm", "For kantslått"],
    specifications: [{ name: "Mål", value: "81 × 40", unit: "mm" }],
  }),
  createJddProduct({
    sku: "63-DÜC-904",
    name: "Slagjern 90 × 50 mm",
    sourceUrl:
      "https://www.jddutstyr.no/industriehof/63-d%c3%bcc-904/slagjern-90x50-mm-til-d%c3%bccker-mkl10",
    image: "https://www.jddutstyr.no/thumbnails/63-duc-904_2.900.webp?v=638725109486700000",
    priceNok: 102,
    category: "Landbruk · kantslått og landskap",
    description:
      "Slagjern for kantslått; kontroller festemål og kompatibel maskin før valg.",
    useCases: ["agriculture", "parks"],
    industries: ["Landbruk", "Kommune", "Landskapspleie"],
    priorities: ["price", "durability"],
    features: ["90 × 50 mm", "For kantslått"],
    specifications: [{ name: "Mål", value: "90 × 50", unit: "mm" }],
  }),
];

export const jddProducts: Product[] = [
  {
    id: "JDD-L7322",
    slug: "lumary-econ-22-arbeidslys",
    name: "Lumary ECON 22 firkantet arbeidslys",
    sku: "L7322",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l7322/lumary-econ-22-firkantet-arbeidslys-med-25cm-kabel-og-dt-kontakt",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Et kompakt flomlys for kjøretøy og maskiner med lavt strømforbruk.",
    description:
      "Firkantet arbeidslys med 22 W LED-ytelse, DT2-kontakt og IP67/IP69K-klassifisering.",
    image:
      "https://www.jddutstyr.no/thumbnails/l7322_3.900.webp?v=639213590210070000",
    priceNok: 233,
    isDemo: false,
    dataNotice,
    useCases: ["maintenance", "construction", "agriculture", "transport"],
    industries: ["Landbruk", "Entreprenør", "Transport"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    priorities: ["price", "flexibility"],
    features: ["22 W", "1850 lm effektiv lysstyrke", "10–30 V"],
    limitations: [
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Effekt", value: "22", unit: "W" },
      { name: "Effektiv lysstyrke", value: "1850", unit: "lm" },
      { name: "Spenning", value: "10–30", unit: "V" },
      { name: "Kapslingsgrad", value: "IP67 / IP69K" },
    ],
    compatibility: [
      ...["132848", "135427"].map((sku) => ({
        productId: `JDD-${sku}`,
        status: "compatible" as const,
        relationship: "optional" as const,
        note:
          "Settet inneholder 2-pins DT-kontakter, samme kontaktserie og pinneantall som arbeidslyset. Kontroller kjønn og kabling før montering.",
      })),
      ...["135849", "135850", "5418", "DT2F", "DT2M"].map((sku) => ({
        productId: `JDD-${sku}`,
        status: "unknown" as const,
        relationship: "optional" as const,
        note:
          "Tilbehøret har en 2-pins DT-tilkobling. Lampens kontaktskjønn og pinneoppsett er ikke spesifisert, så bekreft dette før bestilling.",
      })),
      {
        productId: "JDD-5416",
        status: "compatible",
        relationship: "optional",
        note:
          "Skjøtekabelen har DT2 hun- og hankontakt og er oppgitt med 2 meter kabel. Kontroller kabelføring og elektriske krav ved montering.",
      },
    ],
  },
  {
    id: "JDD-L7033-F",
    slug: "lumary-ignite-30-arbeidslys",
    name: "Arbeidslys Lumary Ignite 30",
    sku: "L7033-F",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l7033-f/arbeidslys-lumary-ignite-30-rektangul%c3%a6rt-med-2400-lumen",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Rektangulært arbeidslys for belysning av nærområdet på maskiner.",
    description:
      "Kompakt arbeidslampe med 2400 lm og brakett som kan vippes for å rette lyset.",
    image:
      "https://www.jddutstyr.no/thumbnails/l7033-f.900.webp?v=639213592981270000",
    priceNok: 328,
    isDemo: false,
    dataNotice,
    useCases: ["maintenance", "construction", "agriculture"],
    industries: ["Landbruk", "Entreprenør", "Verksted"],
    environments: ["outdoor", "mixed"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    priorities: ["price", "flexibility"],
    features: ["2400 lm", "Rektangulær form", "Vippbar brakett"],
    limitations: [
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Lysstyrke", value: "2400", unit: "lm" },
      { name: "Brakett", value: "Justerbar, opptil 230°" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-L7050",
    slug: "lumary-rotate-50-arbeidslys",
    name: "Arbeidslys Lumary Rotate 50 Firkantet",
    sku: "L7050",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l7050/arbeidslys-lumary-rotate-50-firkantet-flood-4250-lm-5700k-for-12-og-24-volt",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Firkantet flomlys med OSRAM-LED og lysstyrke på 4250 lumen.",
    description:
      "Kompakt arbeidslys med fem 10 W OSRAM LED-dioder, 5700 K fargetemperatur og 12/24 V drift.",
    image:
      "https://www.jddutstyr.no/thumbnails/l7050_20.900.webp?v=639213588364630000",
    priceNok: 741,
    isDemo: false,
    dataNotice,
    useCases: ["maintenance", "construction", "agriculture", "transport"],
    industries: ["Landbruk", "Entreprenør", "Transport"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    priorities: ["capacity", "quality"],
    features: ["4250 lm", "5 × 10 W OSRAM LED", "5700 K"],
    limitations: [
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Lysstyrke", value: "4250", unit: "lm" },
      { name: "LED", value: "5 × 10 W OSRAM" },
      { name: "Spenning", value: "12/24", unit: "V" },
      { name: "Størrelse, front", value: "86 × 80", unit: "mm" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-L7260",
    slug: "lumary-corax-40-wide-flood",
    name: "Lumary Corax 40 arbeidslys wide flood",
    sku: "L7260",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l7260/lumary-corax-40-arbeidslys-wide-flood-kraftig-arbeidslys-med-bred-lysvinkel",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Bredt lysbilde utviklet for arbeidsmaskiner i landbruk og anlegg.",
    description:
      "Wide-flood arbeidslys med ekstra LED-dioder for lys mot sidene.",
    image:
      "https://www.jddutstyr.no/thumbnails/l7260_10.900.webp?v=639213597928470000",
    priceNok: 762,
    isDemo: false,
    dataNotice,
    useCases: ["construction", "agriculture", "maintenance"],
    industries: ["Landbruk", "Entreprenør"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    priorities: ["capacity", "flexibility"],
    features: ["Wide-flood lysbilde", "Ekstra sidelys"],
    limitations: [
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Lysbilde", value: "Wide flood" },
      { name: "Bruksområde", value: "Landbruk og anlegg" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-L3100",
    slug: "lumary-no-glare-100-de-ice",
    name: "Lumary NO-GLARE 100 De-ice arbeidslys",
    sku: "L3100",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l3100/lumary-no-glare-100-de-ice-arbeidslys-12-150-lumen--100-watt--med-varme",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Kraftig arbeidslys med blendingsredusert lysbilde og avising for vinterbruk.",
    description:
      "100 W arbeidslys med 12 150 lm, integrert De-ice-funksjon og kapslingsgrad IP67/IP69K.",
    image:
      "https://www.jddutstyr.no/thumbnails/l3100_1.900.webp?v=639020808293670000",
    priceNok: 1187,
    isDemo: false,
    dataNotice,
    useCases: ["construction", "transport", "maintenance"],
    industries: ["Entreprenør", "Transport", "Kommune"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    priorities: ["capacity", "durability", "quality"],
    features: ["100 W", "12 150 lm", "No-Glare-lys", "De-ice-funksjon"],
    limitations: [
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Effekt", value: "100", unit: "W" },
      { name: "Lysstyrke", value: "12 150", unit: "lm" },
      { name: "Spenning", value: "10–30", unit: "V" },
      { name: "Kapslingsgrad", value: "IP67 / IP69K" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-U25B",
    slug: "lazer-utility-25-arbeidslys",
    name: "Arbeidslys Lazer Utility 25",
    sku: "U25B",
    sourceUrl:
      "https://www.jddutstyr.no/lazer/u25b/arbeidslys-lazer-utility-25-flood-25w-3016lm-5000k-9-32v",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Kompakt arbeidslys i Lazers Utility-serie for profesjonell bruk.",
    description:
      "25 W arbeidslys med flomlys, 3016 lm og 5000 K fargetemperatur.",
    image:
      "https://www.jddutstyr.no/thumbnails/00u25-u-b.900.webp?v=639213592277730000",
    priceNok: 1439,
    isDemo: false,
    dataNotice,
    useCases: ["maintenance", "construction", "agriculture", "transport"],
    industries: ["Entreprenør", "Landbruk", "Transport"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    priorities: ["quality", "durability"],
    features: ["25 W", "3016 lm", "5000 K", "9–32 V"],
    limitations: [
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Effekt", value: "25", unit: "W" },
      { name: "Lysstyrke", value: "3016", unit: "lm" },
      { name: "Fargetemperatur", value: "5000", unit: "K" },
      { name: "Spenning", value: "9–32", unit: "V" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-L8040",
    slug: "lumary-ignite-slim-40-arbeidslys",
    name: "Lumary Ignite Slim 40 arbeidslys",
    sku: "L8040",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l8040/lumary-ignite-slim-40-arbeidslys-arbeidslys--40w",
    category: "Arbeidslys · firkantet avlang",
    kind: "main",
    shortDescription:
      "Slankt arbeidslys for nyttekjøretøy, servicebiler og arbeidsmaskiner.",
    description:
      "40 W arbeidslys med flood-lysbilde, 8000 rå lumen og IP68-beskyttelse.",
    image:
      "https://www.jddutstyr.no/thumbnails/l8040_(1).900.webp?v=639213601126970000",
    priceNok: 516,
    isDemo: false,
    dataNotice,
    useCases: ["maintenance", "construction", "agriculture", "transport"],
    industries: ["Service", "Landbruk", "Entreprenør", "Transport"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    priorities: ["capacity", "durability", "flexibility"],
    features: ["40 W faktisk effekt", "8000 rå lumen", "IP68"],
    limitations: [
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Effekt", value: "40", unit: "W faktisk" },
      { name: "Lysstyrke", value: "8000", unit: "rå lumen" },
      { name: "Spenning", value: "9–30", unit: "V" },
      { name: "Kapslingsgrad", value: "IP68" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-L7180",
    slug: "lumary-tradisjonelt-arbeidslys",
    name: "Lumary tradisjonelt arbeidslys 6800 lm",
    sku: "L7180",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l7180/lumary-tradisjonelt-arbeidslys-6800-lm-ligner-de-gamle-hella-arbeidslysene",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Arbeidslys med form som kan erstatte eldre firkantede Hella-halogenlamper.",
    description:
      "Firkantet arbeidslys med 6800 lm, utformet som en erstatning for eldre Hella-lamper.",
    image:
      "https://www.jddutstyr.no/thumbnails/l7180.900.webp?v=639213601448100000",
    priceNok: 950,
    isDemo: false,
    dataNotice,
    useCases: ["maintenance", "construction", "agriculture", "transport"],
    industries: ["Landbruk", "Entreprenør", "Transport"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily"],
    priorities: ["capacity", "flexibility"],
    features: ["6800 lm", "Firkantet form", "Erstatter eldre Hella-lamper"],
    limitations: [
      "Kontroller mål, feste, spenning og kontakt mot eksisterende lampe før kjøp.",
    ],
    specifications: [{ name: "Lysstyrke", value: "6800", unit: "lm" }],
    compatibility: [],
  },
  {
    id: "JDD-L3157",
    slug: "lumary-econ-60-vario-kelvin",
    name: "Lumary Econ arbeidslys 60 Vario Kelvin",
    sku: "L3157",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l3157/lumary-econ-arbeidslys-60-vario-kelvin-arbeidslys-med-variabel-fargetemperatur",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Arbeidslys med tre valgbare fargetemperaturer for ulike arbeidsforhold.",
    description:
      "Fargetemperaturen veksler mellom omtrent 3000 K, 4500 K og 6000 K ved omstart av lampen.",
    image:
      "https://www.jddutstyr.no/thumbnails/l3157_21.900.webp?v=639213600232770000",
    priceNok: 572,
    isDemo: false,
    dataNotice,
    useCases: ["maintenance", "construction", "agriculture", "workshop"],
    industries: ["Landbruk", "Entreprenør", "Verksted"],
    environments: ["indoor", "outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily"],
    priorities: ["quality", "flexibility"],
    features: ["Variabel fargetemperatur", "3000 K / 4500 K / 6000 K"],
    limitations: [
      "Fargetemperaturen endres ved å slå lampen av og på.",
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Fargetemperatur", value: "3000 / 4500 / 6000", unit: "K" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-L3150",
    slug: "lumary-econ-dual-arbeidslys-varsellys",
    name: "Lumary Econ Dual arbeidslys med varsellys",
    sku: "L3150",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l3150/lumary-econ-dual-arbeidslys-m-dot--varsellys-kraftig-og-prisgunstig-arbeidslys",
    category: "Arbeidslys · med varsellys",
    kind: "main",
    shortDescription:
      "Kombinerer arbeidslys og varsellys i én kompakt lampe for kjøretøy og maskiner.",
    description:
      "Arbeidslys på 3500 lm og varsellys på 980 lm, med drift på 12 V og 24 V.",
    image:
      "https://www.jddutstyr.no/thumbnails/l3150.900.webp?v=639213600232770000",
    priceNok: 489,
    isDemo: false,
    dataNotice,
    useCases: ["construction", "agriculture", "transport", "maintenance"],
    industries: ["Landbruk", "Entreprenør", "Transport"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["regular", "daily", "intensive"],
    priorities: ["flexibility", "quality"],
    features: ["3500 lm arbeidslys", "980 lm varsellys", "12/24 V"],
    limitations: [
      "Kontroller montering og elektrisk tilkobling mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Arbeidslys", value: "3500", unit: "lm" },
      { name: "Varsellys", value: "980", unit: "lm" },
      { name: "Driftsspenning", value: "12/24", unit: "V" },
      { name: "Effekt, arbeidslys/varsellys", value: "30 / 16", unit: "W" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-L7730",
    slug: "lumary-corax-30-x-bredt-arbeidslys",
    name: "Lumary Corax 30-X bredt arbeidslys",
    sku: "L7730",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l7730/lumary-corax-30-x-bredt-arbeidslys-sort-optikk-med-osram-led",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Bredt flomlys med OSRAM LED for traktorer, ATV, UTV og gravemaskiner.",
    description:
      "30 W arbeidslys med 3180 lm, bredt lysbilde og IP68-beskyttelse.",
    image:
      "https://www.jddutstyr.no/thumbnails/l7730.900.webp?v=639213591671730000",
    priceNok: 453,
    isDemo: false,
    dataNotice,
    useCases: ["construction", "agriculture", "maintenance", "transport"],
    industries: ["Landbruk", "Entreprenør"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["occasional", "regular", "daily", "intensive"],
    priorities: ["capacity", "price", "flexibility"],
    features: ["3180 lm", "30 W", "OSRAM LED", "IP68"],
    limitations: [
      "Kontroller spenning og kontakt mot kjøretøyet før kjøp.",
    ],
    specifications: [
      { name: "Effekt", value: "30", unit: "W" },
      { name: "Lysstyrke", value: "3180", unit: "lm" },
      { name: "Spenning", value: "9–32", unit: "V" },
      { name: "Kapslingsgrad", value: "IP68" },
    ],
    compatibility: [],
  },
  {
    id: "JDD-L7192",
    slug: "lumary-ignite-192-arbeidslys",
    name: "Lumary Ignite 192 arbeidslys",
    sku: "L7192",
    sourceUrl:
      "https://www.jddutstyr.no/lumary/l7192/lumary-ignite-192-robust-flood-lysbilde-192-watts-arbeidslys-med-15360-lm",
    category: "Arbeidslys · firkantet",
    kind: "main",
    shortDescription:
      "Kraftig flomlys utviklet for krevende bruk på anleggs- og gruvemaskiner.",
    description:
      "192 W arbeidslys med 15 360 lm, 60° flomlys og IP68-beskyttelse.",
    image:
      "https://www.jddutstyr.no/thumbnails/l7192__2.900.webp?v=639213600232770000",
    priceNok: 1264,
    isDemo: false,
    dataNotice,
    useCases: ["construction", "agriculture", "transport"],
    industries: ["Entreprenør", "Landbruk", "Transport"],
    environments: ["outdoor", "mixed", "demanding"],
    usageIntensity: ["daily", "intensive"],
    priorities: ["capacity", "durability"],
    features: ["192 W", "15 360 lm", "60° flomlys", "IP68"],
    limitations: [
      "Kontroller strømkapasitet, spenning og kontakt før montering.",
    ],
    specifications: [
      { name: "Effekt", value: "192", unit: "W" },
      { name: "Lysstyrke", value: "15 360", unit: "lm" },
      { name: "Spenning", value: "9–32", unit: "V" },
      { name: "Kapslingsgrad", value: "IP68" },
      { name: "Fargetemperatur", value: "6000", unit: "K" },
    ],
    compatibility: [],
  },
  ...additionalJddProducts,
];
