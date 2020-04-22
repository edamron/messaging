//@ts-check

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Platform } from 'react-native';
import Constants from 'expo-constants';

const MeasureLayout = ({ children }) => {
	const [layout, setLayout] = useState(null);

	const handleLayout = (event) => {
		const {
			nativeEvent: { layout },
		} = event;

		setLayout({
			...layout,
			y:
				layout.y +
				(Platform.OS === 'android' ? Constants.statusBarHeight : 0),
		});
	};

	if (!layout) {
		return <View onLayout={handleLayout} style={styles.container} />;
	}

	return children(layout);
};

MeasureLayout.propTypes = {
	children: PropTypes.func.isRequired,
};

MeasureLayout.displayName = 'MeasureLayout';

export default MeasureLayout;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
