import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (data: string) => {
	try {
		await AsyncStorage.setItem('localData', data);
	} catch (e) {
		// saving error
	}
};

export const getData = async () => {
	const value = await AsyncStorage.getItem('localData');
	if (value !== null) {
		// value previously stored

		return JSON.parse(value);
	}
};

export const jsonToMap = (jsonStr: string) => new Map(JSON.parse(jsonStr));
export const mapToJson = (map: Map<string, any>) => JSON.stringify([...map]);
