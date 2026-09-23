// Approved IELTS tasks and source-grounded analytical follow-ups.
export const activities=[
  {
    "id": "l41",
    "title": "4.1 · Follow the chain",
    "eyebrow": "See the shape",
    "instruction": "Listen and complete the chart.",
    "chart": [
      {
        "label": "Traffic volume",
        "numbers": []
      },
      {
        "label": "Higher ______",
        "numbers": [
          1
        ]
      },
      {
        "label": "Impact on ______ and public ______",
        "numbers": [
          2,
          3
        ]
      },
      {
        "label": "More respiratory ______",
        "numbers": [
          4
        ]
      }
    ],
    "questions": [
      {
        "number": 1,
        "label": "Higher ______",
        "type": "text",
        "answer": [
          "emission levels",
          "emissions"
        ]
      },
      {
        "number": 2,
        "label": "Impact on ______",
        "type": "text",
        "answer": [
          "environment"
        ]
      },
      {
        "number": 3,
        "label": "and public ______",
        "type": "text",
        "answer": [
          "health"
        ]
      },
      {
        "number": 4,
        "label": "More respiratory ______",
        "type": "text",
        "answer": [
          "issues"
        ]
      }
    ],
    "shape": [
      "Cause",
      "Effect → another cause",
      "Effect → another cause",
      "Effect"
    ],
    "review": [
      "Does box 1 cause box 2?",
      "What causes box 3?",
      "And box 4?",
      "Where are we now? What might come next?"
    ],
    "phrases": [
      "One factor that affects ____ is ____",
      "This leads to ____"
    ]
  },
  {
    "id": "l42",
    "title": "4.2 · Follow a problem",
    "eyebrow": "See the shape",
    "instruction": "Listen and complete the chart.",
    "chart": [
      {
        "label": "Student disengagement",
        "numbers": []
      },
      {
        "label": "Difficult to maintain ______",
        "numbers": [
          1
        ]
      },
      {
        "label": "Break lectures into ______ segments",
        "numbers": [
          2
        ]
      },
      {
        "label": "Doesn’t work equally in all ______",
        "numbers": [
          3
        ]
      }
    ],
    "questions": [
      {
        "number": 1,
        "label": "Difficult to maintain ______",
        "type": "text",
        "answer": [
          "concentration"
        ]
      },
      {
        "number": 2,
        "label": "Break lectures into ______ segments",
        "type": "text",
        "answer": [
          "shorter"
        ]
      },
      {
        "number": 3,
        "label": "Doesn’t work equally in all ______",
        "type": "text",
        "answer": [
          "subjects"
        ]
      }
    ],
    "shape": [
      "Problem",
      "Explanation",
      "Solution",
      "Evaluation"
    ],
    "phrases": [
      "One issue that ____ are dealing with is ____",
      "In response,"
    ],
    "review": [
      "Where are we now?",
      "What did the speaker do after explaining the problem?",
      "What changed when the speaker evaluated the solution?"
    ]
  },
  {
    "id": "l43",
    "title": "4.3 · Follow an explanation",
    "eyebrow": "See the shape",
    "instruction": "Listen and complete the chart.",
    "chart": [
      {
        "label": "AI has altered access to ______ in academia",
        "numbers": [
          1
        ]
      },
      {
        "label": "Less dependence on static and ______ materials",
        "numbers": [
          2
        ]
      },
      {
        "label": "Students use AI-assisted databases",
        "numbers": []
      },
      {
        "label": "Within ______ not longer periods of time",
        "numbers": [
          3
        ]
      }
    ],
    "questions": [
      {
        "number": 1,
        "label": "AI has altered access to ______ in academia",
        "type": "text",
        "answer": [
          "information"
        ]
      },
      {
        "number": 2,
        "label": "Less dependence on static and ______ materials",
        "type": "text",
        "answer": [
          "printed"
        ]
      },
      {
        "number": 3,
        "label": "Within ______ not longer periods of time",
        "type": "text",
        "answer": [
          "minutes"
        ]
      }
    ],
    "shape": [
      "Statement",
      "Explanation",
      "Example",
      "Illustration"
    ],
    "review": [
      "Where does the speaker give an example?",
      "How does the last box make the example clearer?"
    ]
  },
  {
    "id": "predict",
    "title": "What might come next?",
    "eyebrow": "Predict the move, not the words",
    "independent": true,
    "instruction": "A talk has presented a problem and explained it. What might come next? Choose a possibility, then tell your partner why. More than one move could make sense.",
    "questions": [
      {
        "label": "Problem → explanation → ?",
        "options": [
          {
            "value": "A",
            "text": "A solution"
          },
          {
            "value": "B",
            "text": "An example"
          },
          {
            "value": "C",
            "text": "A conclusion"
          }
        ],
        "answer": null
      }
    ],
    "prediction": true
  },
  {
    "id": "l44",
    "title": "4.4 · Identify the speaker",
    "eyebrow": "Follow the speaker",
    "instruction": "Choose the speaker for each attitude. Use each speaker once.",
    "questions": [
      {
        "label": "Sceptical",
        "type": "speaker",
        "options": [
          {
            "value": "1",
            "text": "Speaker 1"
          },
          {
            "value": "2",
            "text": "Speaker 2"
          },
          {
            "value": "3",
            "text": "Speaker 3"
          },
          {
            "value": "4",
            "text": "Speaker 4"
          }
        ],
        "answer": "4"
      },
      {
        "label": "Amused",
        "type": "speaker",
        "options": [
          {
            "value": "1",
            "text": "Speaker 1"
          },
          {
            "value": "2",
            "text": "Speaker 2"
          },
          {
            "value": "3",
            "text": "Speaker 3"
          },
          {
            "value": "4",
            "text": "Speaker 4"
          }
        ],
        "answer": "1"
      },
      {
        "label": "Optimistic",
        "type": "speaker",
        "options": [
          {
            "value": "1",
            "text": "Speaker 1"
          },
          {
            "value": "2",
            "text": "Speaker 2"
          },
          {
            "value": "3",
            "text": "Speaker 3"
          },
          {
            "value": "4",
            "text": "Speaker 4"
          }
        ],
        "answer": "3"
      },
      {
        "label": "Fascinated",
        "type": "speaker",
        "options": [
          {
            "value": "1",
            "text": "Speaker 1"
          },
          {
            "value": "2",
            "text": "Speaker 2"
          },
          {
            "value": "3",
            "text": "Speaker 3"
          },
          {
            "value": "4",
            "text": "Speaker 4"
          }
        ],
        "answer": "2"
      }
    ],
    "review": [
      "What did you hear that helped you choose? Tell your partner."
    ]
  },
  {
    "id": "ai44",
    "title": "How would you feel about seeing an AI doctor?",
    "eyebrow": "Choose → say it → explain why",
    "independent": true,
    "image": "attitude.png",
    "opinion": true,
    "instruction": "Choose the response closest to your view. Say it. Then explain why.",
    "questions": [
      {
        "label": "Which response is closest to your opinion?",
        "options": [
          {
            "value": "A",
            "text": "I don’t think it would bother me that much, to be honest."
          },
          {
            "value": "B",
            "text": "There’s no way I would trust an AI with my health."
          },
          {
            "value": "C",
            "text": "I guess there are some things I would be more comfortable consulting an AI about, and others I’d rather trust to a human doctor."
          },
          {
            "value": "D",
            "text": "There’s a good chance AI doctors are much more efficient and accurate than humans."
          }
        ]
      }
    ]
  },
  {
    "id": "l45",
    "title": "4.5 · Predict at the chimes",
    "eyebrow": "Predict → listen → check → update",
    "instruction": "Answer questions 1–3 below each time you hear the chime, you will hear it 3 times. In each case, what will the speaker do next?",
    "questions": [
      {
        "label": "Chime 1",
        "options": [
          {
            "value": "A",
            "text": "Give an example"
          },
          {
            "value": "B",
            "text": "Present a criticism"
          },
          {
            "value": "C",
            "text": "Give a conclusion"
          }
        ],
        "answer": "A"
      },
      {
        "label": "Chime 2",
        "options": [
          {
            "value": "A",
            "text": "Give another benefit"
          },
          {
            "value": "B",
            "text": "Present a limitation or concern"
          },
          {
            "value": "C",
            "text": "Discuss the history of X rays"
          }
        ],
        "answer": "B"
      },
      {
        "label": "Chime 3",
        "options": [
          {
            "value": "A",
            "text": "Explain how X-rays work"
          },
          {
            "value": "B",
            "text": "Introduce a new topic"
          },
          {
            "value": "C",
            "text": "Give a conclusion"
          }
        ],
        "answer": "C"
      }
    ],
    "review": [
      "Compare your prediction with what you actually heard.",
      "A changed prediction is not a listening failure. Noticing the change is the skill."
    ]
  },
  {
    "id": "l46",
    "title": "4.6 · Put the talk in order",
    "eyebrow": "Follow → update",
    "instruction": "Now listen and put the 4 steps of the talk in order. Choose a position from 1 to 4 for each step.",
    "questions": [
      {
        "label": "Conclusion",
        "type": "order",
        "options": [
          {
            "value": "1",
            "text": "1"
          },
          {
            "value": "2",
            "text": "2"
          },
          {
            "value": "3",
            "text": "3"
          },
          {
            "value": "4",
            "text": "4"
          }
        ],
        "answer": "4"
      },
      {
        "label": "Promising development",
        "type": "order",
        "options": [
          {
            "value": "1",
            "text": "1"
          },
          {
            "value": "2",
            "text": "2"
          },
          {
            "value": "3",
            "text": "3"
          },
          {
            "value": "4",
            "text": "4"
          }
        ],
        "answer": "1"
      },
      {
        "label": "Limitations",
        "type": "order",
        "options": [
          {
            "value": "1",
            "text": "1"
          },
          {
            "value": "2",
            "text": "2"
          },
          {
            "value": "3",
            "text": "3"
          },
          {
            "value": "4",
            "text": "4"
          }
        ],
        "answer": "3"
      },
      {
        "label": "Evidence",
        "type": "order",
        "options": [
          {
            "value": "1",
            "text": "1"
          },
          {
            "value": "2",
            "text": "2"
          },
          {
            "value": "3",
            "text": "3"
          },
          {
            "value": "4",
            "text": "4"
          }
        ],
        "answer": "2"
      }
    ],
    "review": [
      "Tell your partner the order you heard.",
      "Which move helped you find your place again?"
    ]
  },
  {
    "id": "l47",
    "title": "4.7 · Environmental Changes in the Petroleum Industry",
    "eyebrow": "Perform · IELTS Part 4",
    "instruction": "Write ONE WORD AND/OR A NUMBER for each answer.",
    "image": "petroleum.png",
    "questions": [
      {
        "number": 31,
        "label": "Pressure to reduce emissions comes not only from governments and investors but also from the wider ______.",
        "type": "text",
        "answer": [
          "public"
        ],
        "group": "Reasons for change",
        "limit": 1
      },
      {
        "number": 32,
        "label": "Renewable electricity may be used to support both extraction and oil ______.",
        "type": "text",
        "answer": [
          "processing"
        ],
        "group": "Renewable energy",
        "before": "Some companies are investing in large-scale solar and wind projects.",
        "limit": 1
      },
      {
        "number": 33,
        "label": "Carbon dioxide can be captured and stored underground in geological ______.",
        "type": "text",
        "answer": [
          "formations"
        ],
        "group": "Carbon capture technology",
        "limit": 1
      },
      {
        "number": 34,
        "label": "One criticism of carbon capture systems is that they require large amounts of ______ for operation.",
        "type": "text",
        "answer": [
          "energy"
        ],
        "limit": 1
      },
      {
        "number": 35,
        "label": "Researchers are investigating fuels produced from algae and agricultural ______.",
        "type": "text",
        "answer": [
          "waste materials"
        ],
        "group": "Biofuels",
        "limit": 2
      },
      {
        "number": 36,
        "label": "Unlike many biofuel crops, algae production does not depend on large amounts of agricultural ______.",
        "type": "text",
        "answer": [
          "land"
        ],
        "limit": 1
      },
      {
        "number": 37,
        "label": "Despite its environmental advantages, large-scale algae fuel production is currently limited by high production ______.",
        "type": "text",
        "answer": [
          "costs"
        ],
        "limit": 1
      },
      {
        "number": 38,
        "label": "Traditionally, equipment inspections were carried out according to a fixed ______ rather than actual need.",
        "type": "text",
        "answer": [
          "intervals"
        ],
        "group": "Maintenance and monitoring",
        "limit": 1
      },
      {
        "number": 39,
        "label": "Predictive maintenance systems may reduce operational failures by as much as ______ percent.",
        "type": "text",
        "answer": [
          "30%"
        ],
        "limit": 1
      },
      {
        "number": 40,
        "label": "Researchers are interested in the industry’s willingness to experiment with technologies that were once considered unrealistic or too ______.",
        "type": "text",
        "answer": [
          "expensive"
        ],
        "group": "Changing attitudes in the industry",
        "limit": 1
      }
    ]
  },
  {
    "id": "read47",
    "title": "4.7 · Listen again — and read",
    "eyebrow": "Listen again + read",
    "independent": true,
    "instruction": "Listen again with your teacher. Read while you listen. Notice how the speaker helps you follow his thinking.",
    "transcript": "petroleum",
    "questions": []
  },
  {
    "id": "local47",
    "title": "4.7 · What did he do?",
    "eyebrow": "Look closely · One moment in context",
    "requires": "l47",
    "transcriptRef": "petroleum",
    "instruction": "Look at the numbered phrase and the words around it. What did he do? The transcript has the evidence.",
    "questions": [
      {
        "label": "Look at ① and the rest of paragraph 3. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He describes a past practice, then says it is still largely true."
          },
          {
            "value": "B",
            "text": "He says the industry has completely stopped using fossil fuels."
          },
          {
            "value": "C",
            "text": "He explains how a new technology works."
          }
        ],
        "answer": "A",
        "refs": [
          3
        ]
      },
      {
        "label": "Look at ②. How does this connect with paragraph 3?",
        "options": [
          {
            "value": "A",
            "text": "He gives an example of public opinion."
          },
          {
            "value": "B",
            "text": "He gives a result of the pressure on companies."
          },
          {
            "value": "C",
            "text": "He questions whether emissions matter."
          }
        ],
        "answer": "B",
        "refs": [
          3,
          4
        ]
      },
      {
        "label": "Look at ③. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He sums up the whole talk."
          },
          {
            "value": "B",
            "text": "He returns to the history of solar power."
          },
          {
            "value": "C",
            "text": "He introduces a new area: carbon capture."
          }
        ],
        "answer": "C",
        "refs": [
          6
        ]
      },
      {
        "label": "Look at ⑤, after paragraph 8. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He explains how carbon capture works."
          },
          {
            "value": "B",
            "text": "He changes from a possible benefit to a limitation."
          },
          {
            "value": "C",
            "text": "He introduces another renewable energy project."
          }
        ],
        "answer": "B",
        "refs": [
          8,
          9
        ]
      },
      {
        "label": "Look at ⑥. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He keeps a possible benefit while questioning practicality."
          },
          {
            "value": "B",
            "text": "He rejects every possible benefit."
          },
          {
            "value": "C",
            "text": "He concludes that all the problems are solved."
          }
        ],
        "answer": "A",
        "refs": [
          10
        ]
      },
      {
        "label": "Look at ⑨ and ⑩. How do they develop paragraph 13?",
        "options": [
          {
            "value": "A",
            "text": "He adds two more environmental benefits."
          },
          {
            "value": "B",
            "text": "He explains how to grow algae."
          },
          {
            "value": "C",
            "text": "He adds a practical limit and repeats the promising-but-limited judgement."
          }
        ],
        "answer": "C",
        "refs": [
          13,
          14
        ]
      },
      {
        "label": "Look at ⑪. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He gives his final conclusion immediately."
          },
          {
            "value": "B",
            "text": "He moves to the final main area of the talk."
          },
          {
            "value": "C",
            "text": "He introduces the first example of biofuels."
          }
        ],
        "answer": "B",
        "refs": [
          15
        ]
      },
      {
        "label": "Look at ⑫. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He concludes that the industry is adapting, while keeping a limit."
          },
          {
            "value": "B",
            "text": "He says fossil-fuel dependence has ended."
          },
          {
            "value": "C",
            "text": "He raises a new question without answering it."
          }
        ],
        "answer": "A",
        "refs": [
          20
        ]
      }
    ]
  },
  {
    "id": "pattern47",
    "title": "4.7 · What was the thinking pattern?",
    "eyebrow": "Zoom out · Ideas across a section",
    "requires": "l47",
    "transcriptRef": "petroleum",
    "instruction": "Read the indicated paragraphs. Which pattern fits best? Think about how one idea leads to the next.",
    "questions": [
      {
        "label": "Look at paragraphs 6–10: carbon capture. Which pattern fits best?",
        "options": [
          {
            "value": "A",
            "text": "New development → possible benefit → limitation → balanced judgement"
          },
          {
            "value": "B",
            "text": "Problem → cause → solution → example"
          },
          {
            "value": "C",
            "text": "Opinion → example → history → conclusion"
          }
        ],
        "answer": "A",
        "refs": [
          6,
          7,
          8,
          9,
          10
        ]
      },
      {
        "label": "Look at paragraphs 11–14: biofuels and algae. Which pattern fits best?",
        "options": [
          {
            "value": "A",
            "text": "Past problem → complete solution → proof that it works everywhere"
          },
          {
            "value": "B",
            "text": "Question → definition → unrelated example → conclusion"
          },
          {
            "value": "C",
            "text": "Development → benefit or promise → practical limitation → balanced judgement"
          }
        ],
        "answer": "C",
        "refs": [
          11,
          12,
          13,
          14
        ]
      },
      {
        "label": "Look at paragraphs 15–18: maintenance. Which pattern fits best?",
        "options": [
          {
            "value": "A",
            "text": "New problem → proposed solution → rejection of the solution"
          },
          {
            "value": "B",
            "text": "Final area → old method → newer method → reported benefit and why it matters"
          },
          {
            "value": "C",
            "text": "Historical example → new question → unanswered criticism"
          }
        ],
        "answer": "B",
        "refs": [
          15,
          16,
          17,
          18
        ]
      }
    ],
    "review": [
      "Carbon capture and algae use a related pattern: what it is → why it looks promising → what the problem is → how to judge it. The maintenance section takes a different route."
    ]
  },
  {
    "id": "l48",
    "title": "4.8 · Self-healing concrete",
    "eyebrow": "Perform · IELTS Part 4",
    "instruction": "Questions 31–35. Complete the notes below. Write ONE WORD ONLY for each answer.",
    "questions": [
      {
        "number": 31,
        "label": "Small cracks allow ______ to enter the concrete.",
        "type": "text",
        "answer": [
          "water"
        ],
        "group": "The problem with ordinary concrete",
        "limit": 1
      },
      {
        "number": 32,
        "label": "This can cause the steel reinforcement to ______.",
        "type": "text",
        "answer": [
          "corrode"
        ],
        "limit": 1
      },
      {
        "number": 33,
        "label": "When water enters through a crack, the bacteria produce calcium carbonate, which is similar to ______.",
        "type": "text",
        "answer": [
          "limestone"
        ],
        "group": "How bacterial self-healing concrete works",
        "before": "Bacteria are placed in the concrete in an inactive state.",
        "after": "This material gradually seals the crack.",
        "limit": 1
      },
      {
        "number": 34,
        "label": "The technology is most effective at dealing with relatively ______ cracks.",
        "type": "text",
        "answer": [
          "small"
        ],
        "group": "A key limitation",
        "limit": 1
      },
      {
        "number": 35,
        "label": "Tiny ______ can protect the bacteria from the conditions inside the concrete.",
        "type": "text",
        "answer": [
          "capsules"
        ],
        "group": "Keeping the bacteria alive",
        "before": "The bacteria may remain inside the concrete for many years before they are needed.",
        "limit": 1
      },
      {
        "label": "cost of conventional repairs",
        "options": [
          {
            "value": "A",
            "text": "Other expenses can be more significant than the material itself."
          },
          {
            "value": "B",
            "text": "Its main advantage is that it requires less skilled labour."
          },
          {
            "value": "C",
            "text": "Its benefits may depend on how difficult future repairs would be."
          },
          {
            "value": "D",
            "text": "It could reduce demand for new material over a structure’s lifetime."
          },
          {
            "value": "E",
            "text": "It completely avoids one major source of environmental damage."
          },
          {
            "value": "F",
            "text": "The additional expense will not be justified in every situation."
          },
          {
            "value": "G",
            "text": "Different versions may be developed for different purposes."
          }
        ],
        "answer": "A",
        "number": 36,
        "group": "Questions 36–40",
        "before": "What does the lecturer say about the following aspects of self-healing concrete? Choose FIVE answers from the box and write the correct letter, A–G, next to Questions 36–40.",
        "sharedOptions": true
      },
      {
        "label": "environmental impact",
        "options": [
          {
            "value": "A",
            "text": "Other expenses can be more significant than the material itself."
          },
          {
            "value": "B",
            "text": "Its main advantage is that it requires less skilled labour."
          },
          {
            "value": "C",
            "text": "Its benefits may depend on how difficult future repairs would be."
          },
          {
            "value": "D",
            "text": "It could reduce demand for new material over a structure’s lifetime."
          },
          {
            "value": "E",
            "text": "It completely avoids one major source of environmental damage."
          },
          {
            "value": "F",
            "text": "The additional expense will not be justified in every situation."
          },
          {
            "value": "G",
            "text": "Different versions may be developed for different purposes."
          }
        ],
        "answer": "D",
        "number": 37,
        "group": null,
        "before": null,
        "sharedOptions": true
      },
      {
        "label": "value in difficult-to-reach structures",
        "options": [
          {
            "value": "A",
            "text": "Other expenses can be more significant than the material itself."
          },
          {
            "value": "B",
            "text": "Its main advantage is that it requires less skilled labour."
          },
          {
            "value": "C",
            "text": "Its benefits may depend on how difficult future repairs would be."
          },
          {
            "value": "D",
            "text": "It could reduce demand for new material over a structure’s lifetime."
          },
          {
            "value": "E",
            "text": "It completely avoids one major source of environmental damage."
          },
          {
            "value": "F",
            "text": "The additional expense will not be justified in every situation."
          },
          {
            "value": "G",
            "text": "Different versions may be developed for different purposes."
          }
        ],
        "answer": "C",
        "number": 38,
        "group": null,
        "before": null,
        "sharedOptions": true
      },
      {
        "label": "initial cost of self-healing concrete",
        "options": [
          {
            "value": "A",
            "text": "Other expenses can be more significant than the material itself."
          },
          {
            "value": "B",
            "text": "Its main advantage is that it requires less skilled labour."
          },
          {
            "value": "C",
            "text": "Its benefits may depend on how difficult future repairs would be."
          },
          {
            "value": "D",
            "text": "It could reduce demand for new material over a structure’s lifetime."
          },
          {
            "value": "E",
            "text": "It completely avoids one major source of environmental damage."
          },
          {
            "value": "F",
            "text": "The additional expense will not be justified in every situation."
          },
          {
            "value": "G",
            "text": "Different versions may be developed for different purposes."
          }
        ],
        "answer": "F",
        "number": 39,
        "group": null,
        "before": null,
        "sharedOptions": true
      },
      {
        "label": "future development",
        "options": [
          {
            "value": "A",
            "text": "Other expenses can be more significant than the material itself."
          },
          {
            "value": "B",
            "text": "Its main advantage is that it requires less skilled labour."
          },
          {
            "value": "C",
            "text": "Its benefits may depend on how difficult future repairs would be."
          },
          {
            "value": "D",
            "text": "It could reduce demand for new material over a structure’s lifetime."
          },
          {
            "value": "E",
            "text": "It completely avoids one major source of environmental damage."
          },
          {
            "value": "F",
            "text": "The additional expense will not be justified in every situation."
          },
          {
            "value": "G",
            "text": "Different versions may be developed for different purposes."
          }
        ],
        "answer": "G",
        "number": 40,
        "group": null,
        "before": null,
        "sharedOptions": true
      }
    ]
  },
  {
    "id": "read48",
    "title": "4.8 · Listen again — and read",
    "eyebrow": "Listen again + read",
    "independent": true,
    "instruction": "Listen again with your teacher. Read while you listen. Notice how this speaker helps you follow his thinking.",
    "transcript": "concrete",
    "questions": []
  },
  {
    "id": "local48",
    "title": "4.8 · What did he do?",
    "eyebrow": "Look closely · One moment in context",
    "requires": "l48",
    "transcriptRef": "concrete",
    "instruction": "Look at the numbered phrase and its context. What did he do? You can use the transcript without replaying the audio.",
    "questions": [
      {
        "label": "Look at ①. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He gives the solution."
          },
          {
            "value": "B",
            "text": "He creates the main question the next part will explore."
          },
          {
            "value": "C",
            "text": "He gives another example of damage."
          }
        ],
        "answer": "B",
        "refs": [
          4,
          5
        ]
      },
      {
        "label": "Look at ②. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He starts the explanation."
          },
          {
            "value": "B",
            "text": "He introduces a new problem."
          },
          {
            "value": "C",
            "text": "He gives his conclusion."
          }
        ],
        "answer": "A",
        "refs": [
          6,
          7,
          8
        ]
      },
      {
        "label": "Look at ④. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He corrects a possible misunderstanding."
          },
          {
            "value": "B",
            "text": "He gives evidence that bridges are unsafe."
          },
          {
            "value": "C",
            "text": "He introduces the cost problem."
          }
        ],
        "answer": "A",
        "refs": [
          10
        ]
      },
      {
        "label": "Look at ⑥, after paragraph 11. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He shows another advantage."
          },
          {
            "value": "B",
            "text": "He changes from a solution to a new problem."
          },
          {
            "value": "C",
            "text": "He explains how the capsules work."
          }
        ],
        "answer": "B",
        "refs": [
          11,
          12
        ]
      },
      {
        "label": "Look at ⑦. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He raises a question that he is going to answer."
          },
          {
            "value": "B",
            "text": "He concludes that the technology is too expensive."
          },
          {
            "value": "C",
            "text": "He changes to environmental damage."
          }
        ],
        "answer": "A",
        "refs": [
          12
        ]
      },
      {
        "label": "Look at ⑧. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He explains how the bacteria survive."
          },
          {
            "value": "B",
            "text": "He repeats the problem of high initial cost."
          },
          {
            "value": "C",
            "text": "He adds a possible benefit from using less new material."
          }
        ],
        "answer": "C",
        "refs": [
          13
        ]
      },
      {
        "label": "Look at ⑨. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He repeats exactly the same question."
          },
          {
            "value": "B",
            "text": "He changes the question to focus on material use over time."
          },
          {
            "value": "C",
            "text": "He concludes that cement has no environmental impact."
          }
        ],
        "answer": "B",
        "refs": [
          14
        ]
      },
      {
        "label": "Look at ⑩ and what follows. What does he do?",
        "options": [
          {
            "value": "A",
            "text": "He promises the same concrete will work everywhere."
          },
          {
            "value": "B",
            "text": "He gives another example of water activating bacteria."
          },
          {
            "value": "C",
            "text": "He asks why it is not widely used, then explains its limits."
          }
        ],
        "answer": "C",
        "refs": [
          15
        ]
      }
    ]
  },
  {
    "id": "pattern48",
    "title": "4.8 · What was the thinking pattern?",
    "eyebrow": "Zoom out · Ideas across a section",
    "requires": "l48",
    "transcriptRef": "concrete",
    "instruction": "Read the indicated paragraphs. Which pattern fits best?",
    "questions": [
      {
        "label": "Look at paragraphs 1–8: from cracks to bacteria. Which pattern fits best?",
        "options": [
          {
            "value": "A",
            "text": "Benefit → criticism → historical example"
          },
          {
            "value": "B",
            "text": "Problem and its effects → question → proposed approach and explanation"
          },
          {
            "value": "C",
            "text": "Conclusion → evidence → a different topic"
          }
        ],
        "answer": "B",
        "refs": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8
        ]
      },
      {
        "label": "Look at paragraphs 11–12: protecting bacteria and paying more. Which pattern fits best?",
        "options": [
          {
            "value": "A",
            "text": "Problem → solution → new cost problem → reasons it may be worth paying"
          },
          {
            "value": "B",
            "text": "Two benefits → evidence → rejection of the technology"
          },
          {
            "value": "C",
            "text": "Question → historical background → complete solution"
          }
        ],
        "answer": "A",
        "refs": [
          11,
          12
        ]
      },
      {
        "label": "Look at paragraphs 13–15: wider benefits and limits. Which pattern fits best?",
        "options": [
          {
            "value": "A",
            "text": "Environmental problem → claim of no emissions → universal solution"
          },
          {
            "value": "B",
            "text": "Cost problem → instructions for making concrete → example"
          },
          {
            "value": "C",
            "text": "Possible wider benefit → better question → practical limits → different solutions for different situations"
          }
        ],
        "answer": "C",
        "refs": [
          13,
          14,
          15
        ]
      }
    ]
  },
  {
    "id": "compare",
    "title": "Different language. Similar jobs.",
    "eyebrow": "Put the two talks together",
    "requiresAll": [
      "pattern47",
      "pattern48"
    ],
    "independent": true,
    "instruction": "What is the speaker doing now? Where are we in the thinking?",
    "questions": [],
    "comparison": true
  },
  {
    "id": "reflection",
    "title": "What did you start noticing?",
    "eyebrow": "Take it into your next listen",
    "independent": true,
    "instruction": "Choose one thing to listen for next time. Tell your partner why. No score.",
    "questions": [
      {
        "label": "Next time I lose the speaker, I can listen for…",
        "type": "reflection",
        "options": [
          {
            "value": "A",
            "text": "an explanation"
          },
          {
            "value": "B",
            "text": "an example"
          },
          {
            "value": "C",
            "text": "a problem or limitation"
          },
          {
            "value": "D",
            "text": "a change of direction"
          },
          {
            "value": "E",
            "text": "a conclusion"
          }
        ]
      }
    ]
  }
];
