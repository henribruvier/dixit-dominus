import {FullBook} from './api';

export type LocalData = {
	book: FullBook | undefined;
	currentSection: Map<FullBook['id'], number>;
};

export type Delay = number;
