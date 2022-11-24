import {atomWithStorage, createJSONStorage} from 'jotai/utils';
import {Delay, LocalData} from '../types/local-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = createJSONStorage<LocalData>(() => AsyncStorage);

export const localDataAtom = atomWithStorage<LocalData>(
	'localData',
	{
		book: undefined,
		sectionsMap: new Map(),
	},
	storage,
);

export const delayAtom = atomWithStorage<Delay | undefined>('delay', 20 * 60);
