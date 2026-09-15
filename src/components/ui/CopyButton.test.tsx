// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset().mockResolvedValue();
    Object.assign(navigator, { clipboard: { writeText } });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('copies the value and flashes a confirmation', async () => {
    render(
      <CopyButton value="hello" text="Copy it" copiedText="Got it">
        <span>icon</span>
      </CopyButton>,
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Copy it');

    await act(() => fireEvent.click(button));
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(button.getAttribute('aria-label')).toBe('Got it');
    expect(screen.queryByText('icon')).toBeNull();

    await act(() => vi.runAllTimers());
    expect(button.getAttribute('aria-label')).toBe('Copy it');
    expect(screen.getByText('icon')).toBeTruthy();
  });

  it('stays idle when the clipboard is unavailable', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    render(
      <CopyButton value="hello" text="Copy it">
        <span>icon</span>
      </CopyButton>,
    );
    const button = screen.getByRole('button');

    await act(() => fireEvent.click(button));
    expect(button.getAttribute('aria-label')).toBe('Copy it');
  });
});
