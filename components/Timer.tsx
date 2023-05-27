import { Box, Button, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

function addLeadingZeros(num, totalLength) {
	return String(num).padStart(totalLength, '0');
}

export default function Timer({
	dateInfo,
}: {
	dateInfo: {
		date: Date;
		discordChannel: string,
	};
}) {
	const renderer = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			return <Text textAlign="center"> Randka trwa na kanale {dateInfo.discordChannel}</Text>;
		} else {
			// Render a countdown
			return (
				<Text textAlign="center">
					{addLeadingZeros(hours, 2)}:{addLeadingZeros(minutes, 2)}:{addLeadingZeros(seconds, 2)}
				</Text>
			);
		}
	};
	return (
		<Box w='100%'>
			<Countdown renderer={renderer} date={new Date(dateInfo.date)} />
		</Box>
	);
}
