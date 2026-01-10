import { atom } from 'jotai';
import { Course } from '../courses';

export const activeCourseAtom = atom<Course | null>(null);