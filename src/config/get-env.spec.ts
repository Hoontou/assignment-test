import { getEnv } from './get-env';

interface TstEnv {
  STRING_ENV: string;
  NUMBER_ENV: string;
  NAN_ENV: string;
}

//env mocking
jest.mock('./get-env', () => {
  process.env = {
    STRING_ENV: 'tst',
    NUMBER_ENV: '1234',
    NAN_ENV: '123tst',
  };
  return jest.requireActual('./get-env');
});

describe('get env test', () => {
  it('should return STRING_ENV', () => {
    const value = getEnv<TstEnv>('STRING_ENV');
    expect(value).toBe('tst');
  });

  it('should return NUMBER_ENV as number', () => {
    const value = getEnv<TstEnv>('NUMBER_ENV', true);
    expect(value).toBe(1234);
  });

  it('should throw TypeError, means cannot cast to number', () => {
    expect(() => getEnv<TstEnv>('NAN_ENV', true)).toThrow(TypeError);
  });

  it('should throw error if target undefined', () => {
    expect(() => getEnv<TstEnv>('UNDEFINED_ENV' as keyof TstEnv)).toThrow();
  });
});
