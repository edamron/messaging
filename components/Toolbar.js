//@ts-check

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

const ToolbarButton = ({ title, onPress }) => (
	<TouchableOpacity style={styles.button} onPress={onPress}>
		<Text>{title}</Text>
	</TouchableOpacity>
);

ToolbarButton.propTypes = {
	title: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
};

const Toolbar = ({
	isFocused,
	onChangeFocus,
	onSubmit,
	onPressCamera,
	onPressLocation,
}) => {
	const [text, setText] = useState('');
	let input = null;

	const setInputRef = (ref) => {
		input = ref;
	};

	useEffect(() => {
		if (isFocused) {
			input.focus();
		} else {
			input.blur();
		}
	}, [isFocused]);

	const handleFocus = () => {
		onChangeFocus(true);
	};

	const handleBlur = () => {
		onChangeFocus(false);
	};

	const handleChangeText = (text) => {
		setText(text);
	};

	const handleSubmitEditing = () => {
		if (!text) {
			return;
		}

		onSubmit(text);
		setText('');
	};

	return (
		<View style={styles.toolbar}>
			<ToolbarButton title={'📷'} onPress={onPressCamera} />
			<ToolbarButton title={'📍'} onPress={onPressLocation} />
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					underlineColorAndroid={'transparent'}
					placeholder={'Type something!'}
					blurOnSubmit={false}
					value={text}
					onChangeText={handleChangeText}
					onSubmitEditing={handleSubmitEditing}
					ref={setInputRef}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
			</View>
		</View>
	);
};

Toolbar.propTypes = {
	isFocused: PropTypes.bool.isRequired,
	onChangeFocus: PropTypes.func,
	onSubmit: PropTypes.func,
	onPressCamera: PropTypes.func,
	onPressLocation: PropTypes.func,
};

Toolbar.defaultProps = {
	onChangeFocus: () => {},
	onSubmit: () => {},
	onPressCamera: () => {},
	onPressLocation: () => {},
};

Toolbar.displayName = 'Toolbar';

export default Toolbar;

// examples styles...modify or remove as needed
const styles = StyleSheet.create({
	toolbar: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 10,
		paddingLeft: 16,
		paddingBottom: 15,
		backgroundColor: 'rebeccapurple',
	},
	button: {
		top: -2,
		marginRight: 12,
		fontSize: 20,
		color: 'grey',
		borderWidth: 2,
		borderColor: 'lightgrey',
		borderRadius: 5,
		marginTop: 2,
		padding: 6,
	},
	inputContainer: {
		flex: 1,
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.04)',
		borderRadius: 16,
		paddingVertical: 4,
		paddingHorizontal: 12,
		backgroundColor: 'white',
	},
	input: {
		flex: 1,
		fontSize: 18,
		backgroundColor: 'white',
	},
});
