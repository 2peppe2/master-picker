import { atom } from 'jotai'

const semestersStore = atom<(string | null)[][][]>([
    [
        [null, null, null, null], // Period 1
        [null, null, null, null], // Period 2
    ], [
        [null, null, null, null], // Period 1
        [null, null, null, null], // Period 2
    ],
    [
        [null, null, null, null], // Period 1
        [null, null, null, null], // Period 2
    ]

]);


export default semestersStore