export const generalTaskInstruction = "Write at least 150 words. You do NOT need to write any addresses.";

export const generalScenarios = [
  {
    id: "riverside-hot-water",
    title: "A recurring problem in your apartment",
    situation:
      "You rent an apartment. During the past two weeks, the hot water has stopped working several times. A maintenance worker visited once, but the problem has continued.",
    instruction: "Write a letter to the property manager. In your letter:",
    taskRequirement: generalTaskInstruction,
    reader: "the property manager",
    relationship: "a tenant writing to the person responsible for managing the apartment",
    purpose: "to explain a recurring hot-water problem and request a lasting repair",
    bulletPoints: [
      { id: "problem", text: "explain the problem and what has already been done", job: "Give the manager a clear history of the recurring fault and the unsuccessful first repair." },
      { id: "effect", text: "describe how the problem is affecting you", job: "Explain enough practical impact for the manager to understand why further action matters." },
      { id: "action", text: "say what you would like the property manager to do", job: "Request a reasonable next action and make any useful practical arrangement clear." },
    ],
    toneNotes: [
      "Respectful and direct: the reader has responsibility for the property, but the relationship is not highly ceremonial.",
      "Firm language can be appropriate because the problem is recurring; aggression and exaggerated formality are unnecessary.",
      "Natural, controlled vocabulary communicates more effectively than bureaucratic wording.",
    ],
    communicativeJobs: [
      { id: "open", label: "Establish purpose", description: "Identify the apartment problem and make the reason for writing clear." },
      { id: "context", label: "Explain the recurring problem", description: "Describe when the fault occurs and what the first maintenance visit achieved." },
      { id: "effect", label: "Make the impact understandable", description: "Give relevant detail about the practical effect without inventing drama." },
      { id: "request", label: "Request action", description: "Ask for a lasting inspection or repair and a practical next step." },
      { id: "finish", label: "Complete the communication", description: "Indicate availability or request confirmation, then use an appropriate sign-off." },
    ],
    possibleOrganisation: [
      "Opening: identify the recurring hot-water problem and purpose immediately.",
      "Body paragraph 1: explain the fault, the earlier maintenance visit and the continuing effect.",
      "Body paragraph 2: request a lasting repair and give useful access or contact information.",
      "Closing: ask for confirmation of the next step, then sign off appropriately.",
    ],
    teachingDetails: {
      problem: "The water turns cold without warning, particularly in the early morning and evening. The first maintenance visit restored it only temporarily.",
      effect: "The tenant cannot shower reliably before early work shifts and has sometimes needed to heat water separately.",
      action: "Ask for a qualified technician to inspect the system within the next week and request advance confirmation of the visit time.",
    },
    teachingExample: {
      greeting: "Dear Property Manager,",
      paragraphs: [
        "I am writing about the recurring hot-water problem in apartment 4B. The supply has stopped several times during the past two weeks, despite a maintenance visit last Tuesday.",
        "The water worked normally for only two days after that visit and now turns cold again, especially in the early morning and evening. This has made it difficult to shower before my early work shifts, and I have sometimes had to heat water separately. As the fault is unpredictable, I cannot simply adjust my routine to avoid it.",
        "Could you please arrange for a qualified technician to inspect the system and make a lasting repair within the next week? I am usually available after 4 p.m., but I can arrange access at another time if I receive advance notice.",
        "I would appreciate confirmation of when the technician will visit and whether any further information about the earlier repair is needed.",
      ],
      signOff: "Kind regards,\nSamir Hassan",
    },
    aiContext: {
      supportedFacts: [
        "The hot water has failed several times over two weeks.",
        "One maintenance visit did not solve the problem permanently.",
        "The writer needs to explain the fault, its effect and the action requested.",
      ],
    },
  },
];

export const generalScenariosById = Object.fromEntries(generalScenarios.map((scenario) => [scenario.id, scenario]));

export const futureScenarioRelationships = [
  "Friend",
  "Neighbour",
  "Colleague",
  "Landlord or property manager",
  "Course administrator",
  "Hotel manager",
  "Organisation",
];
