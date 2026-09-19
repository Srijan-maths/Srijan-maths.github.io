/**
 * Procedural Problem Generators: Algebra
 */
const AlgebraGenerators = {
  // 1. Symmetric Polynomial Evaluation (x + 1/x = k => x^5 + 1/x^5)
  generateSymmetricPolynomial(rng) {
    const k = rng.nextInt(3, 8);
    
    // Mathematics:
    // S1 = x + 1/x = k
    // S2 = x^2 + 1/x^2 = k^2 - 2
    // S3 = x^3 + 1/x^3 = k(k^2 - 3)
    // S5 = (x^2 + 1/x^2)(x^3 + 1/x^3) - (x + 1/x)
    const s2 = k * k - 2;
    const s3 = k * (k * k - 3);
    const ans = s2 * s3 - k;

    const question = `If real number $x$ satisfies $x + \\frac{1}{x} = ${k}$, evaluate the exact value of:
$$x^5 + \\frac{1}{x^5}$$`;

    const solution = `**Step 1:** Compute $x^2 + \\frac{1}{x^2}$ using the identity $(x + \\frac{1}{x})^2 - 2$:
$$x^2 + \\frac{1}{x^2} = ${k}^2 - 2 = ${s2}$$

**Step 2:** Compute $x^3 + \\frac{1}{x^3}$ using the identity $(x + \\frac{1}{x})(x^2 + \\frac{1}{x^2} - 1)$:
$$x^3 + \\frac{1}{x^3} = ${k} \\cdot (${s2} - 1) = ${k} \\cdot ${s2 - 1} = ${s3}$$

**Step 3:** Multiply $x^2 + \\frac{1}{x^2}$ and $x^3 + \\frac{1}{x^3}$:
$$\\left(x^2 + \\frac{1}{x^2}\\right)\\left(x^3 + \\frac{1}{x^3}\\right) = x^5 + \\frac{1}{x^5} + x + \\frac{1}{x}$$

**Step 4:** Substitute known values to isolate $x^5 + \\frac{1}{x^5}$:
$$x^5 + \\frac{1}{x^5} = (${s2})(${s3}) - ${k} = ${s2 * s3} - ${k} = ${ans}$$`;

    return {
      id: `alg-sym-${k}-${Date.now()}`,
      topic: "algebra",
      subtopic: "Symmetric Polynomials",
      minDifficulty: 5.0,
      maxDifficulty: 6.5,
      signature: `sym_poly_${k}`,
      question,
      answer: String(ans),
      solution,
      answerType: "integer"
    };
  },

  // 2. Vieta's Formula Sum of Cubes
  generateVietaSumOfCubes(rng) {
    const p = rng.nextInt(2, 6);
    const q = rng.nextInt(-5, 5);
    const r = rng.nextInt(1, 8);

    // Equation: x^3 - p x^2 + q x - r = 0
    // Roots r1, r2, r3: e1 = p, e2 = q, e3 = r
    // Newton's sums:
    // s1 = e1 = p
    // s2 = e1*s1 - 2*e2 = p^2 - 2q
    // s3 = e1*s2 - e2*s1 + 3*e3 = p(p^2 - 2q) - q*p + 3r = p^3 - 3pq + 3r
    const s1 = p;
    const s2 = p * p - 2 * q;
    const s3 = p * p * p - 3 * p * q + 3 * r;

    const qSign = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
    const polyStr = `x^3 - ${p}x^2 ${qSign}x - ${r} = 0`;

    const question = `Let $r_1, r_2, r_3$ be the roots of the cubic equation:
$$${polyStr}$$
Find the value of $r_1^3 + r_2^3 + r_3^3$.`;

    const solution = `**Step 1:** Apply Vieta's formulas to identify elementary symmetric polynomials:
$$e_1 = r_1 + r_2 + r_3 = ${p}$$
$$e_2 = r_1 r_2 + r_2 r_3 + r_3 r_1 = ${q}$$
$$e_3 = r_1 r_2 r_3 = ${r}$$

**Step 2:** Express power sums $s_k = r_1^k + r_2^k + r_3^k$ using Newton's Sum Identities:
$$s_1 = e_1 = ${s1}$$
$$s_2 = e_1 s_1 - 2e_2 = (${p})(${s1}) - 2(${q}) = ${s2}$$

**Step 3:** Compute $s_3$:
$$s_3 = e_1 s_2 - e_2 s_1 + 3e_3$$
$$s_3 = (${p})(${s2}) - (${q})(${s1}) + 3(${r}) = ${s3}$$`;

    return {
      id: `alg-vieta-${p}-${q}-${r}`,
      topic: "algebra",
      subtopic: "Vieta's Relations",
      minDifficulty: 6.5,
      maxDifficulty: 8.0,
      signature: `vieta_cubes_${p}_${q}_${r}`,
      question,
      answer: String(s3),
      solution,
      answerType: "integer"
    };
  },

  // 3. Second Order Homogeneous Linear Recurrence
  generateLinearRecurrence(rng) {
    const a0 = rng.nextInt(1, 4);
    const a1 = rng.nextInt(3, 7);
    const A = rng.nextInt(1, 3);
    const B = rng.nextInt(1, 4);
    const N = rng.nextInt(6, 9);

    // Compute terms sequentially
    const terms = [a0, a1];
    for (let i = 2; i <= N; i++) {
      terms[i] = A * terms[i - 1] + B * terms[i - 2];
    }

    const question = `A sequence $a_n$ is defined by $a_0 = ${a0}$, $a_1 = ${a1}$, and the recurrence relation:
$$a_{n} = ${A}a_{n-1} + ${B}a_{n-2} \\quad \\text{for } n \\ge 2$$
Calculate the term $a_{${N}}$.`;

    let steps = `**Step 1:** Iteratively evaluate recurrence terms up to $n = ${N}$:\n`;
    for (let i = 2; i <= N; i++) {
      steps += `* $a_{${i}} = ${A}(${terms[i-1]}) + ${B}(${terms[i-2]}) = ${terms[i]}$\n`;
    }
    steps += `\nThus, $a_{${N}} = ${terms[N]}$.`;

    return {
      id: `alg-rec-${a0}-${a1}-${A}-${B}-${N}`,
      topic: "algebra",
      subtopic: "Recurrences & Sequences",
      minDifficulty: 4.5,
      maxDifficulty: 6.0,
      signature: `lin_rec_${a0}_${a1}_${A}_${B}_${N}`,
      question,
      answer: String(terms[N]),
      solution: steps,
      answerType: "integer"
    };
  }
};

window.AlgebraGenerators = AlgebraGenerators;
