const STORAGE_KEY = "ielts-workshops:writing-task-2:v1";
const VERSION = 4;
const SUPPORTED_VERSIONS = new Set([1, 2, 3, VERSION]);
const REDESIGNED_OPENING_IDS = ["u1", "u2", "u3", "u3p", "u4", "u5", "u6"];

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
    fatmaIntroduction: "",
    workshop1Plan: { position: "", body1: "", body2: "" },
    workshop1Introduction: "",
    practiceSessions: [],
  },
});

export function loadTask2State() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !SUPPORTED_VERSIONS.has(saved.version)) return defaultState();
    const defaults = defaultState();
    const migrated = {
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
        workshop1Plan: { ...defaults.drafts.workshop1Plan, ...(saved.drafts?.workshop1Plan || {}) },
      },
    };
    if (saved.version < VERSION) {
      migrated.currentUnit = "u1";
      migrated.completed = [];
      REDESIGNED_OPENING_IDS.forEach((id) => {
        delete migrated.units[id];
        Object.keys(migrated.units)
          .filter((key) => key.startsWith(`${id}-`))
          .forEach((key) => delete migrated.units[key]);
      });
    }
    return migrated;
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
