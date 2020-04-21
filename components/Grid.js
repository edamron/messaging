//@ts-check

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, PixelRatio, FlatList } from 'react-native';

const Grid = ({
	data,
	keyExtractor,
	renderItem,
	numColumns,
	itemMargin,
	onEndReached,
}) => {
	const renderGridItem = (info) => {
		//console.log(`Grid::renderGridItem: info is ${JSON.stringify(info)}`);
		const { index } = info;
		const { width } = Dimensions.get('window'); // width CAN change :-)
		const size = PixelRatio.roundToNearestPixel(
			(width - itemMargin * (numColumns - 1)) / numColumns,
		);
		// no marginLeft on first item in each row
		const marginLeft = index % 0 === 0 ? 0 : itemMargin;
		// no marginTop on first item in each column
		const marginTop = index < numColumns ? 0 : itemMargin;
		return renderItem({ ...info, size, marginLeft, marginTop });
	};

	return (
		<FlatList
			data={data}
			renderItem={renderGridItem}
			numColumns={numColumns}
			keyExtractor={keyExtractor}
			onEndReached={onEndReached}
		/>
	);
};

Grid.propTypes = {
	renderItem: PropTypes.func.isRequired,
	onEndReached: PropTypes.func.isRequired,
	numColumns: PropTypes.number,
	itemMargin: PropTypes.number,
};

Grid.defaultProps = {
	itemMargin: StyleSheet.hairlineWidth,
	numColumns: 4,
};

Grid.displayName = 'Grid';

export default Grid;
