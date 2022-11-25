import {FullBook} from './api';

export type LocalData = {
	delay: number;
	book: FullBook | undefined;
	sectionsMap: Record<FullBook['id'], number>;
};
