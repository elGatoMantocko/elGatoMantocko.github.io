import { describe, expect, it } from 'vitest';

import { PROFILE } from './profile.ts';
import { renderAskPrompt } from './prompt.ts';

describe('renderAskPrompt', () => {
  const prompt = renderAskPrompt();

  it('points the model at llms.txt', () => {
    expect(prompt).toContain(`${PROFILE.siteUrl}/llms.txt`);
  });

  it('does not restate profile details', () => {
    expect(prompt).not.toContain(PROFILE.tagline);
    expect(prompt).not.toContain(PROFILE.email);
    expect(prompt).not.toContain(PROFILE.github);
    for (const [, value] of PROFILE.details) {
      expect(prompt).not.toContain(value);
    }
  });
});
