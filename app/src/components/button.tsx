import {Button, useTheme} from '@rneui/themed';
import * as React from 'react';

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
	const {theme} = useTheme();
	return (
		<Button
			disabled={disabled}
			onPress={() => onPress()}
			disabledStyle={{
				backgroundColor: theme.colors.grey4,
			}}
			buttonStyle={{
				backgroundColor: theme.colors.secondary,
				borderColor: theme.colors.white,
				borderWidth: 2,
				borderRadius: 30,
				paddingHorizontal: 20,
			}}
		>
			{children}
		</Button>
	);
};
