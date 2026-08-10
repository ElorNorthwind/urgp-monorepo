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
  const maxDigits = 10;

  // Buffer for the full input (prefix + counter)
  const fullBuf = Buffer.alloc(prefixLen + maxDigits);
  prefixBuf.copy(fullBuf, 0);

  // Pre-compute the SHA1 state for the prefix.
  // On each iteration, we copy this state and only hash the counter bytes.
  const baseHash = createHash('sha1').update(prefixBuf);

  // Pre-allocate a zero-filled buffer for fast leading-byte comparison.
  const zeroBuf = Buffer.alloc(fullBytes);

  // Counter digits stored least-significant first (base-64)
  const counter = new Uint8Array(maxDigits);
  let counterLen = 1; // starts as "0"

  while (counterLen <= maxDigits) {
    // Write the current counter (LSF -> MSF) into the buffer
    for (let i = 0; i < counterLen; i++) {
      const digitVal = counter[counterLen - 1 - i];
      fullBuf[prefixLen + i] = alphabetCodes[digitVal];
    }

    // Hash = SHA1(prefix + counter)
    // Copy the prefix state and update it with ONLY the counter bytes.
    const hash = baseHash.copy();
    hash.update(fullBuf.subarray(prefixLen, prefixLen + counterLen));
    const digest = hash.digest();

    // Check leading zero bits using native C++ comparisons
    let isValid = true;
    if (fullBytes > 0) {
      // compare() in native code is faster than a manual JS loop
      if (digest.compare(zeroBuf, 0, fullBytes, 0, fullBytes) !== 0) {
        isValid = false;
      }
    }
    if (isValid && remainderBits > 0) {
      if (digest[fullBytes] >> (8 - remainderBits) !== 0) {
        isValid = false;
      }
    }

    if (isValid) {
      return fullBuf.toString('utf8', 0, prefixLen + counterLen);
    }

    // Increment the base-64 counter (least-significant first)
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
