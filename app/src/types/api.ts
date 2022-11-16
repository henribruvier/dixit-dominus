import {Book, Section} from '../../../db/prisma';

export type FullBook = Book & {sections: Section[]};
