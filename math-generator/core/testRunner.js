/**
 * Developer Quality Control & Stress Testing Suite
 * Run in console: runGeneratorTests(100)
 */
function runGeneratorTests(iterationsPerGenerator = 50) {
  console.log(`%c[Srijan Maths QA Engine] Starting Stress Test (${iterationsPerGenerator} iterations)...`, "color: #0284c7; font-weight: bold;");

  const rng = new RandomService("qa-test-seed");
  const report = [];

  for (const [topicKey, list] of Object.entries(PROBLEM_GENERATORS)) {
    list.forEach((genFunc, idx) => {
      let passed = 0;
      let failed = 0;
      const errors = [];

      for (let i = 0; i < iterationsPerGenerator; i++) {
        try {
          const prob = genFunc(rng);
          
          if (!prob.id || !prob.question || !prob.answer || !prob.solution) {
            throw new Error("Missing mandatory field in return payload.");
          }
          if (isNaN(parseFloat(prob.answer)) && prob.answerType === "integer") {
            throw new Error(`Invalid non-numeric answer: "${prob.answer}"`);
          }

          passed++;
        } catch (err) {
          failed++;
          errors.push(err.message);
        }
      }

      report.push({
        topic: topicKey,
        generatorIdx: idx,
        passed,
        failed,
        errorSample: errors[0] || "None"
      });
    });
  }

  console.table(report);
  return report;
}

window.runGeneratorTests = runGeneratorTests;
