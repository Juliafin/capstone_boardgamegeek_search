// State object for API data
var BggData = [];


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
getDataFromBGGApi(printData, 'lords of waterdeep');
getDataFromBGGApi(saveDataShallowCall, 'lords of waterdeep');

// getDataFromBGGApi(printData);
// getDataFromBGGApi(printData, _ , '110327, 122996');

// testing ajax data
function printData(data) {
	console.log(data);
 	var Bggshallowdata = xmlToJson(data);
  console.log(Bggshallowdata.boardgames.boardgame);
}

// save data to State => BggData
function saveDataShallowCall(data) {

	// Clear previous data
	BggData.length = 0;

	// convert from xml to JSON
	var Bggshallowdata = xmlToJson(data);

	// iterate array of objects
	Bggshallowdata.boardgames.boardgame.forEach(function(element,index) {
		console.log(element['@attributes'].objectid);
		// BggData[index].gameId = element['@attributes'].objectid;
		// console.log(BggData.element.gameId);
	})

}


//   https://www.boardgamegeek.com/xmlapi2//search?parameters&query=agricola
