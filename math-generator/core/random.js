/**
 * Seedable Pseudo-Random Number Generator (Mulberry32)
 * Supports reproducible problem generation via seeds while relying on
 * crypto.getRandomValues() for standard practice sessions.
 */
class RandomService {
  constructor(seed = null) {
    this.seed = seed;
    this.useSeed = seed !== null && seed !== undefined;
    if (this.useSeed) {
      this.state = this._hashSeed(seed);
    }
  }

  _hashSeed(seed) {
    let h = 2166136261 ^ 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    }
    return h >>> 0;
  }

  // Returns float in [0, 1)
  next() {
    if (this.useSeed) {
      let t = (this.state += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    } else {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] / 4294967296;
    }
  }

  // Integer in range [min, max] inclusive
  nextInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Select random element from array
  choice(array) {
    if (!array || array.length === 0) return null;
    return array[this.nextInt(0, array.length - 1)];
  }

  // Shuffle array in-place (Fisher-Yates)
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

window.RandomService = RandomService;
