//@ts-check

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
	BackHandler,
	LayoutAnimation,
	Platform,
	UIManager,
	View,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

if (
	Platform.OS === 'android' &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const INPUT_METHOD = {
	NONE: 'NONE',
	KEYBOARD: 'KEYBOARD',
	CUSTOM: 'CUSTOM',
};

const MessagingContainer = ({
	containerHeight,
	contentHeight,
	keyboardHeight,
	keyboardVisible,
	keyboardWillShow,
	keyboardWillHide,
	keyboardAnimationDuration,
	inputMethod,
	onChangeInputMethod,
	children,
	renderInputMethodEditor,
}) => {
	// used to access previous value of keyboardVisible
	// in useEffect(, [keyboardVisible])
	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		});
		return ref.current;
	};
    const prevKeyboardVisible = usePrevious(keyboardVisible);

	// update the UI when they keyboard changes visibility
	useEffect(() => {
		if (keyboardVisible && !prevKeyboardVisible) {
			// keyboard shown
			onChangeInputMethod(INPUT_METHOD.KEYBOARD);
		} else if (
			!keyboardVisible &&
			prevKeyboardVisible &&
			inputMethod !== INPUT_METHOD.CUSTOM
		) {
			// keyboard hidden
			onChangeInputMethod(INPUT_METHOD.NONE);
		}

		// >>>>>> not 100% sure this goes here
		const animation = LayoutAnimation.create(
			keyboardAnimationDuration,
			Platform.OS === 'android'
				? LayoutAnimation.Types.easeInEaseOut
				: LayoutAnimation.Types.keyboard,
			LayoutAnimation.Properties.opacity,
		);

		LayoutAnimation.configureNext(animation);
		// not 100% sure this goes here >>>>>>
	}, [keyboardVisible]);

	// handle the BACK button on Android
	useEffect(() => {
		const subscription = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				if (inputMethod === INPUT_METHOD.CUSTOM) {
					onChangeInputMethod(INPUT_METHOD.NONE);
					return true;
				}

				return false;
			},
		);

		return () => {
			subscription.remove();
		};
	}, []);

	// For our outer `View`, we want to choose between rendering at
	// full height (`containerHeight`) or only the height above the
	// keyboard (`contentHeight`). If the keyboard is currently
	// appearing (`keyboardWillShow` is `true`) or if it's fully
	// visible (`inputMethod === INPUT_METHOD.KEYBOARD`), we should
	// use `contentHeight`.
	const useContentHeight =
		keyboardWillShow || inputMethod === INPUT_METHOD.KEYBOARD;
	const containerStyle = {
		height: useContentHeight ? contentHeight : containerHeight,
	};

	// We want to render our custom input when the user has pressed
	// the camera button (`inputMethod === INPUT_METHOD.CUSTOM`), so
	// long as the keyboard isn't currently appearing (which would
	// mean the input field has received focus, but we haven't updated
	// the `inputMethod` yet).
	const showCustomInput =
		inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;

	// the keyboard is hidden and not transitioning up
	const keyboardIsHidden =
		inputMethod === INPUT_METHOD.NONE && !keyboardWillShow;

	// the keyboard is visible and transitioning down
	const keyboardIsHiding =
		inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide;

	// If `keyboardHeight` is `0`, this means a hardware keyboard is
	// connected to the device. We still want to show our custom image
	// picker when a hardware keyboard is connected, so let's set
	// `keyboardHeight` to `250` in this case.
	const inputStyle = {
		height: showCustomInput ? keyboardHeight || 250 : 0,

		// show extra space if the device is an iPhone X
		// and the keyboard is not showing
		marginTop: isIphoneX() && (keyboardIsHidden || keyboardIsHiding),
	};

	return (
		<View style={containerStyle}>
			{children}
			<View style={inputStyle}>{renderInputMethodEditor()}</View>
		</View>
	);
};

MessagingContainer.propTypes = {
	containerHeight: PropTypes.number.isRequired,
	contentHeight: PropTypes.number.isRequired,
	keyboardHeight: PropTypes.number.isRequired,
	keyboardVisible: PropTypes.bool.isRequired,
	keyboardWillShow: PropTypes.bool.isRequired,
	keyboardWillHide: PropTypes.bool.isRequired,
	keyboardAnimationDuration: PropTypes.number.isRequired,
	inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
	onChangeInputMethod: PropTypes.func,
	children: PropTypes.node,
	renderInputMethodEditor: PropTypes.func.isRequired,
};

MessagingContainer.defaultProps = {
	children: null,
	onChangeInputMethod: () => {},
};

MessagingContainer.displayName = 'MessagingContainer';

export default MessagingContainer;
