/**
 * Procedural Problem Generators: Number Theory
 */
const NumberTheoryGenerators = {
  // 1. Chinese Remainder Theorem System
  generateCRTProblem(rng) {
    const m1 = rng.choice([3, 5, 7]);
    let m2 = rng.choice([4, 11, 13]);
    while (MathValidator.gcd(m1, m2) !== 1) m2 = rng.nextInt(4, 13);
    
    const M = m1 * m2;
    const targetN = rng.nextInt(1, M - 1);
    
    const a1 = targetN % m1;
    const a2 = targetN % m2;

    const question = `Find the smallest positive integer $n$ satisfying the system of congruences:
$$n \\equiv ${a1} \\pmod{${m1}}$$
$$n \\equiv ${a2} \\pmod{${m2}}$$`;

    const M1 = M / m1; // = m2
    const M2 = M / m2; // = m1

    const y1 = MathValidator.modInverse(M1, m1);
    const y2 = MathValidator.modInverse(M2, m2);

    const solution = `**Step 1:** Compute the product of coprime moduli $M = ${m1} \\times ${m2} = ${M}$.

**Step 2:** Determine $M_i = M / m_i$:
* $M_1 = ${M1}$
* $M_2 = ${M2}$

**Step 3:** Calculate modular inverses $y_i$ where $M_i y_i \\equiv 1 \\pmod{m_i}$:
* $M_1 y_1 \\equiv ${M1} y_1 \\equiv 1 \\pmod{${m1}} \\implies y_1 = ${y1}$
* $M_2 y_2 \\equiv ${M2} y_2 \\equiv 1 \\pmod{${m2}} \\implies y_2 = ${y2}$

**Step 4:** Construct solution $n \\equiv a_1 M_1 y_1 + a_2 M_2 y_2 \\pmod M$:
$$n \\equiv (${a1})(${M1})(${y1}) + (${a2})(${M2})(${y2}) \\pmod{${M}}$$
$$n \\equiv ${a1 * M1 * y1} + ${a2 * M2 * y2} = ${a1 * M1 * y1 + a2 * M2 * y2} \\equiv ${targetN} \\pmod{${M}}$$

Smallest positive integer $n = ${targetN}$.`;

    return {
      id: `nt-crt-${m1}-${m2}-${targetN}`,
      topic: "numberTheory",
      subtopic: "Chinese Remainder Theorem",
      minDifficulty: 7.0,
      maxDifficulty: 8.5,
      signature: `crt_${m1}_${m2}_${targetN}`,
      question,
      answer: String(targetN),
      solution,
      answerType: "integer"
    };
  },

  // 2. Euler Totient Function Calculation
  generateEulerTotient(rng) {
    const p1 = rng.choice([3, 5, 7, 11]);
    let p2 = rng.choice([5, 7, 13, 17]);
    while (p1 === p2) p2 = rng.choice([5, 7, 13, 17]);

    const N = p1 * p2;
    const ans = MathValidator.phi(N);

    const question = `Calculate Euler's totient function value $\\phi(${N})$, which counts positive integers up to $${N}$ that are coprime to $${N}$.`;

    const solution = `**Step 1:** Factorize $${N}$ into prime factors:
$$${N} = ${p1} \\times ${p2}$$

**Step 2:** Apply Euler's product formula $\\phi(n) = n \\prod_{p \\mid n}\\left(1 - \\frac{1}{p}\\right)$:
$$\\phi(${N}) = ${N} \\left(1 - \\frac{1}{${p1}}\\right)\\left(1 - \\frac{1}{${p2}}\\right)$$
$$\\phi(${N}) = (${p1} - 1) \\times (${p2} - 1) = ${p1 - 1} \\times ${p2 - 1} = ${ans}$$`;

    return {
      id: `nt-totient-${N}`,
      topic: "numberTheory",
      subtopic: "Euler's Totient Function",
      minDifficulty: 4.0,
      maxDifficulty: 5.5,
      signature: `totient_${N}`,
      question,
      answer: String(ans),
      solution,
      answerType: "integer"
    };
  },

  // 3. Modular Exponentiation via Fermat's Little Theorem
  generateModularExponentiation(rng) {
    const p = rng.choice([13, 17, 19, 23]);
    const base = rng.nextInt(2, p - 1);
    const exp = rng.nextInt(100, 500);

    // Fermat's Little Theorem: base^(p-1) = 1 mod p
    const reducedExp = exp % (p - 1);
    
    // Compute base^reducedExp % p
    let ans = 1;
    let b = base % p;
    let e = reducedExp;
    while (e > 0) {
      if (e % 2 === 1) ans = (ans * b) % p;
      b = (b * b) % p;
      e = Math.floor(e / 2);
    }

    const question = `Compute the remainder when $${base}^{${exp}}$ is divided by the prime $p = ${p}$.`;

    const solution = `**Step 1:** Apply Fermat's Little Theorem since $p = ${p}$ is prime and $\\gcd(${base}, ${p}) = 1$:
$$${base}^{${p - 1}} \\equiv 1 \\pmod{${p}}$$

**Step 2:** Reduce the exponent modulo $p - 1 = ${p - 1}$:
$$${exp} = ${Math.floor(exp / (p - 1))} \\times ${p - 1} + ${reducedExp} \\implies ${exp} \\equiv ${reducedExp} \\pmod{${p - 1}}$$

**Step 3:** Evaluate $${base}^{${reducedExp}} \\pmod{${p}}$:
$$${base}^{${exp}} \\equiv ${base}^{${reducedExp}} \\equiv ${ans} \\pmod{${p}}$$`;

    return {
      id: `nt-modexp-${base}-${exp}-${p}`,
      topic: "numberTheory",
      subtopic: "Modular Exponentiation",
      minDifficulty: 6.0,
      maxDifficulty: 7.5,
      signature: `mod_exp_${base}_${exp}_${p}`,
      question,
      answer: String(ans),
      solution,
      answerType: "integer"
    };
  }
};

window.NumberTheoryGenerators = NumberTheoryGenerators;
