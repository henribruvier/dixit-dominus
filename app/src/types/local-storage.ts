import {FullBook} from './api';

export type LocalData = {
	book: FullBook | undefined;
	sectionsMap: Record<FullBook['id'], number>;
};

export type Delay = number;
