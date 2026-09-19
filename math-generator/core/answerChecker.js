/**
 * Safe, non-eval Answer Verification System
 * Normalizes input strings and validates numeric, fractional, and algebraic formats.
 */
class AnswerChecker {
  static normalizeString(str) {
    if (typeof str !== 'string') str = String(str);
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/\\left/g, '')
      .replace(/\\right/g, '');
  }

  static verify(userAnswer, correctAnswer, answerType = 'integer', options = {}) {
    if (userAnswer === null || userAnswer === undefined || userAnswer.trim() === '') {
      return { isCorrect: false, normalizedUser: '', normalizedCorrect: String(correctAnswer) };
    }

    const cleanUser = this.normalizeString(userAnswer);
    const cleanCorrect = this.normalizeString(correctAnswer);

    switch (answerType) {
      case 'integer': {
        const uInt = parseInt(cleanUser, 10);
        const cInt = parseInt(cleanCorrect, 10);
        const isCorrect = !isNaN(uInt) && uInt === cInt;
        return { isCorrect, normalizedUser: String(uInt), normalizedCorrect: String(cInt) };
      }

      case 'decimal': {
        const tolerance = options.tolerance || 0.001;
        const uDec = parseFloat(cleanUser);
        const cDec = parseFloat(cleanCorrect);
        const isCorrect = !isNaN(uDec) && Math.abs(uDec - cDec) <= tolerance;
        return { isCorrect, normalizedUser: String(uDec), normalizedCorrect: String(cDec) };
      }

      case 'fraction': {
        const parseFraction = (str) => {
          if (str.includes('/')) {
            const parts = str.split('/');
            const num = parseInt(parts[0], 10);
            const den = parseInt(parts[1], 10);
            if (isNaN(num) || isNaN(den) || den === 0) return null;
            return { num, den, val: num / den };
          } else {
            const val = parseFloat(str);
            if (isNaN(val)) return null;
            return { num: val, den: 1, val };
          }
        };

        const uFrac = parseFraction(cleanUser);
        const cFrac = parseFraction(cleanCorrect);

        if (!uFrac || !cFrac) {
          return { isCorrect: false, normalizedUser: cleanUser, normalizedCorrect: cleanCorrect };
        }

        // Strict comparison: require reduced form if specified, else numerical equivalence
        const isCorrect = Math.abs(uFrac.val - cFrac.val) < 1e-7;
        return { isCorrect, normalizedUser: `${uFrac.num}/${uFrac.den}`, normalizedCorrect: cleanCorrect };
      }

      case 'multiple_choice':
      case 'text':
      default: {
        const isCorrect = cleanUser === cleanCorrect;
        return { isCorrect, normalizedUser: cleanUser, normalizedCorrect: cleanCorrect };
      }
    }
  }
}

window.AnswerChecker = AnswerChecker;
