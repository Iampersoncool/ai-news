import * as stringUtils from '../src/utils/string';
import { describe, test, expect } from 'vitest';

describe('stringUtils', () => {
  test('strings with same length and different content should not be equal', () => {
    expect(stringUtils.safeEqual('str1', 'str2')).toBe(false);
  });

  test('strings with same length and content should be equal', () => {
    expect(stringUtils.safeEqual('str1', 'str1')).toBe(true);
  });

  test('strings with different length and same content should not be equal', () => {
    expect(stringUtils.safeEqual('str1', 'str12')).toBe(false);
  });

  test('strings with different length and different content should not be equal', () => {
    expect(stringUtils.safeEqual('str123', 'str1234')).toBe(false);
  });
});
