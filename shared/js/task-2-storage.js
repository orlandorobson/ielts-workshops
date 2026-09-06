const STORAGE_KEY = "ielts-workshops:writing-task-2:v1";
const VERSION = 2;
const SUPPORTED_VERSIONS = new Set([1, VERSION]);

const defaultState = () => ({
  version: VERSION,
  currentUnit: "u1",
  completed: [],
  units: {},
  drafts: {
    paraphrase: "",
    introduction: "",
    reasoningNote: "",
    bodyParagraph: "",
    quickPlan: { job: "", position: "", body1: "", body2: "", check: "" },
    fullEssay: "",
    originalEssay: "",
    revisedEssay: "",
    transferPlan: { job: "", position: "", body1: "", body2: "" },
    transferEssay: "",
    transferOriginal: "",
    transferRevision: "",
  },
});

export function loadTask2State() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !SUPPORTED_VERSIONS.has(saved.version)) return defaultState();
    const defaults = defaultState();
    return {
      ...defaults,
      ...saved,
      version: VERSION,
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      units: saved.units && typeof saved.units === "object" ? saved.units : {},
      drafts: {
        ...defaults.drafts,
        ...(saved.drafts || {}),
        quickPlan: { ...defaults.drafts.quickPlan, ...(saved.drafts?.quickPlan || {}) },
        transferPlan: { ...defaults.drafts.transferPlan, ...(saved.drafts?.transferPlan || {}) },
      },
    };
  } catch {
    return defaultState();
  }
}

export function saveTask2State(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: VERSION }));
    return true;
  } catch {
    return false;
  }
}

export function clearTask2State() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The current in-memory session can still reset.
  }
  return defaultState();
}
