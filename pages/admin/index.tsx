import { Box, Button, Center, Grid, GridItem, Stack, useColorModeValue, Text } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { GetServerSidePropsExpress } from '../../types/next';

export interface IAdminProps {
}


export const getServerSideProps: GetServerSidePropsExpress<IAdminProps> = async ({
    req,
    res,
}) => {
    if (!req.user) return res.redirect("/");
    if (!req.user.isAdmin) return res.redirect("/");
      
    return {props: {}}
}

export default function Admin (props: IAdminProps) {
  
  return (
		<>
			<Center h="100vh">
				<Stack>
					<Center>
						<Text fontSize="6xl" fontWeight="bold">
							Witaj Admin
						</Text>
					</Center>
					<Center>
						<Link href="/scheduler">
							<Button>Scheduler</Button>
						</Link>
						{/* <Link href="/admin/pairs">
							<Button>Pary</Button>
						</Link> */}
						<Link href="/admin/users">
							<Button>Użytkownicy</Button>
						</Link>
					</Center>
				</Stack>
			</Center>
			{/* <Grid
				pt={20}
				w="100wv"
				overflowX="hidden"
				minH="100vh"
				templateColumns="repeat(2, 1fr)"
			>
        <GridItem></GridItem>

				<GridItem
					background={useColorModeValue("blackAlpha.50", "whiteAlpha.300")}
					style={{ backdropFilter: "blur(50px)" }}
					mx={2}
					borderRadius="20px"
					p={4}
				></GridItem>
			</Grid> */}
		</>
	);
}
