import {StatusBar} from 'expo-status-bar';
import {Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, createTheme, Button} from '@rneui/themed';

const theme = createTheme({
	lightColors: {
		primary: '#e7e7e8',
	},
	darkColors: {
		primary: '#000',
	},
	mode: 'light',
});

export default function App() {
	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<View className='flex-1 items-center justify-center bg-white'>
					<Text>Open up App.tsx to start working on your app!</Text>
					<StatusBar style='auto' />
					<Button className='bg-red-300'>Button</Button>
				</View>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
