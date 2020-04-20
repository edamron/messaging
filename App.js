import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Alert,
	Image,
	TouchableHighlight,
} from 'react-native';
import Status from './components/Status';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';
import {
	createImageMessage,
	createLocationMessage,
	createTextMessage,
} from './utils/MessageUtils';

export default function App() {
	const home = {
		latitude: 38.64584,
		longitude: -121.53271,
	};
	const dad = {
		latitude: 37.33561,
		longitude: -82.42832,
	};

	const [fullscreenImageId, setFullscreenImageId] = useState(null);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [messages, setMessages] = useState([
		createImageMessage('https://unsplash.it/300/300'),
		createLocationMessage(dad),
		createTextMessage('World'),
		createTextMessage('Hello'),
		createLocationMessage(home),
	]);

	const dismissFullscreenImage = () => {
		setFullscreenImageId(null);
	};

	const handlePressToolbarCamera = () => {
		// ...
	};

	const handlePressToolbarLocation = () => {
		// ...
	};

	const handleChangeFocus = (isFocused) => {
		setIsInputFocused(isFocused);
	};

	const handleSubmit = (text) => {
		setMessages([createTextMessage(text), ...messages]);
	};

	const handlePressMessage = ({ id, type }) => {
		switch (type) {
			case 'text':
				Alert.alert(
					'Delete Message?',
					'Are you sure you want to permanently delete this message?',
					[
						{
							text: 'Cancel',
							style: 'cancel',
						},
						{
							text: 'Delete',
							style: 'destructive',
							onPress: () => {
								setMessages(() =>
									messages.filter((msg) => msg.id !== id),
								);
							},
						},
					],
				);
				break;
			case 'image':
				setFullscreenImageId(id);

				break;
			default:
				break;
		}
	};

	/*
	NOTE: gonna skip the book section on implementing the BackHandler for Android
	*/
	const renderFullscreenImage = () => {
		if (!fullscreenImageId) {
			return null;
		}

		const image = messages.find((msg) => msg.id === fullscreenImageId);
		if (!image) {
			return null;
		}

		const { uri } = image;

		return (
			<TouchableHighlight
				style={styles.fullscreenOverlay}
				onPress={dismissFullscreenImage}
			>
				<Image style={styles.fullscreenImage} source={{ uri }} />
			</TouchableHighlight>
		);
	};

	const renderMessageList = () => {
		return (
			<View style={styles.content}>
				<MessageList
					messages={messages}
					onPressMessage={handlePressMessage}
				/>
			</View>
		);
	};

	const renderInputMethodEditor = () => (
		<View style={styles.inputMethodEditor}></View>
	);

	const renderToolbar = () => (
		<View style={styles.toolbar}>
			<Toolbar
				isFocused={isInputFocused}
				onSubmit={handleSubmit}
				onChangeFocus={handleChangeFocus}
				onPressCamera={handlePressToolbarCamera}
				onPressLocation={handlePressToolbarLocation}
			/>
		</View>
	);

	return (
		<View style={styles.container}>
			<Status />
			{renderMessageList()}
			{renderToolbar()}
			{renderInputMethodEditor()}
			{renderFullscreenImage()}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	content: {
		flex: 1,
		backgroundColor: 'white',
	},
	inputMethodEditor: {
		flex: 1,
		backgroundColor: 'white',
	},
	toolbar: {
		borderTopWidth: 5,
		borderTopColor: 'rgba(0,0,0,0.04)',
		backgroundColor: 'rebeccapurple',
	},
	fullscreenOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'black',
		zIndex: 2,
	},
	fullscreenImage: {
		flex: 1,
		resizeMode: 'contain',
	},
});
