export const getEnv = (name: string): string => {
  const envValue = process.env[name];
  if (envValue) {
    return envValue;
  } else {
    return '';
  }
};
