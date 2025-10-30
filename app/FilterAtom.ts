import { atom } from 'jotai';

type filter = {
    showOnlyApplicable: boolean;
    masterProfile: string | null;
    semester: boolean[];
    period: boolean[];
    block: boolean[];
}

export const filterAtom = atom<filter>(
    {
        showOnlyApplicable: false,
        masterProfile: null,
        semester: [true, true, true],
        period: [true, true],
        block: [true, true, true, true],
    }
);