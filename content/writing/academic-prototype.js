import { academicTaskInstruction, academicVisuals, academicVisualsById } from "./academic-visuals.js";
import { academicExplorerTasks, estimatedBandDisclaimer } from "./academic-explorer-tasks.js?v=academic-complete-1";

export const prototypeContent = {
  id: "brookfield-transport",
  title: "Daily journeys in Brookfield",
  dataset: academicVisualsById.line.data,
  academicVisuals,
  taskStatement:
    "The line graph shows the average number of daily journeys, in thousands, made by residents of Brookfield using car, bus and bicycle between 2010 and 2020.",
  taskInstruction: academicTaskInstruction,
  units: [
    { id: "a0", code: "A0", section: "intro", label: "IELTS Academic Writing Task 1", eyebrow: "Task 1 Visual Explorer" },
    { id: "b1", code: "B1", section: "intro", label: "Your Task 1 answer", eyebrow: "Recognise the structure" },
    { id: "b2", code: "B2", section: "intro", label: "Introduction", eyebrow: "Read → notice → build → write" },
    { id: "c1", code: "C1", section: "intro", label: "Overview", eyebrow: "See → recognise → build → write" },
    { id: "d1", code: "D1", section: "details", label: "Details", eyebrow: "Select → connect → explain" },
  ],
  a0: {
    tasks: academicExplorerTasks,
    estimatedBandDisclaimer,
  },
  b1: {
    image: {
      src: "assets/task-1-answer-structure.png",
      alt: "Typical Task 1 answer structure: an introduction says what the task shows, an overview gives the big picture, and one or two detail paragraphs describe the important information.",
    },
    prompt: "What does each paragraph do?",
    choices: ["Introduction", "Overview", "Details"],
    paragraphs: [
      {
        id: "hamza-bc01-details",
        student: "Hamza",
        task: "Bar chart",
        text: "For V60 Saadah have 48 that was much more than Dahariz 31 and Al Hafa 24 but Matcha is diffrent because Dahariz sold 43 and Saadah only 36 and Al Hafa was 17. Cold brew have the less sales in Al Hafa only 13 and Dahariz was 21 but in Saadah it was 31 this is the same number that Al Hafa have for Spanish latte and we can see the drinks have alot of diffrence between the three places.",
        answer: "Details",
      },
      {
        id: "youssef-mp01-overview",
        student: "Youssef",
        task: "Maps",
        text: "Overall Al Noor become much more developed in 2025 with alot more houses and new places for visitors. The fishing harbour and beach are still there but the harbour become bigger and many empty areas have buildings now.",
        answer: "Overview",
      },
      {
        id: "sara-tb01-introduction",
        student: "Sara",
        task: "Table",
        text: "The table gives information about students using AI in four different study fields in 2026, it show how many students use it every week and how many hours they use also for assessed work and AI training",
        answer: "Introduction",
      },
      {
        id: "fatma-pr01-details",
        student: "Fatma",
        task: "Process",
        text: "First there is roasted coffee beans and they go inside the grinder to make the coffee smaller. After this it go to the tank and cold filtered water is added with the coffee. It stay there for 16 hours and the temperature is 5°C. Then the coffee go inside the first filter which is coarse filter and after that there is another filter more fine. The used coffee grounds is taken away and now there is cold brew concentrate.",
        answer: "Details",
      },
      {
        id: "ahmed-pc01-overview",
        student: "Ahmed",
        task: "Pie charts",
        text: "In general accomodation have alot of the spending in both seasons and in winter it was more. Shopping also have big diffrence because in Khareef it was one of the high things but in winter it become less",
        answer: "Overview",
      },
      {
        id: "khalid-cb01-details",
        student: "Khalid",
        task: "Combined visuals",
        text: "For the other chart 21% was using Shahid and Netflix and 13% use Shahid with STC TV. This was interesting because STC TV only have 15% users in 2025 but 13% was using it with Shahid. Netflix and STC TV was only 6% and also 6% use all three platforms. Shahid was the highest platform in 2025 and also it was in the two biggest combinations so we can see many people using Shahid even if they have another service.",
        answer: "Details",
      },
    ],
  },
  b2: {
    instruction: "Describe the visual information in your own words.",
    levels: {
      cool: {
        label: "Cool",
        image: "assets/level-cool-lollipop.png",
        description: "Simple & clear.",
      },
      spicy: {
        label: "Spicy",
        image: "assets/level-spicy-chilli.png",
        description: "More range.",
      },
      splat: {
        label: "Splat!",
        image: "assets/level-splat-tomato.png",
        description: "Misses the job.",
      },
    },
    stages: {
      see: {
        taskId: "BC01",
        examples: [
          {
            level: "cool",
            text: "The bar chart shows the average daily sales of six drinks in three coffee shops in Dhofar in September 2026.",
          },
          {
            level: "spicy",
            text: "The bar chart compares the average daily sales of six different drinks at coffee shops in three areas of Dhofar in September 2026.",
          },
        ],
      },
      misses: {
        taskId: "MP01",
        examples: [
          {
            level: "splat",
            text: "A bridge was built across the wadi and a hotel was added near the beach.",
            reason: "It gives details, not what the maps show overall.",
          },
          {
            level: "cool",
            text: "The maps show changes to the Al Noor waterfront area between 2005 and 2025.",
          },
          {
            level: "splat",
            text: "The Al Noor waterfront is an interesting place for residents and visitors.",
            reason: "It gives an opinion, not what information the maps show.",
          },
        ],
      },
      classify: {
        taskId: "PR01",
        choices: ["cool", "spicy", "splat"],
        examples: [
          {
            id: "process-cool",
            answer: "cool",
            text: "The diagram shows how bottled cold-brew coffee is produced.",
          },
          {
            id: "process-splat",
            answer: "splat",
            text: "Cold-brew coffee is stored at 5°C before it is transported.",
            reason: "It gives one stage, not the whole process.",
          },
          {
            id: "process-spicy",
            answer: "spicy",
            text: "The diagram illustrates the process used to produce bottled cold-brew coffee.",
          },
        ],
      },
      build: {
        taskId: "TB01",
        cool: [
          { id: "cool-table", text: "The table" },
          { id: "cool-shows", text: "shows information about" },
          { id: "cool-ai", text: "AI use" },
          { id: "cool-students", text: "among university students" },
          { id: "cool-fields", text: "in four fields of study" },
          { id: "cool-year", text: "in 2026" },
        ],
        spicy: [
          { id: "spicy-table", text: "The table" },
          { id: "spicy-compares", text: "compares" },
          { id: "spicy-ai", text: "AI use among students" },
          { id: "spicy-fields", text: "across four fields of study" },
          { id: "spicy-university", text: "at a university" },
          { id: "spicy-year", text: "in 2026" },
        ],
      },
      write: {
        taskId: "PC01",
        help: {
          cool: ["The pie charts show…", "information about…", "visitor spending…", "in Dhofar…", "during Khareef and winter…", "in 2025…"],
          spicy: ["compares…", "presents information about…", "how visitors distributed their spending…", "across seven categories…", "during two tourist seasons…"],
        },
      },
      extra: {
        taskId: "LG01",
      },
    },
  },
  b4: {
    prompt: "Write one clear introductory sentence.",
    hint: "Start with meaning. What does the visual show, who or what does it concern, and when?",
    support: [
      "Name the visual.",
      "State that it compares average daily journeys.",
      "Include Brookfield, the three transport types and the period 2010–2020.",
    ],
    language: {
      clear: "The line graph shows average daily journeys made by car, bus and bicycle in Brookfield between 2010 and 2020.",
      expand: "The line graph compares the average number of daily journeys made using three forms of transport in Brookfield from 2010 to 2020.",
      explore: "The line graph provides data on average daily journeys, measured in thousands, made by Brookfield residents using car, bus and bicycle over the period 2010–2020.",
    },
    aiFeedback: {
      enabled: true,
      visualId: "line",
      stage: "Academic Task 1 introduction",
      taught: [
        "Represent the task accurately and preserve its meaning.",
        "Include the visual, subject, place and time period needed to introduce the task.",
        "Paraphrase naturally; precise technical words may remain unchanged.",
        "Use clear, controllable language without inventing information.",
      ],
      criteria: [
        "accuracy against the task and visual",
        "preservation of the original meaning",
        "natural paraphrasing and essential introductory information",
        "grammatical clarity",
        "whether any unsupported information has been added",
      ],
      exclusions: [
        "Do not criticise the learner for not writing an overview; this stage practises only the introduction.",
        "Do not demand detailed trends, comparisons or figures.",
        "Do not insist that every word from the task be replaced.",
      ],
      reflection: false,
    },
  },
  c1: {
    taskId: "BC01",
    example: "Overall, Spanish latte had the highest sales in all three coffee shops, while Al Hafa sold fewer drinks overall than Dahariz and Saadah.",
    explanation: "It gives the big picture.",
    hotTip: "Starting with Overall, makes it very clear that your overview is beginning.",
    hotTipNote: "But what comes after it still needs to give the big picture.",
  },
  c2: {
    examples: [
      {
        id: "bar-detail",
        taskId: "BC01",
        text: "Overall, Al Hafa sold 31 Spanish lattes per day.",
        answer: "splat",
        feedback: "It gives one detail, not the big picture.",
      },
      {
        id: "pie-main-change",
        taskId: "PC01",
        text: "Overall, accommodation accounted for the largest share of visitor spending in both seasons and was higher in winter, while shopping fell markedly.",
        answer: "cool",
        feedback: "It shows the main pattern and contrast.",
      },
      {
        id: "table-vague",
        taskId: "TB01",
        text: "Overall, there were several differences in AI use among the four fields of study.",
        answer: "splat",
        feedback: "It says there were changes, but not what the important changes were.",
      },
      {
        id: "maps-transformation",
        taskId: "MP01",
        text: "Overall, the Al Noor waterfront became much more developed, with expanded housing and new visitor facilities, while the beach and wadi remained.",
        answer: "cool",
        feedback: "It shows the overall transformation and an important continuity.",
      },
      {
        id: "process-stage",
        taskId: "PR01",
        text: "Overall, the coffee mixture is steeped for 16 hours at 5°C.",
        answer: "splat",
        feedback: "It only describes one stage, not the whole process.",
      },
      {
        id: "maps-one-change",
        taskId: "MP01",
        text: "Overall, the Al Noor waterfront was modernised, with a bridge built across the wadi.",
        answer: "splat",
        feedback: "It gives one change, not the big picture of the area.",
      },
      {
        id: "table-pattern",
        taskId: "TB01",
        text: "Overall, Engineering had the highest weekly AI use, while Health Sciences had the lowest, despite receiving the most formal AI training.",
        answer: "cool",
        feedback: "It identifies the strongest overall pattern and the exception.",
      },
    ],
  },
  c4: {
    taskId: "MP01",
    cool: "Overall, the Al Noor waterfront became much more developed, with more housing and new facilities for visitors.",
    spicy: "Overall, Al Noor underwent substantial development as housing and visitor facilities expanded, while the beach and wadi remained unchanged.",
  },
  c5: {
    taskId: "TB01",
    prompt: "Choose the TWO ideas that give the big picture.",
    shuffle: true,
    options: [
      { id: "engineering-weekly", text: "Engineering had the highest weekly AI use, while Health Sciences had the lowest.", expected: true },
      { id: "health-training", text: "Health Sciences received the most formal AI training despite having the lowest weekly use.", expected: true },
      { id: "business-hours", text: "Business students who used AI weekly averaged 6.2 hours of use.", expected: false },
      { id: "arts-assessed", text: "51% of Arts and Humanities students used AI for assessed work.", expected: false },
    ],
    success: "Together, these ideas give the big picture.",
    partial: "Some of your choices report individual figures. Look for the strongest pattern and the exception.",
  },
  c6: {
    taskId: "MP01",
    prompt: "Write a clear overview.",
    help: [
      "Thinking hint: What changed most, what stayed the same, and what kind of place did the Al Noor waterfront become?",
      "More support: Combine the expansion of housing, roads and visitor facilities with an important feature that remained.",
      "Example: Overall, the Al Noor waterfront became much more developed, with expanded housing and new visitor facilities, while the beach and wadi remained.",
    ],
    aiFeedback: {
      enabled: true,
      visualId: "MP01",
      stage: "Academic Task 1 map overview",
      taught: [
        "Step back from individual map changes and communicate the most important transformation of the whole place.",
        "Mention an important unchanged feature only when it contributes to the big picture.",
        "Allow more than one sensible overview when the canonical map supports it.",
      ],
      useVisualImportantFeatures: true,
      criteria: [
        "whether the response communicates the most important overall change",
        "whether all claims agree with the before-and-after map information",
        "whether it avoids becoming a list of individual location details",
        "clarity and grammatical control",
      ],
      exclusions: [
        "Do not demand detailed descriptions of every change.",
        "Do not require compass directions or exact locations in the overview.",
        "Do not treat the word Overall as an official IELTS requirement.",
        "Do not require one exact wording or one uniquely correct overview.",
      ],
      reflection: true,
    },
  },
  details: {
    anchor: "Details are not a list. Choose useful information, connect what belongs together, and explain the relationship clearly.",
    select: {
      taskId: "BC01",
      examples: [
        { id: "select-spanish-highest", text: "Spanish latte sales were highest in all three locations.", answer: "cool", feedback: "This identifies a useful pattern across the chart." },
        { id: "select-matcha-difference", text: "Matcha sales were highest in Dahariz and lowest in Al Hafa.", answer: "cool", feedback: "This identifies a clear and useful relationship across the three locations." },
        { id: "select-coldbrew-13", text: "Al Hafa sold 13 cold brews per day.", answer: "splat", feedback: "On its own, this doesn't tell us much. Compare it with something." },
      ],
    },
    connect: {
      taskId: "BC01",
      prompt: "Which evidence belongs together to compare Spanish latte sales across the three locations?",
      shuffle: true,
      options: [
        { id: "spanish-values", text: "Al Hafa 31 · Dahariz 57 · Saadah 68", viable: true, feedback: "These values describe the same drink across all three locations." },
        { id: "alhafa-values", text: "Spanish latte 31 · Iced latte 27 · Americano 19", viable: false, feedback: "These are all from Al Hafa, but they do not support the requested comparison across locations." },
        { id: "v60-values", text: "Al Hafa 24 · Dahariz 31 · Saadah 48", viable: false, feedback: "These values belong together, but they compare V60 rather than Spanish latte." },
      ],
    },
    compare: {
      taskId: "BC01",
      examples: [
        { id: "compare-list", text: "Al Hafa sold 31 Spanish lattes. Dahariz sold 57. Saadah sold 68.", answer: "splat", feedback: "It lists the numbers but doesn't show the relationship." },
        { id: "compare-ranking", text: "Spanish latte sales were highest in Saadah and lowest in Al Hafa.", answer: "cool", feedback: "It shows the relationship clearly." },
        { id: "compare-range", text: "Spanish latte was the most popular drink in all three locations, with daily sales ranging from 31 in Al Hafa to 68 in Saadah.", answer: "cool", feedback: "The figures support a clear pattern and range." },
      ],
      transfer: [
        {
          taskId: "PC01",
          id: "transfer-pie",
          text: "Accommodation rose from 24% in Khareef to 32% in winter, while shopping fell from 19% to 10%.",
          answer: "cool",
          feedback: "It selects two important seasonal changes and makes the contrast clear.",
        },
        {
          taskId: "TB01",
          id: "transfer-table",
          text: "Engineering had the highest weekly AI use at 82%, while Health Sciences had the lowest at 48%, despite recording the highest formal-training figure at 67%.",
          answer: "cool",
          feedback: "It connects the strongest ranking contrast with a useful exception.",
        },
      ],
    },
    maps: {
      taskId: "MP01",
      examples: [
        { id: "map-housing-visitors", text: "Housing expanded and several new visitor facilities were added.", answer: "cool", feedback: "These related changes show how the area developed." },
        { id: "map-harbour-continuity", text: "The harbour was enlarged, while the beach and wadi remained.", answer: "cool", feedback: "It connects a change with an important continuity." },
        { id: "map-carpark", text: "A car park was added.", answer: "splat", feedback: "One isolated change. Connect it with something related." },
      ],
      groups: [
        { label: "Housing and access", items: "expanded housing · more roads · bridge across the wadi" },
        { label: "Visitor facilities", items: "hotel · cafés · promenade · car park" },
        { label: "Harbour and natural features", items: "larger fishing harbour · beach and wadi remained" },
      ],
      sentence: "Housing expanded considerably, while a hotel and cafés were added near the beach.",
      writing: {
        prompt: "Write about one group of changes.",
        help: ["expanded…", "was added…", "remained…", "while…", "near…", "became…", "on the other side of…", "compared with…"],
        aiFeedback: {
          enabled: true,
          visualId: "MP01",
          stage: "Academic Task 1 map Details practice",
          taught: ["Select one meaningful group of related changes.", "Connect the changes clearly rather than listing isolated features.", "Describe only information supported by the maps."],
          taskSpecificFeatures: ["Housing and roads expanded on both sides of the wadi.", "A bridge, hotel, cafés, promenade and car park were added.", "The fishing harbour became larger, while the beach and wadi remained."],
          criteria: ["meaningful selection and grouping", "clear description of related changes", "accuracy against the maps", "clarity"],
          exclusions: ["Do not require the learner to describe the whole map.", "Do not require one exact grouping.", "Do not assign a band score or demand advanced map vocabulary."],
          reflection: true,
        },
      },
    },
    process: {
      taskId: "PR01",
      groups: [
        { label: "Preparation and extraction", items: "roasted beans → grinding → cold extraction → steeping" },
        { label: "Filtering and checking", items: "coarse filter → fine filter → mixing with water → strength check → chilling" },
        { label: "Bottling and distribution", items: "wash and sterilise bottles → filling → sealing → labelling → crates → refrigerated storage → distribution" },
      ],
      examples: [
        { id: "process-vague", text: "The coffee is made and then put into bottles.", answer: "splat", feedback: "Too much of the procedure is missing." },
        { id: "process-connected", text: "After the beans are ground, they are extracted in cold water for 16 hours at 5°C before the mixture is filtered.", answer: "cool", feedback: "It connects the stages and explains what happens." },
      ],
      writing: {
        prompt: "Explain one part of the process.",
        help: ["first…", "after…", "before…", "once…", "is then…", "before being…", "after which…", "finally…"],
        aiFeedback: {
          enabled: true,
          visualId: "PR01",
          stage: "Academic Task 1 process Details practice",
          taught: ["Choose one meaningful group of connected stages.", "Explain the sequence clearly rather than listing boxes.", "Keep the order and process facts accurate."],
          taskSpecificFeatures: ["Beans are ground and extracted in cold filtered water for 16 hours at 5°C.", "The mixture passes through coarse and fine filters before water is added, its strength is checked and it is chilled.", "Bottles are washed and sterilised before filling, sealing, labelling, refrigerated storage and distribution."],
          criteria: ["coherent grouping of stages", "clear sequence", "accuracy against the process", "clarity"],
          exclusions: ["Do not require the learner to explain the complete process.", "Do not require one exact grouping.", "Do not penalise simple successful language or assign a band score."],
          reflection: true,
        },
      },
    },
    build: {
      taskId: "BC01",
      evidence: ["Spanish latte", "Al Hafa: 31", "Dahariz: 57", "Saadah: 68"],
      relationshipPrompt: "What relationship will your sentence show?",
      shuffle: true,
      relationships: [
        { id: "highest-lowest", text: "Highest and lowest", viable: true, feedback: "This relationship helps the reader understand the three figures." },
        { id: "range", text: "A range from 31 to 68", viable: true, feedback: "This is another clear way to connect the evidence." },
        { id: "separate", text: "Three separate facts", viable: false, feedback: "The evidence is accurate, but the reader still has to discover the relationship." },
      ],
      writingPrompt: "Use the evidence to write one connected Details sentence.",
      feedback: "You moved from evidence toward your own comparison. More than one clear sentence can work.",
    },
    write: {
      taskId: "BC01",
      prompt: "Write one connected Details paragraph. Choose a useful group of information, show the relationship and support it with figures where helpful.",
      help: [
        "Choose one information group: for example, the three latte figures or the V60, matcha and cold-brew patterns.",
        "Useful fragments: was higher than · was lower than · the highest · the lowest · compared with · ranged from … to … · while …",
        "Check your paragraph: does it connect related information, make the relationship clear and use figures as evidence rather than as a list?",
      ],
      aiFeedback: {
        enabled: true,
        visualId: "BC01",
        stage: "Academic Task 1 connected Details paragraph",
        taught: [
          "Select a useful group of information rather than describing everything.",
          "Connect information that belongs together and make the relationship clear.",
          "Use accurate figures when they help explain the relationship.",
          "Do not invent reasons that the visual does not provide.",
        ],
        taskSpecificFeatures: [
          "Spanish latte records the highest sales in all three locations: 31 in Al Hafa, 57 in Dahariz and 68 in Saadah.",
          "Al Hafa records lower sales than Dahariz and Saadah for every drink shown.",
          "Dahariz and Saadah are close for iced latte and Americano, while V60 and matcha show clearer differences.",
          "Cold-brew sales range from 13 in Al Hafa to 31 in Saadah.",
        ],
        criteria: ["meaningful selection and grouping", "clear relationships and comparisons", "accuracy against the bar chart", "useful numerical support", "clarity and cohesion"],
        exclusions: [
          "Do not assess this as a complete Task 1 response or assign a band score.",
          "Do not demand a fixed number of figures or exactly two Details paragraphs.",
          "Do not require one uniquely correct grouping.",
          "Do not reward difficult vocabulary merely for being difficult.",
        ],
        reflection: true,
      },
    },
    spicy: [
      {
        family: "Data",
        cool: "Spanish latte sales were highest in Saadah and lowest in Al Hafa.",
        spicy: "Spanish latte was particularly popular in Saadah, where daily sales reached 68, more than double the figure for Al Hafa.",
      },
      {
        family: "Maps",
        cool: "Housing expanded considerably, while a hotel and cafés were added near the beach.",
        spicy: "Housing spread across previously empty land, while the waterfront gained several new visitor facilities, including a hotel and cafés.",
      },
      {
        family: "Process",
        cool: "After the beans are ground, they are extracted in cold water for 16 hours at 5°C before being filtered.",
        spicy: "Once the beans have been ground, they undergo a 16-hour cold extraction at 5°C, after which the resulting concentrate is filtered.",
      },
    ],
  },
};
