import { Box, Container, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

export default function regUnorderedListaminPage() {
	return (
		<Container maxW="container.lg">
			<Box h="70px"></Box>
			<Heading>Regulamin</Heading>
			<Box h="30px"></Box>
			<Heading m={5} className="animBG" w="max-content" bgClip="text">
				1. Przebieg wydarzenia
			</Heading>
			<UnorderedList>
				<ListItem fontWeight={"bold"} fontSize={"lg"}>
					Na czym polega wydarzenie
				</ListItem>
				<UnorderedList>
					<ListItem>
						Dnia, którego odbywać się będzie event na stronie wydarzenia
						(blinddating.opole.pl) każdy z uczestników zostanie powiadomiony
						15 min przed, o osobie z którą odbywać się będzie jego spotkanie,
						wyświetlone również zostanie parę informacji pomagających przednio
						przygotować się do spotkania
					</ListItem>
					<ListItem>
						Na platformie Discord oraz oficjalnym serwerze wydarzenia,
						utworzony zostanie specjalny kanał do którego dostęp będą miały
						tylko i wyłącznie osoby do siebie dobrane.
					</ListItem>
					<ListItem>
						Każdy z uczestników powinien w jak najszybszym tempie zjawić się
						na utworzonym dla niego kanale
					</ListItem>
					<ListItem>
						Każde spotkanie trwać będzie maksymalnie 30 min, gdy minie powyżej
						10 minut po upływie wyznaczonego czasu, wszystkie kanały zostaną
						automatycznie usunięte, a co za tym idzie wszyscy użytkownicy się
						z nich automatycznie rozłączą (10 minut po upływie wyznaczonego
						czasu jest po to aby osoby w razie czego mogły się dodać
						prywatnie/wymienić danymi kontaktowymi jeżeli nie zrobiły tego w
						trakcie trwania spotkania)
					</ListItem>
					<ListItem>
						Odstęp pomiędzy dwoma spotkaniami danego dnia wynosi 10 min
					</ListItem>
					<ListItem>
						Event odbywa się w przeciągu jednego dnia 14 lutego, w przeciągu
						tego dnia każdy z uczestników odbędzie trzy spotkania (każde po 30
						min + 10 min przerwy co spotkanie co łącznie daje nam około 2
						godzin trwania wydarzenia)
					</ListItem>
				</UnorderedList>
			</UnorderedList>
			<Heading m={5} className="animBG" w="max-content" bgClip="text">
				2. Pokoje
			</Heading>
			<UnorderedList>
				<ListItem fontWeight={"bold"} fontSize={"lg"}>
					Czym jest Tzw. Pokój
				</ListItem>
				<UnorderedList>
					<ListItem>
						Pokój jest to specjalny kanał głosowy na którym użytkownicy
						odbywać będą swoje spotkania (jest to jedyny kanał głosowy jaki
						powinni widzieć użytkownicy)
					</ListItem>
				</UnorderedList>
				<ListItem fontWeight={"bold"} fontSize={"lg"}>
					Specyfikacja Tzw. Pokoju
				</ListItem>
				<UnorderedList>
					<ListItem>
						Specyfikacja zawiera specjalny unikatowy kod pokoju (Znajduje się
						on w nazwie pokoju a używany i podawany jest tylko i wyłącznie w
						razie wystąpienia problemów)
					</ListItem>
					<ListItem>
						dzięki któremu @VCM w razie problemu jest w stanie szybko odnaleźć
						kanał, na którym się znajdujecie. przykładowy Kod wygląda
						następująco: #001-01 Randka
					</ListItem>
				</UnorderedList>
			</UnorderedList>
			<Heading m={5} className="animBG" w="max-content" bgClip="text">
				3. Komunikacja z @VCM
			</Heading>
			<UnorderedList>
				<ListItem fontWeight={"bold"} fontSize={"lg"}>
					Czym jest @VCM
				</ListItem>
				<UnorderedList>
					<ListItem>
						jest to osoba odpowiedzialna w trakcie trwania eventu za
						nadzorowanie jego przebiegu, a także jest on pierwszą i jedyną
						osobą, do której powinniście się zgłaszać o pomoc w trakcie
						trwania wydarzenia
					</ListItem>
				</UnorderedList>
				<ListItem fontWeight={"bold"} fontSize={"lg"}>
					Komunikacja
				</ListItem>
				<UnorderedList>
					<ListItem>
						Jedyną i poprawną drogą komunikacji z @VCM jest chat prywatny
					</ListItem>
					<ListItem>
						Każda osoba powinna kontaktować się z @VCM tylko i wyłącznie, gdy
						jest to wymagane do poprawnego przebiegu jego spotkania.
					</ListItem>
					<p>
						<b> przykład: </b>
					</p>
					<ListItem>Masz problem z widocznością kanału głosowego</ListItem>
					<ListItem>
						Wyświetla ci się więcej niż jeden kanał jednocześnie na rundę
					</ListItem>
				</UnorderedList>
			</UnorderedList>
			<Heading
				m={5}
				overflowWrap={"break-word"}
				className="animBG"
				bgClip="text"
			>
				4. System (Odwoływanie spotkań oraz ogólne informacje o działaniu)
			</Heading>
			<UnorderedList>
				<ListItem fontWeight={"bold"} fontSize={"lg"}>
					Jak działa odwoływanie spotkań
				</ListItem>
				<UnorderedList>
					<ListItem>
						Na stronie wydarzenia (blinddating.opole.pl) po wejściu w
						konkretne spotkanie pojawia się przycisk Nie Przyjdę następnie
						należy potwierdzić czy aby na pewno nie możecie zjawić się na
						spotkaniu. Automatycznie system w tym momencie wyświetla u drugiej
						osoby z którą miało odbyć się spotkanie, ze nie możecie się
						pojawić i zostaje ono odwołane.
					</ListItem>
				</UnorderedList>
			</UnorderedList>
			<UnorderedList>
				<ListItem fontWeight={"bold"} fontSize={"lg"}>
					Dlaczego muszę wypełnić formularz feedbacku?
				</ListItem>
				<UnorderedList>
					<ListItem>
						Formularz feedbacku jest dla nas świadectwem poprawnie podjętych
						decyzji odnośnie trenowania sztucznej inteligencji oraz
						modelowania formularza rejestracji! nie musisz go wypełniać,
						jednak aby nam wspomóc w tworzeniu lepszego modelu doboru par na
						następną edycję &quot;Blind Dating&quot; kontrybucja jest mile
						widziana!
					</ListItem>
				</UnorderedList>
			</UnorderedList>
			<Box h="70px"></Box>
		</Container>
	);
}
