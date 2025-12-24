import { createHash } from 'crypto';

export function generateSudirPoW(input: string) {
  const alphabet =
    '0123456789/+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const parts = input.split(':');
  const bits = parseInt(parts[1]);
  const prefix = input;

  // Calculate mask for remaining bits
  const fullBytes = Math.floor(bits / 8);
  const remainderBits = bits % 8;
  let mask = 0;
  for (let t = 1; t <= remainderBits; t++) {
    mask |= 1 << (8 - t);
  }

  // Counter initialization and increment logic
  let counter = [0];
  const maxCounterLength = 10; // Safety limit to prevent infinite loops

  while (counter.length <= maxCounterLength) {
    // Convert counter to string
    const counterStr = counter.map((idx) => alphabet[idx]).join('');
    const fullStr = prefix + counterStr;

    // Compute SHA-1 hash
    const hash = createHash('sha1').update(fullStr).digest();

    // Check leading zero bits
    let isValid = true;

    // Check full zero bytes
    for (let i = 0; i < fullBytes; i++) {
      if (hash[i] !== 0) {
        isValid = false;
        break;
      }
    }

    // Check remaining bits using mask
    if (isValid && remainderBits > 0) {
      if ((hash[fullBytes] & mask) !== 0) {
        isValid = false;
      }
    }

    // Return if valid
    if (isValid) {
      return fullStr;
    }

    // Increment counter (base-64 increment)
    let carry = 1;
    for (let i = counter.length - 1; i >= 0; i--) {
      counter[i] += carry;
      if (counter[i] < alphabet.length) {
        carry = 0;
        break;
      }
      counter[i] = 0;
      carry = 1;
    }

    // Add new digit if needed
    if (carry) {
      counter = new Array(counter.length + 1).fill(0);
    }
  }

  throw new Error('Proof of work not found');
}
