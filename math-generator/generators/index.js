/**
 * Master Registry of Problem Generators
 */
const PROBLEM_GENERATORS = {
  algebra: [
    AlgebraGenerators.generateSymmetricPolynomial,
    AlgebraGenerators.generateVietaSumOfCubes,
    AlgebraGenerators.generateLinearRecurrence
  ],
  numberTheory: [
    NumberTheoryGenerators.generateCRTProblem,
    NumberTheoryGenerators.generateEulerTotient,
    NumberTheoryGenerators.generateModularExponentiation
  ],
  combinatorics: [
    CombinatoricsGenerators.generateDerangements,
    CombinatoricsGenerators.generateStarsAndBars
  ],
  inequalities: [
    InequalityGenerators.generateCauchySchwarz
  ]
};

window.PROBLEM_GENERATORS = PROBLEM_GENERATORS;
