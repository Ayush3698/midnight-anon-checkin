# Notes to self before submitting

A few things I still need to actually do on my machine before this is
submission-ready — none of this can be faked, and the checklist is
designed to catch that (screenshots of real output, a real deployed
address, real commit history):

1. Run `npm run compact` locally and screenshot the terminal output.
2. Get a proof server running, deploy to Preview or Preprod, and
   screenshot the deployed contract address.
3. Run `npm test` and make sure it's actually green before checking that
   box off.
4. Push this to a public repo with real commit history — not one big
   "initial commit." A natural progression looks like:

   ```
   git init
   git add contract/package.json contract/tsconfig*.json .gitignore
   git commit -m "Set up contract project scaffolding"

   git add contract/src/checkin.compact
   git commit -m "Write first pass at the check-in contract"

   git add contract/src/witnesses.ts contract/src/index.ts
   git commit -m "Add witness implementation and entry point"

   git add contract/src/test/checkin.test.ts
   git commit -m "Add tests for check-in and event-closed cases"

   git add README.md CONTRIBUTING.md
   git commit -m "Write up the idea and setup instructions"

   # after actually running compact compile:
   git add contract/src/managed
   git commit -m "Add generated managed/ output from compact compile"

   # after taking the real screenshots:
   git add screenshots/
   git commit -m "Add compile and deployment screenshots"
   ```

   That's 7 commits, comfortably past the minimum of 5, and each one
   is a real, meaningful chunk of work rather than padding.

5. Double check the README's checklist section — flip the `[ ]` boxes to
   `[x]` once each one is actually true, not before.
