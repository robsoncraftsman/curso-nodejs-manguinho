import { getEnv } from './env-helper';

describe('Env Helper', () => {
  test('Should return ENV variable', () => {
    process.env.TEST = 'HELLO';
    const envValue = getEnv('TEST');
    expect(envValue).toBe('HELLO');
  });

  test("Should return empty string if ENV variable doesn't exists", () => {
    const envValue = getEnv('NOT_EXISTS');
    expect(envValue).toBe('');
  });
});
