import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useRef, useState} from 'react';
import {LocalData} from '../types/local-storage';

export const useLocalStorage = (number: number) => {
	const [currentData, setCurrentData] = useState<LocalData>();
	const ref = useRef(0);

	const refresh = () => {
		ref.current++;
	};

	const storeData = async (value: LocalData) => {
		try {
			const jsonValue = JSON.stringify(value);
			await AsyncStorage.setItem('@local_data', jsonValue);
			setCurrentData(value);
		} catch (e) {
			// saving error
		}
	};

	const getData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem('@local_data');
			return jsonValue != null ? JSON.parse(jsonValue) : null;
		} catch (e) {
			// error reading value
		}
	};

	useEffect(() => {
		console.log(number);
		const setData = async () => {
			const data = await getData();
			setCurrentData(() => data);
		};
		setData();
	}, [number]);
	return {currentData, storeData, getData, refresh};
};
