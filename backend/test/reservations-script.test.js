const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { openDatabase } = require("../src/db");

test("Podgląd zgłoszeń nie tworzy bazy i nie zmienia istniejących danych", (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "restaurant-view-test-"));
  const filename = path.join(directory, "test.sqlite");
  const script = path.resolve(__dirname, "../scripts/reservations.js");
  const run = (...args) => spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    env: { ...process.env, DATABASE_PATH: filename },
  });
  t.after(() => {
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith("restaurant-view-test-"));
    fs.rmSync(directory, { recursive: true, force: true });
  });

  assert.equal(run().status, 1);
  assert.equal(fs.existsSync(filename), false);

  const db = openDatabase(filename);
  db.prepare(`INSERT INTO reservations
    (customer_name, email, phone, reservation_date, reservation_time, guests)
    VALUES (?, ?, ?, ?, ?, ?)`)
    .run("Jan Testowy", "test@example.com", "123456789", "2027-05-20", "18:30", 2);
  db.close();

  const before = fs.readFileSync(filename);
  const result = run("1");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Jan Testowy/);
  assert.match(result.stdout, /2027-05-20/);
  assert.deepEqual(fs.readFileSync(filename), before);
  assert.equal(run("0").status, 1);
});
