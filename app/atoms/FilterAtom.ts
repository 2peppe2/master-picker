import { atom } from 'jotai';

type filter = {
    searchTerm: string;
    showOnlyApplicable: boolean;
    masterProfile: string | undefined;
    semester: boolean[];
    period: boolean[];
    block: boolean[];
}

export const filterAtom = atom<filter>(
    {
        searchTerm: "",
        showOnlyApplicable: false,
        masterProfile: undefined,
        semester: [true, true, true],
        period: [true, true],
        block: [true, true, true, true],
    }
);