//@ts-check

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import Grid from './Grid';
import CameraRoll from 'expo-cameraroll';
import { MediaType } from 'expo-media-library';

import * as Permissions from 'expo-permissions';

const keyExtractor = ({ uri }) => uri;

const ImageGrid = ({ onPressImage }) => {
	const [loading, setLoading] = useState(false);
	const [cursor, setCursor] = useState(null);
	const [images, setImages] = useState([]);

	const getImages = async (after) => {
		if (loading) return;

		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status !== 'granted') return;

		setLoading(true);

		const results = await CameraRoll.getPhotos({
			first: 20,
			after,
			mediaType: [MediaType.photo],
		});

		const {
			edges,
			page_info: { has_next_page, end_cursor },
		} = results;
		const loadedImages = edges.map((img) => img.node.image);
		setImages([...images, ...loadedImages]);
		setLoading(false);
		setCursor(has_next_page ? end_cursor : null);
	};

	useEffect(() => {
		getImages(); // initial images
	}, []);

	const getNextImages = () => {
		if (!cursor) {
			return; // there are no more
		}

		getImages(cursor); // load from where CameralRoll left off last time
	};

	const renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
		const style = {
			width: size,
			height: size,
			marginLeft,
			marginTop,
		};

		return (
			<TouchableOpacity
				key={uri}
				activeOpacity={0.75}
				style={style}
				onPress={() => onPressImage(uri)}
			>
				<Image source={{ uri }} style={styles.image} />
			</TouchableOpacity>
		);
	};

	return (
		<Grid
			data={images}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			onEndReached={getNextImages}
		/>
	);
};

ImageGrid.propTypes = {
	onPressImage: PropTypes.func,
};

ImageGrid.defaultProps = {
	onPressImage: () => {},
};

ImageGrid.displayName = 'ImageGrid';

export default ImageGrid;

const styles = StyleSheet.create({
	image: {
		flex: 1,
	},
});
