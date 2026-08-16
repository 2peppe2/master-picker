export const COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE =
  "data-course-card-interaction-barrier";

export const isCourseCardInteractionBarrier = (
  target: EventTarget | null,
): boolean =>
  target instanceof Element &&
  Boolean(target.closest(`[${COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE}]`));
