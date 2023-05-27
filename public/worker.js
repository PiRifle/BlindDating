self.addEventListener("activate", function (event) {
	console.log("service worker activated");
});
console.log("Loaded service worker!");

self.addEventListener("push", (ev) => {
	const data = ev.data.json();
	console.log("Got push", data);
	this.registration.showNotification(data.title, {
		body: data.body,
		icon: "/favicon.ico",
	});
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.registration?.navigationPreload.enable());
});
setInterval(() => {
	fetch("/api/ping");
}, 40000);
