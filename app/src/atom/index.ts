import AsyncStorage from '@react-native-async-storage/async-storage';
import {atomWithStorage, createJSONStorage} from 'jotai/utils';
import {LocalData} from '../types/local-storage';

const storage = createJSONStorage<LocalData>(() => AsyncStorage);

export const localDataAtom = atomWithStorage<LocalData>(
	'localData',
	{
		delay: 20 * 60,
		book: undefined,
		sectionsMap: {},
	},
	storage,
);
