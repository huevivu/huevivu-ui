# Custom Rules

## Exporting Artifacts
Whenever you create or update `task.md`, `walkthrough.md`, or `implementation_plan.md` in the brain artifacts directory, you MUST always run `node scripts/export_docs.js` to export a copy of these markdown files into the `scripts/docs/progress/` folder with a timestamp. This allows the user to keep a history of the project's progress.
