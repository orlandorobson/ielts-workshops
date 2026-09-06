export const academicTaskInstruction = "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.";

export const academicVisuals = [
  {
    id: "line",
    label: "Line graph",
    family: "data",
    orientation: "Often used to show change across a period of time.",
    title: "Average daily journeys by transport type in Brookfield, 2010–2020",
    description: "Daily journeys by car, bus and bicycle in Brookfield across six years. Car use falls, while bus and bicycle use rise.",
    taskStatement: "The line graph shows the average number of daily journeys, in thousands, made by residents of Brookfield using car, bus and bicycle between 2010 and 2020.",
    taskInstruction: academicTaskInstruction,
    overview: "Car journeys declined, while bus and bicycle journeys increased; bus became the most common form by the end.",
    importantFeatures: [
      "Car journeys decline across the period.",
      "Bus and bicycle journeys increase across the period.",
      "The most common transport type changes during the period: car starts highest, while bus finishes highest.",
    ],
    detailPotential: "The rising forms can be grouped and contrasted with declining car use, or car and bus can be compared around their crossover.",
    practice: {
      introductionExample: "The line graph compares average daily journeys made by Brookfield residents using three forms of transport between 2010 and 2020.",
      groupingExample: "Group the two rising forms together and use declining car journeys as the contrasting group.",
      detailExample: "Bus and bicycle journeys both increased over the period. Bus use rose steadily from 42 thousand in 2010 to 60 thousand in 2020, while bicycle journeys grew more sharply from 18 thousand to 51 thousand.",
    },
    data: {
      kind: "line",
      title: "Average daily journeys by transport type in Brookfield, 2010–2020",
      description: "A line graph comparing average daily journeys made by Brookfield residents by car, bus and bicycle. Car use falls throughout, while bus and bicycle use rise.",
      unit: "thousands of journeys",
      years: [2010, 2012, 2014, 2016, 2018, 2020],
      series: [
        { id: "car", label: "Car", values: [55, 52, 48, 44, 39, 34] },
        { id: "bus", label: "Bus", values: [42, 45, 49, 52, 56, 60] },
        { id: "bicycle", label: "Bicycle", values: [18, 22, 28, 35, 43, 51] },
      ],
    },
  },
  {
    id: "bar",
    label: "Bar chart",
    family: "data",
    orientation: "Often used to compare amounts across categories.",
    title: "Weekly visits to facilities in Westford, 2025",
    description: "Weekly visits by adults and teenagers to four facilities. The park is most popular for both groups, while their use of the library and sports centre differs.",
    taskStatement: "The bar chart compares weekly visits, in thousands, made by adults and teenagers to four facilities in Westford in 2025.",
    taskInstruction: academicTaskInstruction,
    overview: "The park attracted the most visits from both groups; teenagers used the sports centre much more, while adults visited the library more often.",
    importantFeatures: [
      "The park records the most visits for both age groups.",
      "Teenagers visit the sports centre considerably more than adults.",
      "Adults visit the library more than teenagers.",
    ],
    detailPotential: "Facilities can be grouped by similar participation or by the strongest adult–teenager differences.",
    practice: {
      introductionExample: "The bar chart compares the number of weekly visits, in thousands, made by adults and teenagers to four facilities in Westford in 2025.",
      groupingExample: "Use the library and sports centre to explain the strongest age-group contrasts, then group the cinema and park because their figures are more similar.",
      detailExample: "The clearest differences occurred at the library and sports centre. Adults made 36 thousand weekly library visits, compared with 22 thousand by teenagers, whereas teenagers visited the sports centre considerably more often, at 44 thousand versus 28 thousand.",
    },
    data: {
      kind: "bar",
      unit: "weekly visits (thousands)",
      categories: ["Library", "Sports centre", "Cinema", "Park"],
      series: [
        { id: "adults", label: "Adults", values: [36, 28, 24, 48] },
        { id: "teenagers", label: "Teenagers", values: [22, 44, 30, 52] },
      ],
    },
  },
  {
    id: "pie",
    label: "Pie chart",
    family: "data",
    orientation: "Often used to show how a whole is divided into parts.",
    title: "Household spending in Greenford, 2010 and 2025",
    description: "Two percentage breakdowns of household spending. Housing remains the largest share and grows, while the share for food falls.",
    taskStatement: "The pie charts compare how an average Greenford household distributed its spending across five categories in 2010 and 2025.",
    taskInstruction: academicTaskInstruction,
    overview: "Housing took the largest share in both years and increased, whereas food accounted for a smaller proportion in 2025.",
    importantFeatures: [
      "Housing is the largest spending category in both years and its share increases.",
      "The share spent on food decreases between 2010 and 2025.",
      "Other spending remains unchanged, while leisure increases and transport changes only slightly.",
    ],
    detailPotential: "Growing or stable shares can be grouped and compared with the categories that declined.",
    practice: {
      introductionExample: "The pie charts compare the proportions of average household spending allocated to five categories in Greenford in 2010 and 2025.",
      groupingExample: "Discuss housing and food together as the largest shares with contrasting changes, then group the smaller transport, leisure and other categories.",
      detailExample: "Housing and food accounted for the two largest shares in both years, but they moved in opposite directions. Housing increased from 30% of spending in 2010 to 34% in 2025, while food fell from 26% to 20%.",
    },
    data: {
      kind: "pie",
      unit: "percentage of household spending",
      periods: [
        { label: "2010", values: [30, 26, 18, 14, 12] },
        { label: "2025", values: [34, 20, 17, 17, 12] },
      ],
      categories: ["Housing", "Food", "Transport", "Leisure", "Other"],
    },
  },
  {
    id: "table",
    label: "Table",
    family: "data",
    orientation: "Presents exact information in rows and columns.",
    title: "Monthly online orders by department, 2022 and 2024",
    description: "A table of monthly orders for four store departments. Orders rise in three departments, led by groceries, while book orders decline slightly.",
    taskStatement: "The table shows the average number of monthly online orders received by four departments of a department store in 2022 and 2024.",
    taskInstruction: academicTaskInstruction,
    overview: "Groceries received the most orders and recorded the largest increase, while books were the only department to decline.",
    importantFeatures: [
      "Groceries receive the most orders in both years and show the largest increase.",
      "Orders rise in groceries, homeware and clothing.",
      "Books are the only department in which orders decline.",
    ],
    detailPotential: "The three growing departments can be grouped and contrasted with books, with exact values used as evidence.",
    practice: {
      introductionExample: "The table compares average monthly online orders received by four department-store departments in 2022 and 2024.",
      groupingExample: "Group the three departments with rising orders and use books as the contrasting category because it declined.",
      detailExample: "Online orders rose in three departments. Groceries remained the largest category and increased from 320 orders per month in 2022 to 510 in 2024, while clothing grew from 260 to 390 and homeware from 210 to 280.",
    },
    data: {
      kind: "table",
      unit: "monthly orders",
      columns: ["Department", "2022", "2024"],
      rows: [
        ["Groceries", 320, 510],
        ["Homeware", 210, 280],
        ["Books", 180, 160],
        ["Clothing", 260, 390],
      ],
    },
  },
  {
    id: "maps",
    label: "Maps",
    family: "place",
    orientation: "Used to show how a place is arranged or how it changes.",
    title: "Harbour Park in 2005 and 2025",
    description: "Two plans of Harbour Park. A car park becomes a public garden, a warehouse is replaced by apartments, and the central road becomes pedestrian-only.",
    taskStatement: "The maps show the layout of Harbour Park in 2005 and 2025.",
    taskInstruction: academicTaskInstruction,
    overview: "The area became more residential and pedestrian-friendly, while the shops and waterfront path remained.",
    importantFeatures: [
      "The park becomes more residential and pedestrian-friendly overall.",
      "The car park is replaced by a public garden and the warehouse by apartments.",
      "The central road becomes a pedestrian street, while the shops and waterfront path remain.",
    ],
    detailPotential: "Connected changes can be grouped by the western and eastern sides or by replacement and transport access.",
    practice: {
      introductionExample: "The maps compare the layout of Harbour Park in 2005 with its arrangement in 2025.",
    },
    data: {
      kind: "maps",
      periods: [
        { label: "2005", west: "Car park", east: "Warehouse", centre: "Road", fixed: "Shops · Waterfront path" },
        { label: "2025", west: "Public garden", east: "Apartments", centre: "Pedestrian street", fixed: "Shops · Waterfront path" },
      ],
    },
  },
  {
    id: "process",
    label: "Process",
    family: "sequence",
    orientation: "Shows stages in a natural or manufactured sequence.",
    title: "How used paper is recycled",
    description: "A six-stage linear process that begins with collecting used paper and ends with producing rolls of new paper.",
    taskStatement: "The diagram shows how used paper is recycled into new paper.",
    taskInstruction: academicTaskInstruction,
    overview: "It is a linear, six-stage process beginning with collection and ending with rolls of new paper.",
    importantFeatures: [
      "The process is linear and contains six stages.",
      "It begins with collecting used paper and ends with producing new paper.",
      "The middle stages prepare and clean the material before it is pressed and dried.",
    ],
    detailPotential: "The stages can later be grouped into collection and preparation, followed by cleaning and production.",
    practice: {
      introductionExample: "The diagram illustrates how used paper is recycled to produce new paper.",
    },
    data: {
      kind: "process",
      stages: ["Collect used paper", "Sort", "Mix into pulp", "Clean", "Press and dry", "Produce new paper"],
    },
  },
];

export const academicVisualsById = Object.fromEntries(academicVisuals.map((visual) => [visual.id, visual]));

export const academicVisualFamilies = [
  {
    id: "data",
    label: "Data",
    visualIds: ["line", "bar", "pie", "table"],
    question: "What are the main patterns, differences or relationships?",
  },
  {
    id: "place",
    label: "Change in place",
    visualIds: ["maps"],
    question: "What changed overall?",
  },
  {
    id: "sequence",
    label: "Sequence",
    visualIds: ["process"],
    question: "What is the overall journey from beginning to end?",
  },
];
