/**
 * Procedural Problem Generators: Inequalities & Optimization
 */
const InequalityGenerators = {
  // 1. Cauchy-Schwarz Application
  generateCauchySchwarz(rng) {
    const a = rng.nextInt(1, 4);
    const b = rng.nextInt(1, 4);
    const c = rng.nextInt(1, 4);
    const K = rng.nextInt(10, 30);

    // Problem: Given a*x + b*y + c*z = K for x,y,z > 0.
    // Minimize (a^2/x + b^2/y + c^2/z)
    // By Cauchy-Schwarz: (x + y + z)(a^2/x + b^2/y + c^2/z) >= (a + b + c)^2
    // Let problem be: x + y + z = K. Find min of (a^2/x + b^2/y + c^2/z)
    
    const sumSqrt = a + b + c;
    const minValNumerator = sumSqrt * sumSqrt;
    
    // We adjust K to be a multiple of sumSqrt to ensure integer minimums
    const scale = rng.nextInt(1, 3);
    const realK = scale * sumSqrt;

    const ans = (minValNumerator * scale) / scale; // = minValNumerator / scale if x+y+z=realK...
    // Let's formulate precisely:
    // Given x + y + z = realK, min value of a^2/x + b^2/y + c^2/z is (a+b+c)^2 / realK.
    // To ensure integer answer, set realK = scale, so (a+b+c)^2 / realK is integer.
    
    const num = sumSqrt * sumSqrt;
    let actualK = realK;
    while (num % actualK !== 0) {
      actualK--;
    }
    const exactAns = num / actualK;

    const question = `Let $x, y, z$ be positive real numbers such that $x + y + z = ${actualK}$. Find the minimum possible value of:
$$\\frac{${a * a}}{x} + \\frac{${b * b}}{y} + \\frac{${c * c}}{z}$$`;

    const solution = `**Step 1:** Apply the Cauchy-Schwarz Inequality in Engel Form (Sedrakyan's Lemma):
$$\\sum_{i=1}^n \\frac{a_i^2}{u_i} \\ge \\frac{(\\sum a_i)^2}{\\sum u_i}$$

**Step 2:** Substitute $a_1 = ${a}, a_2 = ${b}, a_3 = ${c}$ and $u_1 = x, u_2 = y, u_3 = z$:
$$\\frac{${a * a}}{x} + \\frac{${b * b}}{y} + \\frac{${c * c}}{z} \\ge \\frac{(${a} + ${b} + ${c})^2}{x + y + z}$$

**Step 3:** Substitute the given constraint $x + y + z = ${actualK}$:
$$\\text{Minimum} = \\frac{(${sumSqrt})^2}{${actualK}} = \\frac{${num}}{${actualK}} = ${exactAns}$$`;

    return {
      id: `ineq-cs-${a}-${b}-${c}-${actualK}`,
      topic: "inequalities",
      subtopic: "Cauchy-Schwarz Inequality",
      minDifficulty: 7.5,
      maxDifficulty: 9.0,
      signature: `cauchy_${a}_${b}_${c}_${actualK}`,
      question,
      answer: String(exactAns),
      solution,
      answerType: "integer"
    };
  }
};

window.InequalityGenerators = InequalityGenerators;
