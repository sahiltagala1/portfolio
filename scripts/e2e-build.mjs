// Builds a copy of the site for the browser tests into ./out-e2e, with a
// fake contact form ID so the form renders. Tests intercept its requests,
// so nothing is ever sent.
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, E2E_OUT: "out-e2e", NEXT_PUBLIC_FORMSPREE_ID: "e2e-test" },
});
process.exit(result.status ?? 1);
