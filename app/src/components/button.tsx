import * as React from 'react';
import {Button} from '@rneui/themed';

type ButtonProps = {
	onPress: () => void;
	children: React.ReactNode;
	disabled?: boolean;
};

export const ButtonApp = ({
	children,
	onPress,
	disabled = false,
}: ButtonProps) => {
	return (
		<Button
			disabled={disabled}
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
