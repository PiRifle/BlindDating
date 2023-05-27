import { Box, Code, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { Component, createRef } from "react";
import io from "socket.io-client";

type Props = {
	channel: string
};

type State = {
	items: JSX.Element[]
};

class LogConsole extends Component<Props, State> {
	state = { items: [] };
	notSetup = false;
	socket = io();
	messagesEndRef = React.createRef<HTMLDivElement>();
	componentDidUpdate() {
		this.scrollToBottom();
	}
	scrollToBottom = () => {
		this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	componentDidMount(): void {
		this.scrollToBottom();
		if (this.notSetup) {
			this.props.channel === "*"
				? this.socket.onAny((eventName, msg) => {
					if (this.state.items.length > 1000) {
						// eslint-disable-next-line react/no-direct-mutation-state
						this.state.items = [];
					}
					this.setState({
						items: [
							// ...,
							...this.state.items,
							<Code
								as={motion.div}
								position="relative"
								initial={{ left: "-100px", opacity: 0 }}
								animate={{ left: "0px", opacity: 1 }}
								key={this.state.items.length}
							>
								{`${eventName}:${msg}`}
							</Code>,
						],
					});
				})
				: this.socket.on(this.props.channel, (msg) => {
					if (this.state.items.length > 1000) {
						// eslint-disable-next-line react/no-direct-mutation-state
						this.state.items = [];
					}
					this.setState({
						items: [
							// ...,
							...this.state.items,
							<Code
								as={motion.div}
								position="relative"
								initial={{ left: "-100px", opacity: 0 }}
								animate={{ left: "0px", opacity: 1 }}
								key={this.state.items.length}
							>
								{`${msg}`}
							</Code>,
						],
					});
				});

		}
		this.notSetup = true;
	}
	render() {
		return (
			<Stack>
				{this.state.items}
				<div ref={this.messagesEndRef} />
			</Stack>
		);
	}
}

export default LogConsole;
