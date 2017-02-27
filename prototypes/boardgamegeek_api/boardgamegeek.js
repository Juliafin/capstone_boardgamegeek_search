// State object for API data
var BggData = [];
//TODO remove test later
var BggDataTest = [
	{gameId: ''},
	{gameId: ''},
	{gameId: ''},
	{gameId: ''},
	];


// Changes XML to JSON
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

// Enable CORS (bypass Bgg api CORS block)

(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

// https://www.boardgamegeek.com/xmlapi2//search?parameters&query=agricola
// http://boardgamegeek.com/xmlapi/search?search=frika


var BOARDGAMEGEEK_BASE_URL = "http://boardgamegeek.com/xmlapi/"
function getDataFromBGGApi(callback, search, gameId) { // either search or gameID is optional

	// guards against both optional parameters being undefined
	if ((search === undefined) && (gameId === undefined)) {
		// TODO replace CSLOG with a DOM warning
		console.log('Please enter either a search term or a gameId');
		return
	}

		// parameters for Boardgameapi, plus changes depending on search conditions
  	var boardgamegeekSearchSetting = {
    	url: BOARDGAMEGEEK_BASE_URL,
    	data: {
	      search: search,
				stats: '',
    	},
    	dataType: 'xml',
    	type: 'GET',
    	success: callback
  	};
		if (search !== undefined) {
			boardgamegeekSearchSetting.url = BOARDGAMEGEEK_BASE_URL + 'search/';

		} else {
			boardgamegeekSearchSetting.url = BOARDGAMEGEEK_BASE_URL + 'boardgame/' + gameId;
			console.log('This is the ajax request: ' + boardgamegeekSearchSetting);
			boardgamegeekSearchSetting.data.stats = '1';
		};

  	$.ajax(boardgamegeekSearchSetting);
	}


var _ = undefined;
// main function call
// getDataFromBGGApi(printData, 'lords of waterdeep');
// getDataFromBGGApi(saveDataShallowSearch, 'lords of waterdeep');

// getDataFromBGGApi(printData);
getDataFromBGGApi(printData, _ , '110327, 122996, 146704, 134342');
getDataFromBGGApi(saveDataDeepSearch, _ , '110327, 122996, 146704, 134342');

// testing ajax data
function printData(data) {
	console.log(data);
 	var Bggshallowdata = xmlToJson(data);
  console.log(Bggshallowdata.boardgames.boardgame);
}

// save data to State => BggData
function saveDataShallowSearch(data) {

	// Clear previous data
	BggData.length = 0;

	// convert from xml to JSON
	var Bggshallowdata = xmlToJson(data);

	// iterate array of objects
	BggData = Bggshallowdata.boardgames.boardgame.map(function(element,index) {
		var bgObj = {};
		// console.log(element['@attributes'].objectid);
		bgObj.gameId = element['@attributes'].objectid;
		// console.log(BggData.gameId);
		bgObj.boardGameName = element.name['#text'];
		bgObj.yearpublished = element.yearpublished['#text'];
		// console.log(bgObj);
		return bgObj

	})
console.log(BggData);
}




function createGameIdString() {
	var gameString = '';
	var comma = ', ';
	BggData.forEach(function(elem, index){
		if (index === BggData.length - 1) {
			gameString += elem.gameId;
		} else {
		var gameidstr =  elem.gameId + comma;
		gameString += gameidstr;
	}
	});
	console.log(gameString);
	return gameString
}

function saveDataDeepSearch(data){
	// data is not cleared as it is being aggregated from the first api call

	// convert xml to json
	Bggdeepdata = xmlToJson(data)


	// iterate deep data
	Bggdeepdata.boardgames.boardgame.forEach(function(element) {
		console.log ("element:", element)
		// define data keys
		var image = element.image['#text'];
		var players = element.minplayers['#text'] + ' - ' + element.maxplayers['#text'];
		var playingtime = element.playingtime['#text'] + ' minutes';
		var age = element.age['#text'];
		var description = element.description['#text'];
		var boardgamepublisher = element.boardgamepublisher['#text'];
		var boardgamerank = element.statistics.ratings.average ['#text'];
		console.log(element, element.boardgamemechanic, element.boardgamemechanic.map)
		var boardgamemechanics = element.boardgamemechanic.map(function(elem) {
			return elem['#text'];
		});


		if (description === "This page does not exist. You can edit this page to create it.") {
			description = "This item does not have a description.";
		};

		if (playingtime === "0 minutes") {
			playingtime = "N/A"
		};

		// console.logs to test keys
		console.log("image: " + image);
		console.log("players: " + players);
		console.log("playing time: " + playingtime);
		console.log("age: " + age);
		console.log("board game publisher: " + boardgamepublisher);
		console.log("description: " + description);
		console.log("board game rank: " + boardgamerank);
		console.log("board game mechanics: " + boardgamemechanics);





		// feed keys into global object TODO test for now
		BggDataTest.boardGameImage = image;
		BggDataTest.players = players;
		BggDataTest.playingTime = playingtime;
		BggDataTest.age = age;
		BggDataTest.description = description;
		})
	console.log(Bggdeepdata);
	console.log(BggDataTest);


}
//   https://www.boardgamegeek.com/xmlapi2//search?parameters&query=agricola
