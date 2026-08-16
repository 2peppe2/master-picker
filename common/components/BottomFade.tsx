/**
 * Gradient overlay pinned to the bottom of a scroll area to hint that more
 * content is available below. Render it as a sibling of the scroll container,
 * inside a `relative` wrapper that matches the visible scroll area (NOT inside
 * the scroll container itself, or it would scroll with the content). Pair with
 * {@link useBottomScrollFade}.
 */
const BottomFade = () => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background via-background/60 to-transparent" />
);

export default BottomFade;
