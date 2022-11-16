import {atomWithStorage} from 'jotai/utils';
import {LocalData} from '../types/local-storage';

export const localDataAtom = atomWithStorage<LocalData | undefined>(
	'localData',
	undefined,
);
