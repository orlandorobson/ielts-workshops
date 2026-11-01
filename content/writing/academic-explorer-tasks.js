const commonInstruction = "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.";

const feedback = (taskAchievement, coherence, lexical, grammar, scores = {}) => [
  { id: "ta", label: "Task Achievement", band: scores.ta || 6, comment: taskAchievement },
  { id: "cc", label: "Coherence & Cohesion", band: scores.cc || 5, comment: coherence },
  { id: "lr", label: "Lexical Resource", band: scores.lr || 5, comment: lexical },
  { id: "gra", label: "Grammatical Range & Accuracy", band: scores.gra || 5, comment: grammar },
];

export const academicExplorerTasks = [
  {
    id: "LG01",
    slug: "line",
    label: "Line graph",
    visualKind: "line",
    title: "Journeys to work in Brookfield, 2005–2025",
    taskStatement: "The line graph below shows the percentages of commuters in Brookfield whose main method of travelling to work was car, bus, bicycle or walking between 2005 and 2025.",
    taskInstruction: commonInstruction,
    whatItShows: "Changes in the main travel-to-work method used by Brookfield commuters between 2005 and 2025. A small residual used other methods.",
    whatToDo: "Describe the most important changes and comparisons and support them with figures from the graph.",
    axisLabel: "Percentage (%)",
    data: {
      years: [2005, 2009, 2013, 2017, 2021, 2025],
      series: [
        { label: "Car", values: [54, 49, 41, 42, 35, 29] },
        { label: "Bus", values: [21, 24, 27, 27, 34, 39] },
        { label: "Bicycle", values: [7, 9, 13, 15, 16, 17] },
        { label: "Walking", values: [15, 15, 15, 14, 12, 12] },
      ],
    },
    student: { name: "Mariam", band: "5.5" },
    model: `The line graph show how people in Brookfield going to work by car bus bicycle and walking between 2005 to 2025

At the begining car is the most using transport to go work and bus was much less than car after years this start to change and people start using bus more and car become less using and in 2025 bus was 39% Bicycle also become more using but walking almost the same and not have a big change

First of all car was 54% in 2005 and bus only 21% and bicyle 7% so we can see car was very more than the others in 2013 car decrased to 41% and bus increasd to 27% After that car increse again in 2017 to 42% so it was not decrasing all the years and bus stay 27% in this year but after 2017 car start decrasing again and bus start to increse more In 2025 bus was 39% but car was only 29% that mean bus was now more than car so this is a big change becos at first car was 54% and was the most using transport

For bicyle it start very low only 7% and then increse to 9% in 2009 and 13% in 2013 after this more people start using bicycle until it reach 17% in 2025 Walking people was 15% at first but it didnt increse like bicyle and in 2025 it was 12% so walking almost didnt change even thought the other transport have alot of diffrence`,
    feedback: feedback(
      "Mariam sees the main story of the graph clearly. She notices the fall in car use, the rise in bus and bicycle use, and that walking changes very little. Some of the smaller details are less important.",
      "She groups related information sensibly, especially car with bus and bicycle with walking. However, some sentences become very long and several ideas run together.",
      'Mariam has enough vocabulary to describe the changes, but some expressions and spellings are inaccurate, for example "most using transport" and "alot."',
      'Her meaning is usually clear, but verb forms and sentence structure are often inaccurate, for example "bus start to increse" and "car was very more than the others."',
    ),
  },
  {
    id: "BC01",
    slug: "bar",
    label: "Bar chart",
    visualKind: "bar",
    title: "Average daily drink sales at three coffee shops in Dhofar, September 2026",
    taskStatement: "The bar chart below shows the average number of six types of drinks sold per day at three coffee shops in Al Hafa, Dahariz and Saadah, Dhofar, in September 2026.",
    taskInstruction: commonInstruction,
    whatItShows: "Average daily sales of six drinks at coffee shops in Al Hafa, Dahariz and Saadah in September 2026.",
    whatToDo: "Compare the most important sales patterns across drinks and locations and support them with figures.",
    axisLabel: "Average drinks sold per day",
    data: {
      categories: ["Spanish latte", "Iced latte", "Americano", "V60", "Matcha", "Cold brew"],
      series: [
        { label: "Al Hafa", values: [31, 27, 19, 24, 17, 13] },
        { label: "Dahariz", values: [57, 52, 38, 31, 43, 21] },
        { label: "Saadah", values: [68, 49, 35, 48, 36, 31] },
      ],
    },
    student: { name: "Hamza", band: "5.5" },
    model: `The bar chart show the average drinks sold in three coffee shops in Dhofar Al Hafa Dahariz and Saadah in september 2026

In general we can see Spanish latte have the most sales in all coffee shops and Al Hafa have less sales than the other places. Saadah have high sales in many drinks but Dahariz also have high sales and some drinks was very close

First of all Spanish latte was the most popular drink in the three places Al Hafa sold 31 each day but Dahariz was 57 and Saadah 68 so it have more than double Al Hafa. For iced latte the numbers was more close because Dahariz sold 52 and Saadah 49 but Al Hafa only 27 after this Americano also have Dahariz more with 38 and Saadah 35 and Al Hafa was 19. This show the numbers for Dahariz and Saadah sometimes was very close

For V60 Saadah have 48 that was much more than Dahariz 31 and Al Hafa 24 but Matcha is diffrent because Dahariz sold 43 and Saadah only 36 and Al Hafa was 17. Cold brew have the less sales in Al Hafa only 13 and Dahariz was 21 but in Saadah it was 31 this is the same number that Al Hafa have for Spanish latte and we can see the drinks have alot of diffrence between the three places.`,
    feedback: feedback(
      "Hamza sees the main picture clearly. He recognises that Al Hafa has lower sales overall and makes some good comparisons between Dahariz and Saadah.",
      "He moves logically through the different drinks, but sometimes adds one comparison after another in the same sentence. This makes parts of the answer harder to follow.",
      'Hamza uses useful words for comparing sales, but some expressions are not quite natural, for example "have the most sales" and "the less sales."',
      'He can make comparisons successfully, but basic grammar is still inconsistent, for example "Spanish latte have" and "the numbers was more close."',
    ),
  },
  {
    id: "PC01",
    slug: "pie",
    label: "Pie charts",
    visualKind: "pie",
    title: "Visitor spending in Dhofar by season, 2025",
    taskStatement: "The pie charts below show how visitors to Dhofar distributed their spending among seven categories during the Khareef and winter tourist seasons in 2025.",
    taskInstruction: commonInstruction,
    whatItShows: "How visitors distributed their spending across seven categories during Khareef and winter in 2025.",
    whatToDo: "Describe the largest spending shares and the most important differences between the two seasons.",
    data: {
      categories: ["Accommodation", "Food & drink", "Shopping", "Public transport & taxis", "Car hire & fuel", "Activities & attractions", "Other"],
      periods: [
        { label: "Khareef", values: [24, 21, 19, 12, 8, 11, 5] },
        { label: "Winter", values: [32, 19, 10, 14, 13, 9, 3] },
      ],
    },
    student: { name: "Ahmed", band: "5.5" },
    model: `The pie charts show how visitors in Dhofar spend there money in Khareef and winter in 2025 in diffrent things like accomodation food shopping and transport

In general accomodation have alot of the spending in both seasons and in winter it was more. Shopping also have big diffrence because in Khareef it was one of the high things but in winter it become less

In Khareef accomodation was 24% and food and drink was 21% so they was very close and shopping also was 19%. Public transport was 12% and activities and attractions 11% and this was almost the same, car hire was less only 8% and other was 5% so there is alot of diffrent numbers in the spending

In winter accomodation increase to 32% that is 8% more than before and food and drink was 19% this is the same number shopping have in Khareef. Shopping in winter only 10% so it decrease alot but public transport become 14% and car hire also become more with 13% they was almost the same in winter even thought car hire was only 8% before Activities was 9% and this is also close to shopping with 10%. Other was only 3% and we can see some things change alot between Khareef and winter but some was almost the same.`,
    feedback: feedback(
      "Ahmed notices two of the clearest changes: accommodation takes a larger share in winter, while shopping falls considerably. He supports his description with figures, although he misses some other useful comparisons.",
      "He separates Khareef and winter clearly, so the answer is easy to navigate. Within the paragraphs, however, several comparisons are sometimes joined together in long sentences.",
      'Ahmed can describe changes in spending, but some words and expressions are inaccurate, for example "there money" and "have big diffrence."',
      'His meaning remains understandable, but agreement and verb forms frequently cause problems, for example "accomodation have" and "it decrease alot."',
    ),
  },
  {
    id: "TB01",
    slug: "table",
    label: "Table",
    visualKind: "table",
    title: "AI use among university students by field, 2026",
    taskStatement: "The table below shows information about the use of artificial intelligence (AI) by students in four fields of study at a university in 2026.",
    taskInstruction: commonInstruction,
    whatItShows: "Weekly AI use, usage time, assessed-work use and formal training across four university fields in 2026.",
    whatToDo: "Select and compare the most important differences in AI use and training across the four fields.",
    data: {
      columns: ["Field", "Students using AI weekly", "Average AI use among weekly users", "Using AI for assessed work", "Received formal AI training"],
      rows: [
        ["Engineering", "82%", "4.8 hours", "46%", "58%"],
        ["Business", "74%", "6.2 hours", "57%", "41%"],
        ["Arts & Humanities", "63%", "5.4 hours", "51%", "29%"],
        ["Health Sciences", "48%", "3.1 hours", "22%", "67%"],
      ],
      note: "Percentage columns refer to all students in each field. Average AI use refers only to students who used AI at least once a week.",
    },
    student: { name: "Sara", band: "5.5" },
    model: `The table gives information about students using AI in four different study fields in 2026, it show how many students use it every week and how many hours they use also for assessed work and AI training

Overall Engineering students use AI every week more than the other groups while Health Science students was the lowest. Business students spend the most hours using AI but Engineering was still have more weekly users. There was also big differences in the training between the four subjects

Engineering have 82% of students using AI weekly which was the highest number in the table and they use it average 4.8 hours. 46% use AI for assessed work and 58% recieved training. Business was different because 74% was using AI every week but the average hours was 6.2 so they use AI longer than Engineering, also 57% use it for assessed work which was the highest for this part but only 41% recieved training

For Arts and Humanities 63% use AI weekly and the hours was 5.4 this was also quite high and more than Engineering even thought less students was using AI every week. 51% use it in assessed work but only 29% have formal training so there is big diffrence between these two numbers. Health Sciences have only 48% using AI every week and they use 3.1 hours which was the lowest time. But the training was very high with 67% and this is more than all the other fields even they dont use AI as much. For assessed work Health Sciences was only 22% so we can see the use of AI is not same for the different students.`,
    feedback: feedback(
      "Sara notices that Engineering has the highest weekly AI use, while Business students use AI for the most hours. She also identifies the unusually high training figure for Health Sciences. Some stronger comparisons across the table are left unexplored.",
      "She works through the four fields in a logical way and the answer is generally easy to follow. Some sentences carry several figures and comparisons at once.",
      'Sara uses appropriate vocabulary for comparing AI use and training, but some forms and expressions are inaccurate, for example "big differences in the training" and "recieved training."',
      'She can express useful comparisons, but agreement and verb forms are inconsistent, for example "Engineering have 82%" and "less students was using AI."',
    ),
  },
  {
    id: "MP01",
    slug: "maps",
    label: "Maps",
    visualKind: "maps",
    title: "Changes to the Al Noor waterfront, 2005–2025",
    taskStatement: "The maps below show changes to the Al Noor waterfront area between 2005 and 2025.",
    taskInstruction: commonInstruction,
    whatItShows: "How the fictional Al Noor waterfront area changed between 2005 and 2025.",
    whatToDo: "Describe the most important changes to the area and identify significant features that remained.",
    importantFeatures: [
      "The waterfront became much more developed between 2005 and 2025.",
      "Housing, roads and visitor facilities expanded, and a bridge was added across the wadi.",
      "The beach and wadi remained, while the fishing harbour became larger.",
    ],
    data: {
      kind: "maps",
      periods: [
        { label: "2005", west: "housing and a market", east: "a small fishing harbour", centre: "a single road and the wadi", fixed: "the beach and wadi" },
        { label: "2025", west: "expanded housing, a larger market, a hotel, cafés and a promenade", east: "new housing, roads, a car park and a larger fishing harbour", centre: "a bridge across the wadi", fixed: "the beach and wadi" },
      ],
    },
    student: { name: "Youssef", band: "5.5" },
    model: `The maps show the changes happened in Al Noor waterfront between 2005 and 2025 and how this place developed in this years.

Overall Al Noor become much more developed in 2025 with alot more houses and new places for visitors. The fishing harbour and beach are still there but the harbour become bigger and many empty areas have buildings now.

In 2005 there was not many things in Al Noor. The houses was mostly in the left side near the road and there was a market under them. On the right side there was a wadi going to the sea and the road cross near this place to the fishing harbour. Most of the land around the houses was empty and the beach didnt have any buildings.

By 2025 the houses have increase alot and now they are in both sides of the wadi and more roads was build between them. There is also a bridge across the wadi and a roundabout on the right which connect the new houses and harbour area. The market become bigger and near the beach they build a hotel and some cafés with a promenade in front of it. A car park was also added next to the harbour and this harbour is much bigger than before. The beach still remain in the south and the wadi did not change but the area around them was very diffrent because now it have many more facilities and roads.`,
    feedback: feedback(
      "Youssef understood the main changes well. He noticed the expansion of housing, new visitor facilities and the larger harbour, while also recognising what stayed the same.",
      "His organisation works well: he describes Al Noor in 2005 and then explains what changed by 2025. Some of the information within the paragraphs could be ordered more clearly.",
      'He uses useful language for maps, such as "across the wadi" and "next to the harbour," but some descriptions are too basic or inaccurate, such as "in the left side" and "under them."',
      'Youssef can describe quite complex changes, but grammatical errors are frequent, for example "the houses have increase" and "more roads was build."',
      { cc: 6 },
    ),
  },
  {
    id: "PR01",
    slug: "process",
    label: "Process",
    visualKind: "process",
    title: "Production of bottled cold-brew coffee",
    taskStatement: "The diagram below shows the process used to produce bottled cold-brew coffee.",
    taskInstruction: commonInstruction,
    whatItShows: "How roasted coffee beans and prepared bottles become bottled cold-brew coffee for distribution.",
    whatToDo: "Describe the main stages from the preparation of the coffee and bottles to distribution.",
    data: {
      kind: "process",
      stages: [
        "roasted beans", "grinding", "cold extraction with filtered water", "steeping for 16 hours at 5°C",
        "coarse filtering", "fine filtering", "mixing with filtered water", "strength check", "chilling to 5°C",
        "washing and sterilising bottles", "filling", "sealing", "labelling", "crates", "refrigerated storage", "distribution",
      ],
    },
    student: { name: "Fatma", band: "5.5" },
    model: `The diagram show the process of making cold brew coffee and how it go from the coffee beans until the bottles go to shops and cafes.

Overall the process have many different steps and it start from roasted coffee beans. The coffee is made and after this put in bottles and at the end it is transported to different places.

First there is roasted coffee beans and they go inside the grinder to make the coffee smaller. After this it go to the tank and cold filtered water is added with the coffee. It stay there for 16 hours and the temperature is 5°C. Then the coffee go inside the first filter which is coarse filter and after that there is another filter more fine. The used coffee grounds is taken away and now there is cold brew concentrate.

The concentrate go to another tank and filtered water is added again and after this they check the strength. The coffee is chilled at 5°C. There is also empty bottles and they have to be washed and sterilised before filling the coffee. Then the bottles have the cold brew inside and they are sealed and after labelled.

After this the bottles go into the crates and the crates are put in refrigerated storage also at 5°C. Finally a truck take the cold brew to cafes and shops.`,
    feedback: feedback(
      "Fatma follows the process accurately and includes the important stages. Her overview is relevant, but it could say more about how the process is organised.",
      'The answer is easy to follow because Fatma moves through the process in the correct order. Linking is sometimes repetitive, especially "after this" and "after that."',
      'She uses useful process vocabulary such as "filtered," "chilled," "sealed" and "sterilised," but some expressions are awkward, for example "make the coffee smaller" and "have the cold brew inside."',
      'Fatma communicates each stage clearly, but verb forms are often inaccurate, for example "it go to the tank" and "a truck take the cold brew."',
      { cc: 6 },
    ),
  },
  {
    id: "CB01",
    slug: "combined",
    label: "Combined visuals",
    visualKind: "combined",
    title: "Video-on-demand platform use among adults in Saudi Arabia, 2025",
    taskStatement: "The bar chart and Venn diagram below show the percentages of Saudi adults using Shahid, Netflix or STC TV in 2025 and the reported overlaps between their audiences.",
    taskInstruction: commonInstruction,
    whatItShows: "Individual use of Shahid, Netflix and STC TV in 2025, alongside the reported overlap between their audiences.",
    whatToDo: "Compare individual platform use with the most important reported combinations shown in the two charts.",
    sourceNote: "Source: adapted from Saudi Center for Opinion Polling (SCOP), 2025.",
    data: {
      platforms: [
        { label: "Shahid", value: 51 },
        { label: "Netflix", value: 29 },
        { label: "STC TV", value: 15 },
      ],
      overlaps: {
        shahidNetflix: 21,
        shahidStc: 13,
        netflixStc: 6,
        allThree: 6,
        note: "Percentages are the overlap labels reported in the source Venn diagram; circle areas are not proportional.",
      },
    },
    student: { name: "Khalid", band: "6.0" },
    model: `The bar chart and Venn diagram show adults in Saudi Arabia using Shahid Netflix and STC TV in 2025 and also people using more than one of these platforms.

Overall Shahid have the most users and Netflix was second while STC TV was much lower than them. Alot of people was also using two platforms and some was using all three.

In 2025 Shahid reach 51% of adults and Netflix was 29% so the difference between them was quite big. STC TV was lower with 15% which was less than one third of the Shahid number.

For the other chart 21% was using Shahid and Netflix and 13% use Shahid with STC TV. This was interesting because STC TV only have 15% users in 2025 but 13% was using it with Shahid. Netflix and STC TV was only 6% and also 6% use all three platforms. Shahid was the highest platform in 2025 and also it was in the two biggest combinations so we can see many people using Shahid even if they have another service.`,
    feedback: feedback(
      "Khalid selects the main features and makes useful comparisons. He also connects the two visuals, for example noticing that Shahid appears in the two largest reported overlaps.",
      "His answer has a clear progression from the overall picture to the bar figures and then the Venn diagram. Some ideas could be connected more smoothly.",
      'Khalid has enough vocabulary to make useful comparisons, including "less than one third of the Shahid number." There are still some basic or repetitive expressions, such as "have the most users" and repeated use of "using."',
      'He attempts comparisons and more complex ideas successfully, but grammatical control is inconsistent, for example "Shahid have" and "some was using all three."',
      { cc: 6, lr: 6 },
    ),
  },
];

export const estimatedBandDisclaimer = "Band scores are estimates based on the official IELTS assessment criteria and may differ from an official examiner's score.";
