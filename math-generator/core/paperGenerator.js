/**
 * Paper Generator Engine for Practice and Mock Modes
 */
class PaperGenerator {
  constructor(rng = new RandomService()) {
    this.rng = rng;
  }

  /**
   * Generates a single problem based on requested topics and difficulty target
   */
  generateProblem(topics, targetDifficulty, existingSignatures = new Set(), maxRetries = 50) {
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      
      const topicKey = this.rng.choice(topics);
      const generators = PROBLEM_GENERATORS[topicKey];

      if (!generators || generators.length === 0) continue;

      const genFunc = this.rng.choice(generators);
      const problem = genFunc(this.rng);

      // Verify difficulty alignment (with +/- 1.5 leeway)
      if (
        targetDifficulty < problem.minDifficulty - 1.5 ||
        targetDifficulty > problem.maxDifficulty + 1.5
      ) {
        continue;
      }

      // Check duplicate signatures
      if (existingSignatures.has(problem.signature)) {
        continue;
      }

      // Mathematical sanity verification
      if (!problem.question || !problem.answer || isNaN(parseFloat(problem.answer))) {
        continue;
      }

      existingSignatures.add(problem.signature);
      return problem;
    }

    // Fallback: relax constraint if generation fails
    const fallbackTopic = this.rng.choice(topics);
    const fallbackGen = this.rng.choice(PROBLEM_GENERATORS[fallbackTopic]);
    return fallbackGen(this.rng);
  }

  /**
   * PRACTICE PAPER GENERATION
   */
  generatePracticePaper(config) {
    const { topics, difficultyMin, difficultyMax, questionCount, seed } = config;
    if (seed) this.rng = new RandomService(seed);

    const questions = [];
    const signatures = new Set();
    const targetDiff = (difficultyMin + difficultyMax) / 2;

    for (let i = 0; i < questionCount; i++) {
      const q = this.generateProblem(topics, targetDiff, signatures);
      questions.push({ ...q, index: i + 1 });
    }

    return {
      paperId: `practice-${Date.now()}`,
      mode: "practice",
      generatedAt: new Date().toISOString(),
      config,
      questions
    };
  }

  /**
   * MOCK TEST GENERATION
   */
  generateMockTest(config) {
    const { topics, durationHours, seed } = config;
    if (seed) this.rng = new RandomService(seed);

    // Calculate question count based on exam length (e.g. 10 questions per hour)
    const questionCount = Math.max(5, Math.round(durationHours * 10));
    const difficultyCurve = DifficultyEngine.generateMockCurve(questionCount);

    const questions = [];
    const signatures = new Set();

    for (let i = 0; i < questionCount; i++) {
      const targetDiff = difficultyCurve[i];
      const q = this.generateProblem(topics, targetDiff, signatures);
      questions.push({
        ...q,
        index: i + 1,
        targetDifficulty: targetDiff
      });
    }

    return {
      paperId: `mock-${Date.now()}`,
      mode: "mock",
      generatedAt: new Date().toISOString(),
      durationSeconds: durationHours * 3600,
      config,
      questions
    };
  }
}

window.PaperGenerator = PaperGenerator;
