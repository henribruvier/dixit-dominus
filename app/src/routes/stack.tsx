import {
	BottomTabBarProps,
	createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Icon} from '@rneui/base';
import {useTheme} from '@rneui/themed';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {HomeScreen} from '../screens/home';
import {ReadScreen} from '../screens/read';
import {SettingsSection} from '../screens/settings';

export type RootStackParamList = {
	Home: undefined;
	Read: undefined;
	Settings: undefined;
	tabBar?: ((props: BottomTabBarProps) => React.ReactNode) | undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const MyStack = () => {
	return (
		<Tab.Navigator
			tabBar={props => <MyTabBar {...props} />}
			initialRouteName='Home'
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tab.Screen name='Home' component={HomeScreen} />
			<Tab.Screen name='Read' component={ReadScreen} />
			<Tab.Screen name='Settings' component={SettingsSection} />
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
						case 'Settings':
							iconName = 'settings';
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

				const {theme} = useTheme();

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
						{screenOptions(
							route,
							isFocused ? theme.colors.secondary : theme.colors.primary,
						)}
						<Text
							style={{
								color: isFocused
									? theme.colors.secondary
									: theme.colors.primary,
							}}
							className='font-medium'
						>
							{label as string}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
