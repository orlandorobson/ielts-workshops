const STORAGE_KEY = "ielts-workshops:academic-task-1:v3";
const VERSION = 3;

const defaultState = () => ({
  version: VERSION,
  openingVersion: 2,
  structurePageVersion: 1,
  introductionPageVersion: 1,
  overviewBridgeVersion: 1,
  overviewPageVersion: 1,
  overviewVisualVersion: 1,
  detailsPageVersion: 2,
  currentUnit: "a0",
  completed: [],
  units: {},
  drafts: {
    introduction: "",
    overview: "",
    overviewInitial: "",
    mapOverview: "",
    mp01Overview: "",
    processOverview: "",
    detailParagraph: "",
    detailInitial: "",
    detailsParagraph: "",
    detailsMapWriting: "",
    detailsProcessWriting: "",
    legacyDetailParagraph: "",
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
      structurePageVersion: Number.isInteger(saved.structurePageVersion) ? saved.structurePageVersion : 0,
      introductionPageVersion: Number.isInteger(saved.introductionPageVersion) ? saved.introductionPageVersion : 0,
      overviewBridgeVersion: Number.isInteger(saved.overviewBridgeVersion) ? saved.overviewBridgeVersion : 0,
      overviewPageVersion: Number.isInteger(saved.overviewPageVersion) ? saved.overviewPageVersion : 0,
      overviewVisualVersion: Number.isInteger(saved.overviewVisualVersion) ? saved.overviewVisualVersion : 0,
      detailsPageVersion: Number.isInteger(saved.detailsPageVersion) ? saved.detailsPageVersion : 0,
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
