/**
 * Runs every unit test module in order. Start with `pnpm test` (Payload's runner gives TS, `@/` aliases and the DB).
 * A failed assertion throws, which ends the run with a non-zero exit code.
 */
const modules = ['./signedValue.test', './access.test', './demoAccount.test', './shopSession.test', './account.test', './demoLogin.test', './search.test', './hardening.test']

for (const name of modules) {
  await import(name)
  console.log(`ok ${name}`)
}

process.exit(0)

export {}
