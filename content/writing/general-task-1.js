import { futureScenarioRelationships, generalScenariosById, generalTaskInstruction } from "./general-scenarios.js";

const scenario = generalScenariosById["riverside-hot-water"];

export const generalTask1Content = {
  title: "General Training Task 1",
  scenario,
  taskInstruction: generalTaskInstruction,
  futureScenarioRelationships,
  sections: [
    { id: "understand", label: "Understand the communication" },
    { id: "parts", label: "Write the letter" },
    { id: "complete", label: "Complete response" },
    { id: "review", label: "Investigate & revise" },
  ],
  units: [
    { id: "g0", section: "understand", label: "Writing to someone for a reason", eyebrow: "Communication first" },
    { id: "g1", section: "understand", label: "Read the situation", eyebrow: "Situation → reader → purpose" },
    { id: "g2", section: "understand", label: "WHO? WHY? WHAT?", eyebrow: "Understand before writing" },
    { id: "g3", section: "understand", label: "BTP: check before finishing", eyebrow: "A course checking tool" },
    { id: "g4", section: "understand", label: "Communication jobs", eyebrow: "Bullet point → reader need" },
    { id: "g5", section: "understand", label: "Enough to respond", eyebrow: "Not enough → enough → too much" },
    { id: "g6", section: "understand", label: "Tone is relational", eyebrow: "Reader + purpose + situation" },
    { id: "g7", section: "understand", label: "Choose an appropriate tone", eyebrow: "Compare → judge" },
    { id: "g8", section: "parts", label: "Open with purpose", eyebrow: "Vague → clear" },
    { id: "g9", section: "parts", label: "Write your opening", eyebrow: "Think → write → revise" },
    { id: "g10", section: "parts", label: "Organise for the reader", eyebrow: "Paragraph → communicative job" },
    { id: "g11", section: "parts", label: "Mention or develop?", eyebrow: "Reader needs → relevant detail" },
    { id: "g12", section: "parts", label: "Focus → Develop → Close", eyebrow: "Build one useful idea" },
    { id: "g13", section: "parts", label: "Write a body paragraph", eyebrow: "Plan → write → revise" },
    { id: "g14", section: "parts", label: "Close the communication", eyebrow: "Content closing ≠ sign-off" },
    { id: "g15", section: "parts", label: "Write your closing", eyebrow: "Next step → natural finish" },
    { id: "g16", section: "complete", label: "Build the complete letter", eyebrow: "Bring together → edit → own" },
    { id: "g17", section: "complete", label: "Check with BTP", eyebrow: "Diagnose before feedback" },
    { id: "g18", section: "complete", label: "Get feedback and revise", eyebrow: "Write → diagnose → revise" },
    { id: "g19", section: "review", label: "Investigate a teaching example", eyebrow: "Purpose → bullets → tone → organisation → language" },
    { id: "g20", section: "review", label: "Diagnose a nearly-good response", eyebrow: "Notice the communication problem" },
    { id: "g21", section: "review", label: "Make your final revision", eyebrow: "Diagnose → revise → complete" },
  ],
  g1: {
    prompt: "Which description best captures this communication situation?",
    shuffle: true,
    options: [
      { id: "accurate", text: "A tenant is explaining a recurring apartment problem to the property manager and asking for effective action.", viable: true, feedback: "This identifies the relationship, the recurring problem and the practical purpose." },
      { id: "angry-complaint", text: "A customer is making an angry complaint to a company and demanding compensation.", viable: false, feedback: "There is a problem to resolve, but the task does not establish compensation or require an angry approach." },
      { id: "story", text: "A resident is telling a friend a story about an inconvenient week at home.", viable: false, feedback: "The reader and purpose are different: this is a request to the person responsible for the apartment." },
      { id: "formal-report", text: "A tenant is submitting a technical building report to a government authority.", viable: false, feedback: "The letter needs useful detail, but it is not a technical report and the reader is the property manager." },
    ],
  },
  g2: {
    categories: [
      {
        id: "who",
        question: "WHO is the reader?",
        shuffle: true,
        options: [
          { id: "manager", text: "The property manager responsible for the rented apartment", viable: true, feedback: "Yes. The relationship is tenant to property manager." },
          { id: "friend", text: "A close friend who already knows about the apartment", viable: false, feedback: "The task names the property manager, so friendly shared knowledge cannot be assumed." },
          { id: "technician", text: "The maintenance technician who visited previously", viable: false, feedback: "The technician is part of the situation, but the letter is addressed to the property manager." },
        ],
      },
      {
        id: "why",
        question: "WHY are you writing?",
        shuffle: true,
        options: [
          { id: "resolve", text: "To explain that the problem continues and seek a lasting solution", viable: true, feedback: "Yes. The reader should understand both the recurring problem and the action needed." },
          { id: "blame", text: "To prove that the first maintenance worker was incompetent", viable: false, feedback: "The task requires resolution, not an unsupported judgement about the worker." },
          { id: "warn", text: "To threaten to leave the apartment immediately", viable: false, feedback: "The situation does not establish that intention. It asks for a reasonable action request." },
        ],
      },
      {
        id: "what",
        question: "WHAT does the reader need?",
        shuffle: true,
        options: [
          { id: "three-jobs", text: "A clear account of the problem, its effect and the action requested", viable: true, feedback: "Yes. These are the three communication jobs created by the bullet points." },
          { id: "every-detail", text: "A complete diary of everything that happened during the two weeks", viable: false, feedback: "Relevant detail helps, but a complete diary would make the purpose harder to follow." },
          { id: "repair-guide", text: "Technical instructions explaining how to repair the water system", viable: false, feedback: "The tenant needs to describe the problem and request action, not diagnose the machinery." },
        ],
      },
    ],
  },
  g4: {
    prompt: "Which version turns the effect bullet point into a useful communication job?",
    shuffle: true,
    options: [
      { id: "developed", text: "Explain when the loss of hot water causes difficulty and give one relevant practical consequence.", viable: true, feedback: "This gives the manager enough context to understand why another repair matters." },
      { id: "repeat", text: "Write: ‘The problem is affecting me.’", viable: false, feedback: "This repeats the instruction but leaves the reader asking how the problem affects the tenant." },
      { id: "story", text: "Describe every inconvenience in detail, including unrelated events from the last two weeks.", viable: false, feedback: "This adds volume but not useful communication. Select only details that help the manager understand and respond." },
    ],
  },
  g5: {
    prompt: "How much information does each extract give the reader?",
    shuffle: true,
    options: [
      { id: "not-enough", label: "Not yet", text: "The hot-water problem is affecting me.", feedback: "The effect is mentioned but not developed. The manager still does not know what difficulty it causes." },
      { id: "enough", label: "Enough", text: "Because the water often turns cold early in the morning, I cannot shower reliably before my work shift and have sometimes needed to heat water separately.", feedback: "This relevant consequence makes the impact understandable without becoming a long story." },
      { id: "too-much", label: "More than needed", text: "The water failed on Monday at 6:12, Tuesday at 6:08, Thursday at 6:17 and Saturday at 7:03, and on each occasion I recorded the exact temperature in three different containers.", feedback: "Some timing detail could help, but this level of record overwhelms the simple communication job." },
    ],
  },
  g6: {
    relationships: [
      { id: "friend", label: "Close friend", guidance: "Personal and relaxed where the situation allows." },
      { id: "neighbour", label: "Neighbour you know slightly", guidance: "Friendly, but with some social distance." },
      { id: "colleague", label: "Colleague", guidance: "Natural and cooperative, shaped by the purpose." },
      { id: "manager", label: "Property manager", guidance: "Respectful, direct and practical." },
      { id: "administrator", label: "Course administrator", guidance: "Clear and courteous, without unnecessary ceremony." },
      { id: "hotel", label: "Hotel manager", guidance: "Polite and purposeful, with firmness where justified." },
    ],
  },
  g7: {
    prompt: "Which sentence best fits this reader and situation?",
    shuffle: true,
    options: [
      { id: "appropriate", text: "I’m writing because the hot-water problem in my apartment has continued despite last week’s maintenance visit.", viable: true, feedback: "This is respectful, direct and natural. It makes the purpose clear without sounding weak or aggressive." },
      { id: "natural-alternative", text: "I wanted to contact you because the hot-water supply has started failing again since the maintenance visit.", viable: true, feedback: "This is another natural choice. It is slightly less direct, but the reader, problem and purpose remain clear." },
      { id: "formal-alternative", text: "I wish to report that the hot-water system remains unreliable following the recent maintenance visit.", viable: true, feedback: "This more formal wording is still defensible and clear. It is not better merely because it is more formal; it is simply another controllable option." },
      { id: "too-casual", text: "Hi, just a quick note—the hot water is playing up again. Can you get someone round whenever?", viable: false, feedback: "This could suit a familiar personal exchange, but ‘playing up’ and ‘whenever’ are too casual and imprecise for the relationship and recurring problem established here." },
    ],
  },
  g8: {
    prompt: "Which opening helps the property manager understand the purpose quickly?",
    shuffle: true,
    options: [
      { id: "clear", text: "I am writing about the recurring hot-water problem in apartment 4B, which has continued after a maintenance visit last week.", viable: true, feedback: "The reader immediately knows the problem, location and reason for contact." },
      { id: "request-first", text: "Could you please arrange another inspection of the hot-water system in apartment 4B, as the fault returned after last week’s maintenance visit?", viable: true, feedback: "This alternative begins with the requested action rather than ‘I am writing’. It still establishes the purpose and relevant context clearly." },
      { id: "courteous-delay", text: "I hope you are well. I have been living in apartment 4B for six months and normally find it very comfortable.", viable: false, feedback: "The tone is courteous, but these first two sentences do not yet tell the manager why action is needed." },
      { id: "detail-first", text: "A maintenance worker came to apartment 4B last Tuesday and spent approximately twenty minutes checking the equipment.", viable: false, feedback: "This may become useful supporting detail, but it does not yet identify the recurring hot-water problem or the purpose of the letter." },
    ],
  },
  g9: {
    prompt: "Write the opening of the letter. One or two sentences are enough.",
    help: [
      "If the manager reads only your first two sentences, will they understand the problem and why you are writing?",
      "Identify the recurring hot-water problem, the apartment and the fact that the earlier visit did not solve it.",
      "I am writing about the recurring hot-water problem in apartment 4B, which has continued despite a maintenance visit last week.",
    ],
    aiFeedback: {
      enabled: true,
      stage: "opening of a General Training Task 1 letter",
      taught: ["Make the purpose clear early.", "Write for the specific reader and situation.", "Use natural, respectful and direct language."],
      criteria: ["purpose clarity", "relevance to the canonical situation", "appropriate tone for a tenant writing to a property manager", "naturalness and grammatical clarity"],
      exclusions: ["Do not assess the complete letter.", "Do not criticise missing bullet-point development at this opening stage.", "Do not demand one memorised formula or advanced vocabulary."],
      reflection: false,
    },
  },
  g10: {
    prompt: "Which organisation gives each paragraph a useful job?",
    shuffle: true,
    options: [
      { id: "purposeful-a", text: "Opening: purpose. Body 1: problem, earlier repair and effect. Body 2: requested action and access. Closing: confirmation and sign-off.", viable: true, feedback: "This is a coherent organisation: related information works together for the reader." },
      { id: "purposeful-b", text: "Opening: purpose. Body 1: problem and earlier repair. Body 2: effect, requested action and practical availability. Closing: confirmation and sign-off.", viable: true, feedback: "This can also work. The effect creates a natural reason for the request in the same paragraph." },
      { id: "bullet-formula", text: "Always create exactly one paragraph for each bullet point, in the order shown, regardless of the relationships between the information.", viable: false, feedback: "One paragraph per bullet is not an IELTS rule. Organise around communicative jobs and useful relationships." },
      { id: "random", text: "Mention parts of every bullet in each paragraph so the reader repeatedly encounters all three requirements.", viable: false, feedback: "Repetition makes the communication harder to follow. Give each paragraph a clear job." },
    ],
  },
  g11: {
    prompt: "Which body extract gives the reader enough relevant information?",
    shuffle: true,
    options: [
      { id: "enough", text: "The water worked normally for only two days after the maintenance visit and now turns cold again, particularly in the early morning. This makes it difficult to shower before my early work shifts.", viable: true, feedback: "This develops the recurring fault and its effect with relevant, believable detail." },
      { id: "mention", text: "The problem continues and it affects me.", viable: false, feedback: "Both jobs are mentioned, but neither is developed enough for the manager to understand the situation." },
      { id: "drama", text: "This disaster has ruined every aspect of my life and made the apartment completely impossible to live in.", viable: false, feedback: "The language is dramatic but not supported by the moderate situation. Relevant specifics would communicate more effectively." },
    ],
  },
  g12: {
    stages: [
      { id: "focus", label: "Focus", question: "What is this part doing?", example: "The hot-water fault returned shortly after the first maintenance visit." },
      { id: "develop", label: "Develop", question: "What does the reader need to understand?", example: "It now occurs most mornings and prevents the tenant from showering reliably before work." },
      { id: "close", label: "Close", question: "What is the last useful point before moving on?", example: "The tenant has sometimes needed to heat water separately." },
    ],
  },
  g13: {
    prompt: "Write one substantial body paragraph. Give it a clear communicative job.",
    help: [
      "What does this paragraph need to help the manager understand: the recurring problem, its effect, or the requested response?",
      "Start with one focus. Develop it with the most relevant situation detail, then stop when that job is complete.",
      "The water worked normally for only two days after the maintenance visit and now turns cold again, particularly in the early morning. As a result, I cannot shower reliably before my early work shifts and have sometimes needed to heat water separately.",
    ],
    aiFeedback: {
      enabled: true,
      stage: "body paragraph of a General Training Task 1 letter",
      taught: ["Give the paragraph one useful communicative job.", "Develop relevant information so the reader can understand and respond.", "Close the idea without adding an artificial conclusion."],
      criteria: ["clear communicative focus", "relevant and sufficient development", "appropriate detail", "tone", "organisation and clarity", "whether the reader can understand and respond"],
      exclusions: ["Do not score the whole letter.", "Do not demand every bullet point inside this paragraph.", "Do not demand complex vocabulary or an artificial concluding sentence."],
      reflection: true,
    },
  },
  g14: {
    prompt: "Which statement correctly distinguishes a content closing from a sign-off?",
    shuffle: true,
    options: [
      { id: "distinction", text: "A content closing completes the practical message; a sign-off ends the letter in a way that fits the relationship.", viable: true, feedback: "Yes. The reader may need a final action or expectation before the writer signs off." },
      { id: "same", text: "They are two names for the same final phrase, so only one is needed.", viable: false, feedback: "They perform different jobs. ‘Please confirm the visit time’ completes the message; ‘Kind regards’ signs off." },
      { id: "fixed", text: "Every General Training letter must use the same content closing and sign-off.", viable: false, feedback: "The appropriate ending depends on the reader, purpose and situation; there is no single compulsory formula." },
    ],
    signOffs: [
      { text: "Kind regards,", fit: "A dependable, natural option for this known role and middle-register relationship." },
      { text: "Yours sincerely,", fit: "A more formal but still conventional option when the reader is addressed by name." },
      { text: "Best,", fit: "Usually too relaxed for this particular unresolved property-management request." },
    ],
  },
  g15: {
    prompt: "Write the closing content and an appropriate sign-off.",
    help: [
      "What response or practical next step does the property manager need at the end?",
      "Ask for confirmation of the technician's visit, then choose a sign-off that is respectful without becoming ceremonial.",
      "I would appreciate confirmation of when the technician will visit.\n\nKind regards,\nSamir Hassan",
    ],
    aiFeedback: {
      enabled: true,
      stage: "closing of a General Training Task 1 letter",
      taught: ["Complete the communication rather than stopping abruptly.", "Make a useful next action or expectation clear where relevant.", "Choose a sign-off that fits the relationship and tone."],
      criteria: ["natural completion of the communication", "clarity of requested action or follow-up", "appropriate tone", "naturalness and grammatical clarity"],
      exclusions: ["Do not evaluate unrelated parts of the letter.", "Do not demand one universal closing sentence or sign-off.", "Do not demand advanced vocabulary."],
      reflection: false,
    },
  },
  g17: {
    checks: [
      { id: "bullet-points", label: "Bullet points", question: "Have I covered all three communication requirements sufficiently?" },
      { id: "tone", label: "Tone", question: "Does this sound appropriate for this reader and situation?" },
      { id: "purpose", label: "Purpose", question: "Is it clear why I am writing?" },
    ],
    statuses: ["Yes", "Not sure", "Needs work"],
  },
  g18: {
    aiFeedback: {
      enabled: true,
      stage: "complete General Training Task 1 response diagnosis",
      taught: [
        "Use WHO, WHY and WHAT to understand the communication.",
        "Use BTP—Bullet points, Tone and Purpose—as a course checking tool, not official IELTS terminology.",
        "Develop each communicative requirement sufficiently for the reader to understand and respond.",
        "Organise information so paragraphs perform useful communicative jobs.",
      ],
      criteria: [
        "task fulfilment: whether all three bullet points are addressed and sufficiently developed",
        "whether the response meets the 150-word minimum",
        "communication: whether the purpose is clear",
        "tone: whether the tenant–property-manager relationship is handled appropriately",
        "organisation: whether paragraphs perform clear communicative jobs",
        "language: clarity, natural vocabulary, grammatical accuracy, useful range, punctuation and capitalisation",
      ],
      exclusions: [
        "Do not give a band score or claim to be an official IELTS examiner.",
        "Do not immediately rewrite the complete letter.",
        "Do not require exactly three paragraphs, one paragraph per bullet point, difficult vocabulary or one fixed formula.",
        "Do not treat reaching 150 words as proof that the response is complete or effective. If it is below 150, identify this calmly as an IELTS requirement and use the communication evidence to diagnose what may need development.",
      ],
      reflection: true,
    },
  },
  g19: {
    lenses: [
      { id: "purpose", label: "Purpose", note: "The first paragraph identifies the recurring fault and the reason for contact immediately." },
      { id: "bullets", label: "Bullet points", note: "The problem, its practical effect and the requested action are each developed with information the reader can use." },
      { id: "tone", label: "Tone", note: "‘Could you please arrange’ is courteous and direct. The letter is firm about a recurring problem without attacking the reader." },
      { id: "organisation", label: "Organisation", note: "Each paragraph has a clear job: establish purpose, explain and develop, request action, then complete the communication." },
      { id: "language", label: "Language", note: "Relatively simple phrases such as ‘turns cold again’ and ‘I am usually available’ communicate precisely without decorative vocabulary." },
    ],
  },
  g20: {
    extract: "I am writing about the hot-water problem in my apartment. Although a maintenance worker came last week, the problem has started again. This is causing me considerable inconvenience. Please arrange another visit when possible. I would appreciate hearing from you soon.",
    prompt: "What is the most important communication problem in this nearly-good extract?",
    shuffle: true,
    options: [
      { id: "underdeveloped", text: "The purpose and tone are generally appropriate, but the effect and requested next step need more practical detail for the manager to respond effectively.", viable: true, feedback: "This identifies the subtle communication gap: the reader understands the topic but not the concrete effect, useful timing or access needed for the next action." },
      { id: "needs-force", text: "It should use stronger complaint language so the manager understands that the writer is serious.", viable: false, feedback: "The seriousness is already clear enough. Specific impact and a practical request would help more than greater emotional force." },
      { id: "needs-three-paragraphs", text: "It fails because every bullet point must occupy exactly one paragraph.", viable: false, feedback: "That is not an IELTS rule. The problem is insufficient practical development, not a fixed paragraph count." },
      { id: "already-complete", text: "It already gives the manager everything needed because it mentions the problem, effect and requested action.", viable: false, feedback: "All three jobs are mentioned, but mentioning them is not the same as developing enough relevant information for the reader to respond." },
    ],
  },
  g21: {
    reflectionOptions: [
      "Made the purpose clearer",
      "Adjusted the tone",
      "Developed a bullet point",
      "Reorganised information",
      "Corrected language",
      "Changed very little because the response was already effective",
    ],
  },
};
