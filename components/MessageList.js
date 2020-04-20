import React from 'react';
import PropTypes from 'prop-types';
import {
	FlatList,
	View,
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
} from 'react-native';
import { MessageShape } from '../utils/MessageUtils';
import MapView, { Marker } from 'react-native-maps';

const keyExtractor = (item) => item.id.toString();

const MessageList = ({ messages, onPressMessage }) => {
	const renderMessageBody = ({ type, text, uri, coordinate }) => {
		switch (type) {
			case 'text':
				return (
					<View style={styles.messageBubble}>
						<Text style={styles.text}>{text}</Text>
					</View>
				);
			case 'image':
				return <Image style={styles.image} source={{ uri }} />;
			case 'location':
				return (
					<MapView
						style={styles.map}
						mapType={'hybrid'}
						loadingEnabled={true}
						initialRegion={{
							...coordinate,
							latitudeDelta: 0.08,
							longitudeDelta: 0.04,
						}}
					>
						<Marker coordinate={coordinate} />
					</MapView>
				);
			default:
				break;
		}
	};

	const renderMessageItem = ({ item }) => (
		<View key={item.id} style={styles.messageRow}>
			<TouchableOpacity onPress={() => onPressMessage(item)}>
				{renderMessageBody(item)}
			</TouchableOpacity>
		</View>
	);

	return (
		<FlatList
			style={styles.container}
			inverted
			data={messages}
			renderItem={renderMessageItem}
			keyExtractor={keyExtractor}
			keyboardShouldPersistTaps={'handled'}
		/>
	);
};

MessageList.propTypes = {
	messages: PropTypes.arrayOf(MessageShape).isRequired,
	onPressMessage: PropTypes.func,
};

MessageList.defaultProps = {
	onPressMessage: () => {},
};

MessageList.displayName = 'MessageList';

export default MessageList;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'visible',
	},
	messageRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginBottom: 8,
		marginRight: 10,
		marginLeft: 60,
	},
	messageBubble: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: 'rebeccapurple',
		borderRadius: 20,
	},
	text: {
		fontSize: 18,
		color: 'white',
	},
	image: {
		width: 150,
		height: 150,
		borderRadius: 10,
	},
	map: {
		width: 250,
		height: 250,
		borderRadius: 10,
	},
});
