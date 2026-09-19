/**
 * Centralized Syllabus Taxonomy
 */
const SYLLABUS_DATA = {
  algebra: {
    id: "algebra",
    title: "Algebra & Analysis",
    subtopics: [
      "Symmetric Polynomials",
      "Vieta's Relations",
      "Recurrences & Sequences",
      "Quadratic Parameters",
      "Polynomial Remainder Theorem"
    ]
  },
  numberTheory: {
    id: "numberTheory",
    title: "Number Theory",
    subtopics: [
      "Modular Exponentiation",
      "Chinese Remainder Theorem",
      "Linear Diophantine Equations",
      "Euler's Totient Function",
      "Divisor Functions"
    ]
  },
  combinatorics: {
    id: "combinatorics",
    title: "Combinatorics",
    subtopics: [
      "Inclusion-Exclusion Principle",
      "Stars and Bars",
      "Derangements",
      "Pigeonhole Principle"
    ]
  },
  inequalities: {
    id: "inequalities",
    title: "Inequalities & Optimization",
    subtopics: [
      "AM-GM Inequality",
      "Cauchy-Schwarz Inequality"
    ]
  }
};

window.SYLLABUS_DATA = SYLLABUS_DATA;
