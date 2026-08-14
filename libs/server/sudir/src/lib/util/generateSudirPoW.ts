import { createHash } from 'crypto';

export function generateSudirPoW(input: string): string {
  const alphabet =
    '0123456789/+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const alphabetCodes = Buffer.from(alphabet, 'ascii');
  const BASE = alphabet.length;

  // FIX: Extract the full prefix (everything up to and including the trailing colon)
  const prefix = input.slice(0, input.lastIndexOf(':') + 1);

  // Parse difficulty from the second segment
  const parts = input.split(':'); // Re-split or keep a reference
  const bits = parseInt(parts[1], 10);

  if (bits === 0) return prefix;

  const fullBytes = Math.floor(bits / 8);
  const remainderBits = bits % 8;

  const prefixBuf = Buffer.from(prefix, 'utf8');
  const prefixLen = prefixBuf.length;
  const maxDigits = Math.max(1, Math.ceil(bits / 6));

  const fullBuf = Buffer.alloc(prefixLen + maxDigits);
  prefixBuf.copy(fullBuf, 0);

  // Use the full prefix for the base hash state
  const baseHash = createHash('sha1').update(prefixBuf);
  const zeroBuf = Buffer.alloc(fullBytes);

  const counter = new Uint8Array(maxDigits);
  let counterLen = 1;

  while (true) {
    // Write counter digits (most‑significant first)
    for (let i = 0; i < counterLen; i++) {
      fullBuf[prefixLen + i] = alphabetCodes[counter[counterLen - 1 - i]];
    }

    const hash = baseHash.copy();
    hash.update(fullBuf.subarray(prefixLen, prefixLen + counterLen));
    const digest = hash.digest();

    // Check leading zeros
    if (
      fullBytes === 0 ||
      digest.compare(zeroBuf, 0, fullBytes, 0, fullBytes) === 0
    ) {
      if (
        remainderBits === 0 ||
        digest[fullBytes] >> (8 - remainderBits) === 0
      ) {
        // Return the full prefix + the found solution
        return fullBuf.toString('utf8', 0, prefixLen + counterLen);
      }
    }

    // Increment base‑64 counter (least‑significant first)
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
}
