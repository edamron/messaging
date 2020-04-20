import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import { StyleSheet, Platform, StatusBar, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const Status = () => {
	const [connected, setConnected] = useState(true);
	const backgroundColor = connected ? 'white' : 'red';

	const handleChange = ({ isConnected }) => {
		setConnected(isConnected);
	};

	useEffect(() => {
		let subscription = NetInfo.addEventListener(handleChange);

		(async () => {
			const { isConnected } = await NetInfo.fetch();
			setConnected(isConnected);
		})();

		return () => {
			subscription();
		};
	}, []);

	const statusBar = (
		<StatusBar
			backgroundColor={backgroundColor}
			barStyle={connected ? 'dark-content' : 'light-content'}
			animated={false}
		/>
	);

	const messageContainer = (
		<View style={styles.messageContainer} pointerEvents={'none'}>
			{statusBar}
			{!connected && (
				<View style={styles.bubble}>
					<Text style={styles.text}>No network connection</Text>
				</View>
			)}
		</View>
	);

	if (Platform.OS === 'ios') {
		return (
			<View style={[styles.status, { backgroundColor }]}>
				{messageContainer}
			</View>
		);
	}

	return null; // temporary
};

const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;

Status.displayName = 'Status';

export default Status;

const styles = StyleSheet.create({
	status: {
		zIndex: 1,
		height: statusHeight,
	},
	messageContainer: {
		zIndex: 1,
		position: 'absolute',
		top: statusHeight + 20,
		right: 0,
		left: 0,
		height: 80,
		alignItems: 'center',
	},
	bubble: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: 'red',
	},
	text: {
		color: 'white',
	},
});
