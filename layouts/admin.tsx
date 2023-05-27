import { Grid, GridItem, Stack } from "@chakra-ui/react";
import NavBar from "../components/NavBar";


export default function AdminLayout({ children }) {
	return (
		<>
			<NavBar></NavBar>
			<Grid
				pt="60px"
				templateAreas={`"main nav"`}
				gridTemplateColumns={"1fr 15%"}
				h="100vh"
				gap="1"
			>
				<GridItem pl="2" area={"main"}>
					<main>{children}</main>
				</GridItem>
				<GridItem
					m="10px"
					borderRadius="20px"
					bg="blackAlpha.400"
					style={{ backdropFilter: "blur(30px)" }}
					area={"nav"}
				>
					<Stack></Stack>
				</GridItem>
			</Grid>
		</>
	);
}
