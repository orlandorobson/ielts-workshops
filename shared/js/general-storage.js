const STORAGE_KEY = "ielts-workshops:general-task-1:v1";
const VERSION = 1;

const defaultState = () => ({
  version: VERSION,
  currentUnit: "g0",
  completed: [],
  units: {},
  drafts: {
    opening: "",
    body: "",
    closing: "",
    fullLetter: "",
    fullLetterInitial: "",
  },
});

export function loadGeneralState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || saved.version !== VERSION) return defaultState();
    return {
      ...defaultState(),
      ...saved,
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      units: saved.units && typeof saved.units === "object" ? saved.units : {},
      drafts: { ...defaultState().drafts, ...(saved.drafts || {}) },
    };
  } catch {
    return defaultState();
  }
}

export function saveGeneralState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: VERSION }));
    return true;
  } catch {
    return false;
  }
}

export function clearGeneralState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The in-memory session can still reset if storage is unavailable.
  }
  return defaultState();
}
