import {
  authRequestDto,
  EdoCredentials,
  externalCredentials,
  findSessionDto,
  FindSessionDto,
  RsmCredentials,
} from './dto';
describe('externalCredentials', () => {
  it('should distinguish between EDO and RSM credentials, coerce and provide defaults', async () => {
    const rsmData: RsmCredentials = {
      system: 'RSM',
      login: 'test',
      password: 'test',
    };
    const edoData: EdoCredentials = {
      system: 'EDO',
      login: 123,
      password: 'test',
    };
    const rsmResult = externalCredentials.safeParse(rsmData);
    const edoResult = externalCredentials.safeParse(edoData);
    expect(rsmResult.success && rsmResult.data.login).toEqual('test');
    expect(rsmResult.success && rsmResult.data.groupid).toBeUndefined();
    expect(edoResult.success && edoResult.data.login).toEqual('123');
    expect(edoResult.success && edoResult.data.groupid).toEqual(21);
  });
  it('should throw on bad input', async () => {
    const rsmResult = externalCredentials.safeParse({
      system: 'RSM',
      login: 123,
      password: 'test',
      grouppid: 1,
    });
    const edoResult = externalCredentials.safeParse({
      system: 'EDO',
      login: 'notANumber',
      password: 'test',
    });
    expect(rsmResult.success).toEqual(false);
    expect(edoResult.success).toEqual(false);
  });
});

describe('findSessionDto', () => {
  it('should correctly parse a full and valid session lookup object', async () => {
    const data: FindSessionDto = { system: 'RSM', userId: 1, orgId: 10 };
    const dto = findSessionDto.safeParse(data);
    expect(dto.success && dto.data).toEqual(data);
  });
  it('should accept empty or partial object and add default values', async () => {
    const data: FindSessionDto = {};
    const dto = findSessionDto.safeParse(data);
    expect(dto.success && dto.data).toEqual({
      system: 'EDO',
      userId: null,
      orgId: 0,
    });
  });
  it('should throw on invalid object', async () => {
    const data = { system: 'Fake' };
    const result = findSessionDto.safeParse(data);
    expect(result.success).toEqual(false);
  });

  describe('authRequestDto', () => {
    it('should correctly parse server credentials request', async () => {
      const dto = authRequestDto.safeParse({
        system: 'EDO',
        userId: 1,
      });
      expect(dto.success && dto.data).toEqual({
        system: 'EDO',
        userId: 1,
        orgId: null,
        refresh: false,
      });
    });
  });
  it('should correctly parse client credentials request', async () => {
    const dto = authRequestDto.safeParse({
      system: 'EDO',
      userId: 1,
      login: 123,
      password: 'test',
    });
    expect(dto.success && dto.data).toEqual({
      system: 'EDO',
      userId: 1,
      login: '123',
      password: 'test',
      orgId: null,
      groupid: 21,
    });
  });
});
