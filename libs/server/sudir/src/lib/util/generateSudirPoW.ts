import { createHash } from 'crypto';

export function generateSudirPoW(input: string): string {
  const alphabet =
    '0123456789/+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const alphabetCodes = Buffer.from(alphabet, 'ascii');
  const BASE = alphabet.length;

  const parts = input.split(':');
  const bits = parseInt(parts[1], 10);
  const prefix = parts[0];

  if (bits === 0) return prefix;

  const fullBytes = Math.floor(bits / 8);
  const remainderBits = bits % 8;

  const prefixBuf = Buffer.from(prefix, 'utf8');
  const prefixLen = prefixBuf.length;
  const maxDigits = 10; // safety limit as in original

  // Pre‑allocate buffer for prefix + counter
  const fullBuf = Buffer.alloc(prefixLen + maxDigits);
  prefixBuf.copy(fullBuf, 0);

  // Counter digits, least‑significant first
  const counter = new Uint8Array(maxDigits);
  let counterLen = 1; // starts as "0"

  while (counterLen <= maxDigits) {
    // Write current counter into the buffer (most‑significant first)
    for (let i = 0; i < counterLen; i++) {
      const digitVal = counter[counterLen - 1 - i];
      fullBuf[prefixLen + i] = alphabetCodes[digitVal];
    }

    const dataView = fullBuf.subarray(0, prefixLen + counterLen);
    const hash = createHash('sha1').update(dataView).digest();

    // Check leading zero bits
    let isValid = true;
    for (let i = 0; i < fullBytes; i++) {
      if (hash[i] !== 0) {
        isValid = false;
        break;
      }
    }
    if (isValid && remainderBits > 0) {
      if (hash[fullBytes] >> (8 - remainderBits) !== 0) {
        isValid = false;
      }
    }

    if (isValid) {
      return fullBuf.toString('utf8', 0, prefixLen + counterLen);
    }

    // Increment counter in base‑64 (least‑significant first)
    let i = 0;
    let carry = 1;
    while (i < counterLen) {
      const val = counter[i] + carry;
      if (val < BASE) {
        counter[i] = val;
        carry = 0;
        break;
      } else {
        counter[i] = 0;
        carry = 1;
        i++;
      }
    }

    if (carry) {
      // Add a new most‑significant digit (set to 1)
      if (counterLen < maxDigits) {
        counter[counterLen] = 1;
        counterLen++;
      } else {
        throw new Error('Proof of work not found (counter overflow)');
      }
    }
  }

  throw new Error('Proof of work not found');
}
