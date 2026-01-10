import { atomWithReset } from 'jotai/utils';

type filter = {
    searchTerm: string;
    showOnlyApplicable: boolean;
    masterProfile: string | undefined;
    semester: number[];
    ht_or_vt: boolean[];
    period: boolean[];
    block: boolean[];
}

export const filterAtom = atomWithReset<filter>(
    {
        searchTerm: "",
        showOnlyApplicable: false,
        masterProfile: undefined,
        semester: [],
        ht_or_vt: [true, true],
        period: [true, true],
        block: [true, true, true, true],
    }
); 