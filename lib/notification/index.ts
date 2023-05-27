import { Subscription } from "../../models/Subscription";
import webpush from "web-push";
import { UserDocument } from "../../models/User";

export function sendNotification(user: UserDocument, { title, body }: { title: string, body: string }) {
	Subscription.find({ user: user }).exec((err, sub) => {
		sub.forEach((a) => {
			try {
				const payload = JSON.stringify({ title, body });
				webpush.sendNotification(a, payload).catch((error) => {
					console.error(error.stack);
				});
			} catch {
				console.log("nahh");

			}
		});
	});
}

export function sendUpcomingDate(user: UserDocument) {
	sendNotification(user, {
		title: "Nadchodzi randka!",
		body: "Wejdź na stronę, zobacz z kim się poznasz!",
	});
}

export function sendDateStarted(user: UserDocument) {
	sendNotification(user, {
		title: "Twoje spotkanie się zaczęło",
		body: "Wejdź na Discord! Tam ujrzysz swój kanał!",
	});
}

export function sendDateStarting(user: UserDocument) {
	sendNotification(user, {
		title: "Twoje spotkanie zaraz się zacznie",
		body: "Odpal Discorda i wyczekiwuj!",
	});
}


export function sendDateEnded(user: UserDocument) {
	sendNotification(user, {
		title: "Randka się zakończyła",
		body: "Koniec tego dobrego :((",
	});
}

export function sendDateEnding(user: UserDocument) {
	sendNotification(user, {
		title: "Spotkanie za moment się skończy",
		body: "Tylko ostrzegam :D",
	});
}


export function sendCancelInfo(user: UserDocument) {
	sendNotification(user, {
		title: "Twoja para nie jest w stanie przyjść na randkę",
		body: "Nic straconego! Znajdziemy dla Ciebie inną osobę",
	});
}
export function sendDateChangeInfo(user: UserDocument) {
	sendNotification(user, {
		title: "Twoja para nie przyszła na kanał",
		body: "Poczekaj jednak chwilkę! Za moment sparujemy Cię z innym kandydatem ;)",
	});
}