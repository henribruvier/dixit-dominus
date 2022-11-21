import {atomWithStorage} from 'jotai/utils';
import {Delay, LocalData} from '../types/local-storage';

export const localDataAtom = atomWithStorage<LocalData>('localData', {
	book: undefined,
	sectionsMap: new Map(),
});

export const delayAtom = atomWithStorage<Delay | undefined>('delay', 20 * 60);
