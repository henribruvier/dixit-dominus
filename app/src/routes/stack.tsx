import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {HomeScreen} from '../screens/home';

export type RootStackParamList = {
	Home: undefined;
	Login: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

const MyStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name='Home' component={HomeScreen} />
		</Stack.Navigator>
	);
};

export default MyStack;
