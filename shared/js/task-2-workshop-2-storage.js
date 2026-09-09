const STORAGE_KEY = "ielts-workshops:writing-task-2:workshop-2:v1";
const VERSION = 1;

const blankParagraphPlan = () => ({ bigIdea: "", explain: "", support: "" });

const defaultState = () => ({
  version: VERSION,
  currentUnit: "y1",
  completed: [],
  units: {},
  source: null,
  drafts: {
    fallback: { question: "", position: "", body1: "", body2: "", introduction: "" },
    paragraphPlans: { paragraph1: blankParagraphPlan(), paragraph2: blankParagraphPlan() },
    paragraph1: "",
    paragraph2: "",
    conclusion: "",
  },
});

export function loadWorkshop2State() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || saved.version !== VERSION) return defaultState();
    const defaults = defaultState();
    return {
      ...defaults,
      ...saved,
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      units: saved.units && typeof saved.units === "object" ? saved.units : {},
      source: saved.source && typeof saved.source === "object" ? saved.source : null,
      drafts: {
        ...defaults.drafts,
        ...(saved.drafts || {}),
        fallback: { ...defaults.drafts.fallback, ...(saved.drafts?.fallback || {}) },
        paragraphPlans: {
          paragraph1: { ...defaults.drafts.paragraphPlans.paragraph1, ...(saved.drafts?.paragraphPlans?.paragraph1 || {}) },
          paragraph2: { ...defaults.drafts.paragraphPlans.paragraph2, ...(saved.drafts?.paragraphPlans?.paragraph2 || {}) },
        },
      },
    };
  } catch {
    return defaultState();
  }
}

export function saveWorkshop2State(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: VERSION }));
    return true;
  } catch {
    return false;
  }
}

export function clearWorkshop2State() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The current in-memory session can still reset.
  }
  return defaultState();
}
