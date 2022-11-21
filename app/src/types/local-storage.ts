import {FullBook} from './api';

export type LocalData = {
	book: FullBook | undefined;
	sectionsMap: Map<FullBook['id'], number>;
};

export type Delay = number;
