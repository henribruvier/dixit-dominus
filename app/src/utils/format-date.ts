export const formatDate = (
	date: string | Date,
	style?: 'long' | 'medium' | 'short',
): string =>
	Intl.DateTimeFormat('fr-FR', {timeStyle: style ? style : 'short'})
		.format(new Date(date))
		.split(' ')
		.map((str, i) => (i === 0 ? str[0].toUpperCase() + str.slice(1) : str))
		.join(' ');
