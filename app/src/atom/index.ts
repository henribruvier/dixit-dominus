import {atomWithStorage} from 'jotai/utils';
import {Delay, LocalData} from '../types/local-storage';

export const localDataAtom = atomWithStorage<LocalData | undefined>(
	'localData',
	undefined,
);

export const delayAtom = atomWithStorage<Delay | undefined>('delay', 20 * 60);
