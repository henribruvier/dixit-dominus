import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, createTheme, Button} from '@rneui/themed';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './src/routes/stack';

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
				<NavigationContainer>
					<MyStack />
				</NavigationContainer>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
