/**
 * Procedural Problem Generators: Combinatorics
 */
const CombinatoricsGenerators = {
  // 1. Derangements (!n)
  generateDerangements(rng) {
    const n = rng.nextInt(4, 7);

    // Calculate !n
    const subfact = (k) => {
      if (k === 0) return 1;
      if (k === 1) return 0;
      let a = 1, b = 0, c = 0;
      for (let i = 2; i <= k; i++) {
        c = (i - 1) * (a + b);
        a = b;
        b = c;
      }
      return c;
    };

    const ans = subfact(n);

    const question = `Find the number of derangements $!${n}$ of a set of $${n}$ distinct items (permutations where no element appears in its original position).`;

    const solution = `**Step 1:** Apply the Inclusion-Exclusion formula for derangements $!n$:
$$!n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!}$$

**Step 2:** Evaluate the terms for $n = ${n}$:
$$!${n} = ${n}! \\left( 1 - 1 + \\frac{1}{2!} - \\frac{1}{3!} + \\dots + \\frac{(-1)^{${n}}}{${n}!} \\right)$$

**Step 3:** Using the recurrence relation $!n = (n-1)(!(n-1) + !(n-2))$ yields:
$$!${n} = ${ans}$$`;

    return {
      id: `comb-derange-${n}`,
      topic: "combinatorics",
      subtopic: "Derangements",
      minDifficulty: 5.5,
      maxDifficulty: 7.0,
      signature: `derangement_${n}`,
      question,
      answer: String(ans),
      solution,
      answerType: "integer"
    };
  },

  // 2. Stars and Bars (Positive Integer Solutions)
  generateStarsAndBars(rng) {
    const S = rng.nextInt(12, 25);
    const k = rng.nextInt(3, 5);

    // Equation: x1 + x2 + ... + xk = S, where xi >= 1
    // Equivalent to choosing k-1 dividers from S-1 spaces: C(S-1, k-1)
    const nChooseK = (n, r) => {
      if (r < 0 || r > n) return 0;
      if (r === 0 || r === n) return 1;
      let res = 1;
      for (let i = 1; i <= r; i++) {
        res = (res * (n - i + 1)) / i;
      }
      return res;
    };

    const ans = nChooseK(S - 1, k - 1);

    const question = `Determine the number of distinct positive integer solutions $(x_1, x_2, \\dots, x_{${k}})$ satisfying the equation:
$$x_1 + x_2 + \\dots + x_{${k}} = ${S} \\quad \\text{where } x_i \\ge 1$$`;

    const solution = `**Step 1:** Apply the Stars and Bars theorem for positive integer solutions.
For $k = ${k}$ variables summing to $S = ${S}$ with $x_i \\ge 1$, we place $k - 1 = ${k - 1}$ dividers into $S - 1 = ${S - 1}$ available spaces.

**Step 2:** The number of valid tuples is given by the combination formula:
$$\\binom{S - 1}{k - 1} = \\binom{${S - 1}}{${k - 1}}$$

**Step 3:** Calculate:
$$\\binom{${S - 1}}{${k - 1}} = ${ans}$$`;

    return {
      id: `comb-stars-${S}-${k}`,
      topic: "combinatorics",
      subtopic: "Stars and Bars",
      minDifficulty: 5.0,
      maxDifficulty: 6.5,
      signature: `stars_bars_${S}_${k}`,
      question,
      answer: String(ans),
      solution,
      answerType: "integer"
    };
  }
};

window.CombinatoricsGenerators = CombinatoricsGenerators;
