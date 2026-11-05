import { GuideAnswers } from "@/src/types/domain";

const GUIDE_SESSION_KEY = "jdd-product-guide-answers";

export function loadGuideAnswers(): GuideAnswers {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.sessionStorage.getItem(GUIDE_SESSION_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as GuideAnswers;
  } catch {
    return {};
  }
}

export function saveGuideAnswers(answers: GuideAnswers): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(GUIDE_SESSION_KEY, JSON.stringify(answers));
}

export function clearGuideAnswers(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(GUIDE_SESSION_KEY);
}
