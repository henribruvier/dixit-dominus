import React from 'react';
import {HomeScreen} from '../screens/home';
import {
	BottomTabBarProps,
	createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {ReadScreen} from '../screens/read';
import {TouchableOpacity, View, Text} from 'react-native';
import {Icon} from '@rneui/base';

export type RootStackParamList = {
	Home: undefined;
	Read: undefined;
	tabBar?: ((props: BottomTabBarProps) => React.ReactNode) | undefined;
};
const Tab = createBottomTabNavigator<RootStackParamList>();

const screenOptions = (
	route: BottomTabBarProps['state']['routes'][0],
	color: string,
) => {
	let iconName;
	console.log(route.name);

	switch (route.name) {
		case 'Home':
			iconName = 'home';
			break;
		case 'Read':
			iconName = 'appstore-o';
			break;
		case 'Library':
			iconName = 'folder1';
			break;
		default:
			break;
	}

	return <Icon name='sc-telegram' type='evilicon' color='#517fa4' size={24} />;
};

const MyStack = () => {
	return (
		<Tab.Navigator
			tabBar={props => <MyTabBar {...props} />}
			initialRouteName='Home'
			screenOptions={({route}) => ({
				tabBarIcon: ({color}) => screenOptions(route, color),
			})}
		>
			<Tab.Screen name='Home' component={HomeScreen} />
			<Tab.Screen name='Read' component={ReadScreen} />
		</Tab.Navigator>
	);
};

export default MyStack;

type TabBarProps = {
	state: BottomTabBarProps['state'];
	descriptors: BottomTabBarProps['descriptors'];
	navigation: BottomTabBarProps['navigation'];
};

function MyTabBar({state, descriptors, navigation}: TabBarProps) {
	return (
		<View className='h-20 flex flex-row justify-around'>
			{state.routes.map((route, index) => {
				const {options} = descriptors[route.key];
				const screenOptions = (
					route: BottomTabBarProps['state']['routes'][0],
					color: string,
				) => {
					let iconName;

					switch (route.name) {
						case 'Home':
							iconName = 'home';
							break;
						case 'Read':
							iconName = 'book';
							break;
						case 'Library':
							iconName = 'folder1';
							break;
						default:
							break;
					}

					return (
						<Icon
							name={iconName ?? 'sc-telegram'}
							type='feather'
							color={color}
							size={24}
						/>
					);
				};

				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						// The `merge: true` option makes sure that the params inside the tab screen are preserved
						navigation.navigate({name: route.name, merge: true});
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					});
				};

				return (
					<TouchableOpacity
						key={route.key}
						accessibilityRole='button'
						accessibilityState={isFocused ? {selected: true} : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						className='flex items-center justify-center'
					>
						{screenOptions(route, isFocused ? '#673ab7' : '#222')}
						<Text style={{color: isFocused ? '#673ab7' : '#222'}}>{label}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
