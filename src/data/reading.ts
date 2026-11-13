/**
 * "Worth reading": posts by other people that I recommend.
 * Add one object per post. Newest additions at the top.
 *
 * Example:
 * {
 *   title: 'How we built X',
 *   author: 'Jane Doe',
 *   url: 'https://example.com/post',
 *   why: 'Best explanation of Y I have read.',
 * },
 */
export interface Reading {
  title: string;
  author: string;
  url: string;
  /** One short line on why it's worth reading. Optional. */
  why?: string;
}

export const reading: Reading[] = [];
