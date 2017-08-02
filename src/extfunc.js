export function isValidUrl(url) {
	let regEx = /^https?:\/\/(\S+\.)?(\S+\.)(\S+)\S*/;
	// console.log("The result of the invalid URL test is " + regEx.test(url));
	return regEx.test(url);
}


export function createFullUrl(req, shortCode) {
  return `${req.protocol}://${req.hostname}:${getPort()}/${shortCode}`;
}
 
function getPort() {
  // console.log("Port is " + process.env.PORT);
  return process.env.PORT || 3000;
}