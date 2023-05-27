import { resolve } from "path";

export default function registerPush(publicVapidKey){
  if ('serviceWorker' in navigator) {
    console.log('Registering service worker');
  
    run(publicVapidKey).catch(error => console.error(error));
  }
}
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
async function run(publicVapidKey) {
  console.log('Registering service worker');
  const registration = await navigator.serviceWorker.register('/worker.js', {scope: '/'});
  console.log('Registered service worker');
  await new Promise((resolve)=>{setTimeout(resolve, 3000)})
  console.log('Registering push');
  const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  console.log('Registered push');

  console.log('Sending push');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Sent push');
}