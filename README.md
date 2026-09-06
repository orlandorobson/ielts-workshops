# IELTS Workshops

This repository contains a lightweight static prototype for IELTS workshops.

The Academic Writing Task 1 workshop at `writing/task-1/academic/` covers visual-family orientation, introduction, overview transfer, detail-paragraph development and optional visual practice. Its six original Academic visual examples are reusable structured course assets.

The General Training Writing Task 1 core workshop at `writing/task-1/general/` develops communication literacy through WHO / WHY / WHAT, tone, bullet-point development, opening/body/closing writing, complete-letter construction, BTP self-checking, diagnosis and revision.

The shared Academic and General Training Writing Task 2 v0.1 workshop at `writing/task-2/` takes learners through understanding the question, building reasoning, organising and writing a complete essay, diagnosing and revising it, and transferring the process to a fresh question.

Genuine free-writing stages provide optional, stage-specific prompts that learners can copy into an external AI chatbot before returning to revise their own saved writing. The site does not send learner writing or call an AI service.

To preview it locally from the repository root, start any simple static server, for example:

```sh
python3 -m http.server 8000
```

Then open one of:

- `http://localhost:8000/writing/task-1/academic/`
- `http://localhost:8000/writing/task-1/general/`
- `http://localhost:8000/writing/task-2/`
