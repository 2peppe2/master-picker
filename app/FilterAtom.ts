import { atom } from 'jotai';

type filter = {
    showOnlyApplicable: boolean;
    masterProfile: string | undefined;
    semester: boolean[];
    period: boolean[];
    block: boolean[];
}

export const filterAtom = atom<filter>(
    {
        showOnlyApplicable: false,
        masterProfile: undefined,
        semester: [true, true, true],
        period: [true, true],
        block: [true, true, true, true],
    }
);