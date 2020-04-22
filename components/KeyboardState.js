//@ts-check

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, Platform } from 'react-native';

const INITIAL_ANIMATION_DURATION = 250;

const KeyboardState = ({ layout, children }) => {
	const [contentHeight, setContentHeight] = useState(layout.height);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const [keyboardWillShow, setKeyboardWillShow] = useState(false);
	const [keyboardWillHide, setKeyboardWillHide] = useState(false);
	const [keyboardAnimationDuration, setKeyboardAnimationDuration] = useState(
		INITIAL_ANIMATION_DURATION,
	);
	let subscriptions = [];

	const measure = (event) => {
		const {
			endCoordinates: { height, screenY },
			duration,
		} = event;

		setContentHeight(screenY - layout.y);
		setKeyboardHeight(height);
		setKeyboardAnimationDuration(duration || INITIAL_ANIMATION_DURATION);
	};

	const handleKeyboardWillShow = (event) => {
		setKeyboardWillShow(true);
		measure(event);
	};
	const handleKeyboardWillHide = (event) => {
		setKeyboardWillHide(true);
		measure(event);
	};
	const handleKeyboardDidShow = (event) => {
		setKeyboardWillShow(false);
		setKeyboardVisible(true);
		measure(event);
	};
	const handleKeyboardDidHide = () => {
		setKeyboardWillHide(false);
		setKeyboardVisible(false);
	};

	useEffect(() => {
		if (Platform.OS === 'ios') {
			subscriptions = [
				Keyboard.addListener(
					'keyboardWillShow',
					handleKeyboardWillShow,
				),
				Keyboard.addListener(
					'keyboardWillHide',
					handleKeyboardWillHide,
				),
				Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow),
				Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide),
			];
		} else {
			subscriptions = [
				Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow),
				Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide),
			];
		}

		return () => {
			subscriptions.forEach((subscription) => subscription.remove());
		};
	}, []);

	return children({
		containerHeight: layout.height,
		contentHeight,
		keyboardHeight,
		keyboardVisible,
		keyboardWillShow,
		keyboardWillHide,
		keyboardAnimationDuration,
	});
};

KeyboardState.propTypes = {
	layout: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
	}).isRequired,
	children: PropTypes.func.isRequired,
};

KeyboardState.displayName = 'KeyboardState';

export default KeyboardState;
