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

// http://boardgamegeek.com/xmlapi/search?..
// getting shallow data (name id, publisher)

// feed shallow into the 2nd call(Bgg api) AND 3rd call(youtube api) for more in depth data

// 2nd api > BGG (gameid) more indepth on those particular games
// 3rd api > youtube (name) (+ "playthrough") > playthrough

// 4th api call (before anything gets loaded, which is the "hot list" top 50 board games (separate parameters))

// http://boardgamegeek.com/xmlapi/gameId(123874,231834)


var BOARDGAMEGEEK_BASE_URL = "http://boardgamegeek.com/xmlapi/";
function getDataFromBGGApi(callback, search, gameId) { // either search or gameID is optional

	// TODO breakout validation into separate function
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
// tested and working
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



// makes string of game ids

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

// 2nd api call to BGG api (deep search using game ids)
function saveDataDeepSearch(data){
	// data is not cleared as it is being aggregated from the first api call

	// convert xml to json
	var Bggdeepdata = xmlToJson(data)


	// iterate deep data
	Bggdeepdata.boardgames.boardgame.forEach(function(element,index) {
		console.log ("element:", element)
		// define data keys
		var image = element.image['#text'];
		var players = element.minplayers['#text'] + ' - ' + element.maxplayers['#text'];
		var playingtime = element.playingtime['#text'] + ' minutes';
		var age = element.age['#text'];
		var description = element.description['#text'];
		var boardgamepublisher = element.boardgamepublisher['#text'];
		var boardgameAvgRating = element.statistics.ratings.average ['#text'];
		var partialboardgameRank = element.statistics.ratings.ranks.rank[0]//['@attributes'].value;
		console.log('partial boardgame rank: ', partialboardgameRank);
		var boardgameRank = partialboardgameRank['@attributes'].value;
		console.log('full boardgame rank: ' , boardgameRank)

		// Inconsistent data handling of boardgamemechanics
		// element.boardgamemechanic will be mapped to an array (which along with other keys will return into an object)
		// console.log(element, element.boardgamemechanic, element.boardgamemechanic.map)
		if (Array.isArray(element.boardgamemechanic)) {
			var boardgamemechanics = element.boardgamemechanic.map(function(elem) {
				console.log('elem is an array, and this is the mechanic: ' + elem['#text'])
				return elem['#text'];
			});
		} else if ( (typeof(element.boardgamemechanic) === 'object') && (element.boardgamemechanic !== null) ) {
			//  object keys, iterate over keys, send into array
				var boardgamemechanics = element.boardgamemechanic['#text']
				console.log ('elem is an object, and this is the mechanic: ' + boardgamemechanics);
			} else if (!element.boardgamemechanic) {
				var boardgamemechanics = 'N/A';
			};

			// Corrections on description and playing time
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
		console.log("board game rank: " + boardgameRank);
		console.log("board game mechanics: " + boardgamemechanics)
		console.log("board game avg rating: " + boardgameAvgRating);
;





		// feed keys into global object TODO test for now
		BggDataTest[index].boardGameImage = image;
		BggDataTest[index].players = players;
		BggDataTest[index].playingTime = playingtime;
		BggDataTest[index].age = age;
		BggDataTest[index].boardgamepublisher;
		BggDataTest[index].description = description;
		BggDataTest[index].boardgameAvgRating = boardgameAvgRating;
		BggDataTest[index].boardgamemechanics = boardgamemechanics;
		BggDataTest[index].boardgameRank = boardgameRank;
		})
	console.log(Bggdeepdata);
	console.log(BggDataTest);


}
//   https://www.boardgamegeek.com/xmlapi2//search?parameters&query=agricola
