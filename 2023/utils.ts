// @ts-ignore
import { readFileSync } from 'fs';

export const getInputByLine = (fileName?: string): string[] => {
  return getInput(fileName).replace(/\r/g, '').split('\n');
};

export const getInputByGroupOfLines = (fileName?: string): string[][] => {
  return getInput(fileName)
    .replace(/\r/g, '')
    .split('\n\n')
    .map((group) => group.split('\n'));
};

export const getInput = (fileName?: string): string => {
  if (!fileName) {
    fileName = isSampleInput() ? 'sample.txt' : 'input.txt';
  }

  return readFileSync(fileName).toString();
};

export const isSampleInput = (): boolean => {
  // @ts-ignore
  return process.argv[2] === 'sample';
};

export const execute = (parts: (() => number)[]): void => {
  parts.forEach((part, i) => {
    const start = new Date();

    const result = part();

    const end = new Date();
    const duration = formatDuration(start, end);

    console.log(`Part ${i + 1}: ${result}, took ${duration}`);
  });
};

export const formatDuration = (start: Date, end: Date): string => {
  const duration = end.valueOf() - start.valueOf(); // in milliseconds
  if (duration < 1000) {
    return `${duration}ms`;
  } else {
    return `${duration / 1000}s`;
  }
};
