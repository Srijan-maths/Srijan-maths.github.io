/**
 * Difficulty Estimation & Adaptive Adjustment Engine
 */
class DifficultyEngine {
  /**
   * Adaptive algorithm based on exponentially weighted moving average
   * @param {number} currentDifficulty Current paper difficulty [1.0 - 10.0]
   * @param {Array<boolean>} history Recent response correctness (true/false)
   * @param {boolean} lastCorrect Answer status of immediate past problem
   */
  static calculateNextDifficulty(currentDifficulty, history = [], lastCorrect) {
    let delta = 0;

    if (lastCorrect) {
      delta = 0.35;
      // Bonus increment if on a streak
      const streak = this._getConsecutiveCount(history, true);
      if (streak >= 3) delta += 0.15;
    } else {
      delta = -0.30;
      // Extra decrease on multiple failures
      const failStreak = this._getConsecutiveCount(history, false);
      if (failStreak >= 2) delta -= 0.15;
    }

    const newDiff = Math.max(1.0, Math.min(10.0, currentDifficulty + delta));
    return parseFloat(newDiff.toFixed(2));
  }

  static _getConsecutiveCount(history, targetStatus) {
    let count = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i] === targetStatus) count++;
      else break;
    }
    return count;
  }

  /**
   * Generates a realistic target curve for Mock Tests based on exam duration
   */
  static generateMockCurve(totalQuestions) {
    const curve = [];
    for (let i = 0; i < totalQuestions; i++) {
      const progress = i / (totalQuestions - 1 || 1);
      let diff = 3.5 + progress * 5.5; // Scale from 3.5 to 9.0 linearly with slight variation
      
      // Inject realistic periodic variation (oscillating difficulty peaks)
      const wave = Math.sin(progress * Math.PI * 3) * 0.5;
      diff = Math.max(2.0, Math.min(9.8, diff + wave));
      curve.push(parseFloat(diff.toFixed(1)));
    }
    return curve;
  }
}

window.DifficultyEngine = DifficultyEngine;
