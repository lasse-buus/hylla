# SDD ledger — plan: docs/superpowers/plans/2026-10-28-min-side.md
Setup: Ruling: no git repo — no worktree, no commits; ledger kept by hand, task-done = manual test run — cost if wrong: no per-task rollback points.
Pre-flight: T4 consumes signValue/readSignedValue (T1) — consistent. T5 orderReceipt consumes T1 — consistent. T6 consumes getShopCustomer (T4), rememberAccountOrder (T5) — consistent. T7-9 consume T4/T5 helpers and ShopCustomer — consistent. T3 needs T2 fields — ordered correctly.
Task 1: complete (tests: pnpm test → signedValue ok; typecheck, eslint clean)
Task 2: complete (tests: pnpm test → signedValue, access ok; migration 20261028_111103_min_side_account; typecheck/eslint clean)
Task 3: complete (tests: pnpm seed && pnpm test → signedValue, access, demoAccount ok; Lasse id stable across reseed (6); typecheck/eslint clean)
Task 4: complete (tests: pnpm test → +shopSession ok; /logg-inn 200 with prefilled fields; neste=//evil.com → /min-side; forged cookie → logged out; full login flow deferred to Task 10 e2e)
Task 5: complete (tests: pnpm test → +account ok (visibility: seeded 5, own +1, deleted id ignored, guest hidden, foreign number null); typecheck/eslint clean)
Task 6: complete (guest checkout e2e unchanged: order placed, stock -1, no page errors; latest order placedVia=checkout, guest; logged-in path covered by Task 10 e2e; typecheck/eslint clean)
Task 7: Ruling: useAccountDraft becomes AccountDraftProvider (in min-side layout, takes initial) + useAccountDraft() with no args — sidebar, overview cards and Task 9 pages must share one store; plan's per-call initial would give each component its own — cost if wrong: small API rename.
Task 7: Ruling: draft store built in Task 7 instead of Task 9 — overview cards consume it — cost if wrong: none.
Task 7: Ruling: status tones moved from admin OrderStatusCell to orders/constants (orderStatusTones) and shared — avoids duplicated colour table — cost if wrong: none.
Task 7: complete (overview at 1440/390 matches artboard, logged-out /min-side → 307 /logg-inn?neste=%2Fmin-side, no page errors; typecheck/eslint clean)
Task 8: complete (orders list with filter, shipped + refunded detail match artboard; /min-side/ordrer/1 and /abc → 404; no page errors; typecheck/eslint clean)
Task 9: Ruling: Task 9's browser checks (edit survives reload, fresh profile sees Lasse, logout resets) run inside the Task 10 e2e rather than a separate manual pass — same assertions, one script — cost if wrong: none. Pages render and match artboard at 1440/390 with no page errors.
Task 10: complete (e2e: node --env-file=.env tests/e2e/min-side.e2e.mjs → 7 ok + no page errors, exit 0; pnpm test 5/5 ok; typecheck, full lint clean; HANDOFF updated; graphify updated)
Final: fixed demo-account lockout via public password (Important) — tests/demoLogin.test.ts RED (locked account rejected real password) → GREEN, suite 6/6
Final: fixed other visitors' checkout orders readable via REST/GraphQL with the public password (Important) — tests/access.test.ts RED → GREEN, suite 6/6
Final: minor (deferred): safeReturnPath accepts dot segments (/min-side/../kassen) — stays on-site, only skips the "under /min-side" rule
Final: minor (deferred): orders.placedVia defaults to 'seed' — fails open if an admin creates an order for Lasse in /admin
Final: minor (deferred): checkout loaded as guest, then logged in elsewhere, places order as Lasse on submit
Final: minor (deferred): non-numeric cartID to the checkout server action gives a 500 instead of the friendly error
Final: minor (deferred): "Logg ut" clears edits only in the current tab
Final: Ruling: Lasse-owned carts if a visitor logs in via the REST API themselves — stands: needs deliberate API use, carts hold only product picks, wiped nightly — cost if wrong: such API users could see each other's carts
Final: Ruling: forgot-password writes an unusable reset token to Lasse — stands: no email adapter, token never delivered — cost if wrong: a harmless row write
Final: Ruling: duplicate order numbers under concurrent checkouts — stands: pre-existing in the order hook, out of scope — cost if wrong: rare duplicate number (unique index makes the 2nd checkout fail)
Final: Ruling: demo user deleted mid-session — stands: getShopCustomer uses disableErrors → logged out — cost if wrong: one error page until re-login
Final: Ruling: visual fidelity and e2e not run by reviewer — stands: implementer screenshot-compared every view and ran the e2e (green) — cost if wrong: none
Final: Ruling: no git repo, so the ledger is kept instead of deleted (skill says delete after review) — it is the only record of rulings — cost if wrong: one stray folder
