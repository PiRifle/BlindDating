	import { Box, FormControl, Text } from "@chakra-ui/react";
import PositionPicker from "./PositionPickerClass";

export default function GenderPicker({value, onChange, isStatic}){
    return (
			<Box
				position="relative"
				width={300}
				height={300}
				borderRadius={10}
                overflow="hidden"
			>
				<Box position="absolute" left={0} right={0} top={0} bottom={0}>
					<PositionPicker isStatic={isStatic} onChange={onChange} value={value}></PositionPicker>
				</Box>
				<Box
					background="rgba(255,255,255,0.2)"
					pointerEvents="none"
					position="absolute"
					left={0}
					right={0}
					top={0}
					bottom={0}
				>
					<Text
						position="absolute"
						left={0}
						top={0}
						p={4}
						fontWeight="semibold"
					>
						Kobieta
					</Text>
					<Text
						position="absolute"
						right={0}
						bottom={0}
						p={4}
						fontWeight="semibold"
					>
						Mężczyzna
					</Text>
					<Text
						position="absolute"
						left={0}
						bottom={0}
						p={4}
						fontWeight="semibold"
					>
						Aseksualny
						<br /> neutralny
					</Text>
					<Text
						position="absolute"
						right={0}
						top={0}
						p={4}
						fontWeight="semibold"
					>
						Bisekualny
					</Text>
				</Box>
			</Box>
		);
}