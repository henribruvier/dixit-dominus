import * as React from 'react';
import {Button} from '@rneui/themed';

type ButtonProps = {
	onPress: () => void;
	children: React.ReactNode;
};

export const ButtonApp = ({children, onPress}: ButtonProps) => {
	return (
		<Button
			onPress={() => onPress()}
			buttonStyle={{
				backgroundColor: '#80A6DB',
				borderWidth: 2,
				borderColor: 'white',
				borderRadius: 30,
				paddingHorizontal: 20,
			}}
		>
			{children}
		</Button>
	);
};
