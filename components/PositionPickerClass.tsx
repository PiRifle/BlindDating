/* eslint-disable react/no-direct-mutation-state */
import { Box, position } from "@chakra-ui/react";
import { throws } from "assert";
import { m } from "framer-motion";
import React, { createRef } from "react";

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


type Props = {
    value: number[],
    onChange: (value: number[]) => unknown,
    isStatic: boolean,

}
type State = {
    containerRect: DOMRect
    cursorRect: DOMRect
    cursorPosition: number[]
    position: number[]
    clicked: boolean
}
export default class PositionPicker extends React.Component<Props, State> {
    private cursorRef = createRef<HTMLDivElement>()
    private containerRef = createRef<HTMLDivElement>()

    constructor(props) {
        super(props);

        this.state = {
            cursorRect: { top: 0, left: 0, bottom: 0, right: 0, height: 0, width: 0, x: 0, y: 0, toJSON: () => { } },
            containerRect: { top: 0, left: 0, bottom: 0, right: 0, height: 300, width: 300, x: 0, y: 0, toJSON: () => { } },
            cursorPosition: [0, 0],
            position: this.props.value || [0, 0],
            clicked: false
        }
    }

    translateCursorCoordinates(position: number[]) {
        return [position[0] * this.state.containerRect.width, position[1] * this.state.containerRect.height]
    }

    componentDidMount(): void {
        this.setState({ cursorPosition: this.translateCursorCoordinates(this.state.position) })
    }

    UNSAFE_componentWillUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): void {
        if (!(nextProps.value[0] == this.state.position[0] && nextProps.value[1] == this.state.position[1])) {
            const newValue = this.translateCursorCoordinates(nextProps.value)
            //@ts-ignore
            this.state.cursorPosition = newValue
        }

    }

    applyTransform(x, y) {
        this.cursorRef.current.style.left = `${x}px`;
        this.cursorRef.current.style.top = `${y}px`;
    }

    componentDidUpdate() {
        this.applyTransform(this.state.cursorPosition[0], this.state.cursorPosition[1])
        const position = [this.state.cursorPosition[0] / this.state.containerRect.width, this.state.cursorPosition[1] / this.state.containerRect.height]
        if (!(position[0] == this.state.position[0] && position[1] == this.state.position[1])) {
            //@ts-ignore
            this.state.position = position
            this.props.onChange(position)
        }

    }
    updatePosition(x, y, clicked = this.state.clicked) {

        if (clicked && !this.props.isStatic) {
            const cursorRect = this.cursorRef.current.getBoundingClientRect()
            const containerRect = this.containerRef.current.getBoundingClientRect()
            // console.log("updated position");
            var offsety = y - containerRect.top
            var offsetx = x - containerRect.left
            this.setState({ cursorPosition: [offsetx, offsety] })
        }
    }

    render() {
        return <Box minW="300px" ref={this.containerRef} minH="300px" position="relative">
            <Box
                onMouseMove={(evt) => this.updatePosition(evt.clientX, evt.clientY)}
                onTouchMove={(evt) =>
                    this.updatePosition(
                        evt.changedTouches[0].clientX,
                        evt.changedTouches[0].clientY
                    )
                }
                onMouseDown={(evt) => { this.setState({ clicked: true }); this.updatePosition(evt.clientX, evt.clientY, true) }}
                onTouchStart={(evt) => { this.setState({ clicked: true }); this.updatePosition(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY, true) }}
                onMouseUp={(evt) => this.setState({ clicked: false })}
                onTouchEnd={(evt) => this.setState({ clicked: false })}
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
                ref={this.cursorRef}
                position="absolute"
                pointerEvents="none"
                width="100%"
                height="100%"
                right={0}
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
    }
}