import {
  ExternalLookup,
  ExternalSessionInfo,
  externalLookup,
  externalSessionInfo,
} from './dto';

describe('externalSessionInfo', () => {
  it('should parse valid input and throw on bad one', async () => {
    const sessionInfo: ExternalSessionInfo = {
      userId: 1,
      system: 'RSM',
      orgId: [2],
    };

    const badSessionInfo = {
      userId: 1,
      system: 'Unknown',
      orgId: 2,
    };

    const goodResult = externalSessionInfo.safeParse(sessionInfo);
    const badResult = externalSessionInfo.safeParse(badSessionInfo);
    expect(goodResult.success && goodResult.data.userId).toEqual(1);
    expect(badResult.success).toEqual(false);
  });
});

describe('externalLookup', () => {
  it('should correctly fill object with defaults', async () => {
    const data1: ExternalLookup = { userId: 1 };
    const data2: ExternalLookup = { system: 'RSM' };

    const result1 = externalLookup.safeParse(data1);
    expect(result1.success && result1.data).toEqual({
      system: 'EDO',
      userId: 1,
      orgId: null,
    });
    const result2 = externalLookup.safeParse(data2);
    expect(result2.success && result2.data).toEqual({
      system: 'RSM',
      userId: null,
      orgId: 0,
    });
  });
});
