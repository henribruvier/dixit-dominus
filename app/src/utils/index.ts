export const getKeyByValue = <A, T extends {[x: string]: A}>(
	object: T,
	value: A,
) =>
	Object.keys(object).find(key => object[key] === value) as keyof T | undefined;
