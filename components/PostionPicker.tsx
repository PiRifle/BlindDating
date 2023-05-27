import { Box, position } from "@chakra-ui/react";
import { defaultTo } from "lodash";
import { createRef, useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic'

function Cursor() {
	return (
		<svg
			version="1.1"
			id="Capa_1"
			x="0px"
			y="0px"
			viewBox="0 0 300 300"
		>
			<path
				d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.169,0-120-53.832-120-120
	S83.831,30,150,30s120,53.832,120,120S216.168,270,150,270z"
			/>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
			<g></g>
		</svg>
	);
}

export default function PositionPicker({ onChange, value }) {
	const [pickerDimensions, setPickerDimensions] = useState([300, 300])
	useEffect(() => {
		var elemRect = mainBoxRef.current.getBoundingClientRect();
		setPickerDimensions([elemRect.width || 300, elemRect.height || 300])
	}, []);
	const mainBoxRef = useRef<HTMLDivElement>();
	const cursorRef = useRef<HTMLDivElement>();
	const [clientRect, setClientRect] = useState<DOMRect>({ top: 0, left: 0, bottom: 0, right: 0, height: 300, width: 300, x: 0, y: 0, toJSON: () => { } });



	const [position, setPosition] = useState(value);
	const [isClicked, setClicked] = useState(false)
	useEffect(() => {
		onChange(position)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [position])
	function updateCoordinates(x, y, clicked = isClicked) {
		var elemRect = mainBoxRef.current.getBoundingClientRect();

		var offsety = y - elemRect.top - clientRect.top;
		var offsetx = x - elemRect.left - clientRect.left;

		console.log(offsetx, offsety, elemRect, clicked);
		if (offsetx >= 0 && offsety >= 0 && offsetx <= elemRect.width && offsety <= elemRect.height && clicked) {
			cursorRef.current.style.top = `${offsety}px`;
			cursorRef.current.style.left = `${offsetx}px`;
			setPosition([offsetx / elemRect.width, offsety / elemRect.height]);
		}
		// console.log(offsetx, offsety);
	}
	useEffect(() => {
		setClientRect(document.body.getBoundingClientRect())
		var elemRect = mainBoxRef.current.getBoundingClientRect();
		const mappedValue = [
			value[0] * pickerDimensions[0] + elemRect.left + clientRect.left,
			value[1] * pickerDimensions[1] + elemRect.top + clientRect.top,
		];
		updateCoordinates(mappedValue[0], mappedValue[1], true)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<Box ref={mainBoxRef} minW="300px" minH="300px" position="relative">
			<Box
				onMouseMove={(evt) => updateCoordinates(evt.clientX, evt.clientY)}
				onTouchMove={(evt) =>
					updateCoordinates(
						evt.changedTouches[0].clientX,
						evt.changedTouches[0].clientY
					)
				}
				onMouseDown={(evt) => { setClicked(true); updateCoordinates(evt.clientX, evt.clientY, true) }}
				onTouchStart={(evt) => { setClicked(true); updateCoordinates(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY, true) }}
				onMouseUp={(evt) => setClicked(false)}
				onTouchEnd={(evt) => setClicked(false)}
				position="absolute"
				width="100%"
				height="100%"
				left={0}
				right={0}
				top={0}
				bottom={0}
				className="positionPicker"
			></Box>
			<Box
				ref={cursorRef}
				position="absolute"
				pointerEvents="none"
				width="100%"
				height="100%"
				left={0}
				right={0}
				top={0}
				bottom={0}
				zIndex={10}
			>
				<Box width="20px" position="absolute">
					<div style={{ transform: "translate(-50%, -50%)" }}>
						<Cursor></Cursor>
					</div>
				</Box>
			</Box>
		</Box>
	);
}


