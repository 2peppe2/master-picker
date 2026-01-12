import { atom } from 'jotai';
import { CourseWithOccasion } from '../(main)/types';

export const activeCourseAtom = atom<CourseWithOccasion | null>(null);