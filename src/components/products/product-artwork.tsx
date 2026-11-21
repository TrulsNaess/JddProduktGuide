interface ProductArtworkProps {
  className?: string;
}

export function ProductArtwork({ className = "" }: ProductArtworkProps) {
  return (
    <div
      role="img"
      aria-label="Illustrasjon av fiktivt arbeidsutstyr"
      className={`relative isolate flex aspect-[1.55] items-center justify-center overflow-hidden rounded-2xl bg-[#f2f1ed] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#ed1c24]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-4.5rem] left-[-2rem] h-40 w-40 rounded-full bg-[#252525]/[0.06] blur-2xl"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 480 310"
        className="relative h-full w-full max-w-[32rem]"
        fill="none"
      >
        <ellipse cx="244" cy="266" rx="148" ry="15" fill="#252525" fillOpacity=".08" />
        <circle cx="238" cy="151" r="115" stroke="#252525" strokeOpacity=".06" />
        <circle cx="238" cy="151" r="87" stroke="#252525" strokeOpacity=".06" />

        <path
          d="M170 231h142l25 24H145l25-24Z"
          fill="#292929"
        />
        <path
          d="m187 228 15-74h82l16 74"
          fill="#343434"
          stroke="#202020"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <path
          d="M184 156c0-8 6-14 14-14h90c8 0 14 6 14 14v65H184v-65Z"
          fill="#ed1c24"
        />
        <path
          d="M197 158c0-4 3-7 7-7h78c4 0 7 3 7 7v45h-92v-45Z"
          fill="#fff"
        />
        <path
          d="M209 166h68M209 178h68M209 190h68"
          stroke="#d9d9d9"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M174 162h-14v52h14M312 162h14v52h-14"
          stroke="#242424"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <path d="m196 229-22 31m107-31 22 31" stroke="#242424" strokeLinecap="round" strokeWidth="7" />
        <path d="M169 261h-16m160 0h16" stroke="#ed1c24" strokeLinecap="round" strokeWidth="6" />
        <circle cx="337" cy="97" r="5" fill="#ed1c24" />
        <circle cx="131" cy="204" r="4" fill="#ed1c24" fillOpacity=".65" />
      </svg>
      <span className="absolute bottom-3 left-3 rounded-full border border-white/80 bg-white/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#666] backdrop-blur">
        Demoillustrasjon
      </span>
    </div>
  );
}
