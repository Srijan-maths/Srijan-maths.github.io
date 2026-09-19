/**
 * Mathematical Validation Utilities
 * Ensures generated parameters and solutions satisfy mathematical invariants.
 */
const MathValidator = {
  // Greatest Common Divisor
  gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  },

  // Least Common Multiple
  lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs((a * b) / this.gcd(a, b));
  },

  // Extended Euclidean Algorithm: returns { gcd, x, y } such that a*x + b*y = gcd
  extendedGcd(a, b) {
    if (b === 0) {
      return { gcd: a, x: 1, y: 0 };
    }
    const res = this.extendedGcd(b, a % b);
    const x = res.y;
    const y = res.x - Math.floor(a / b) * res.y;
    return { gcd: res.gcd, x, y };
  },

  // Modular Inverse: returns x such that (a * x) % m === 1
  modInverse(a, m) {
    a = ((a % m) + m) % m;
    const res = this.extendedGcd(a, m);
    if (res.gcd !== 1) return null; // Inverse doesn't exist
    return ((res.x % m) + m) % m;
  },

  // Primality Test
  isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  },

  // Euler's Totient Function phi(n)
  phi(n) {
    let result = n;
    let p = 2;
    let temp = n;
    while (p * p <= temp) {
      if (temp % p === 0) {
        while (temp % p === 0) temp /= p;
        result -= Math.floor(result / p);
      }
      p++;
    }
    if (temp > 1) result -= Math.floor(result / temp);
    return result;
  },

  // Verify non-zero and non-NaN
  isValidNumber(num) {
    return typeof num === 'number' && !isNaN(num) && isFinite(num);
  }
};

window.MathValidator = MathValidator;
