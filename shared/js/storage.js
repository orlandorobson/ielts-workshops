const STORAGE_KEY = "ielts-workshops:academic-task-1:v3";
const VERSION = 3;

const defaultState = () => ({
  version: VERSION,
  openingVersion: 1,
  overviewBridgeVersion: 1,
  currentUnit: "a0",
  completed: [],
  units: {},
  drafts: {
    introduction: "",
    overview: "",
    overviewInitial: "",
    mapOverview: "",
    processOverview: "",
    detailParagraph: "",
    detailInitial: "",
  },
});

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || saved.version !== VERSION) return defaultState();
    return {
      ...defaultState(),
      ...saved,
      openingVersion: Number.isInteger(saved.openingVersion) ? saved.openingVersion : 0,
      overviewBridgeVersion: Number.isInteger(saved.overviewBridgeVersion) ? saved.overviewBridgeVersion : 0,
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      units: saved.units && typeof saved.units === "object" ? saved.units : {},
      drafts: { ...defaultState().drafts, ...(saved.drafts || {}) },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: VERSION }));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The current session can still reset even if browser storage is unavailable.
  }
  return defaultState();
}
