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


var BOARDGAMEGEEK_BASE_URL = "http://boardgamegeek.com/xmlapi/"
function getDataFromBGGApi(search, gameId) { // either search or gameID is optional

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
      error: reject,
      success: resolve
  	};
		if (search !== undefined) {
			boardgamegeekSearchSetting.url = BOARDGAMEGEEK_BASE_URL + 'search/';

		} else {
			boardgamegeekSearchSetting.url = BOARDGAMEGEEK_BASE_URL + 'boardgame/' + gameId;
			console.log('This is the ajax request: ' + boardgamegeekSearchSetting);
			boardgamegeekSearchSetting.data.stats = '1';
		};

  	 return $.ajax(boardgamegeekSearchSetting);
	}

  function saveDataShallowCall(data) {

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

  function error(reason) {
      // one of the ajax calls failed (we don't care which)
      console.error("Ajax call failed because: " + reason);

// returns a promise on the first api call
var bggShallow = getDataFromBGGApi();

bggShallow.then(saveDataShallowCall, error) {

};

// 1st api call generates hot list without user intervention (on page load)
// 2nd api call (bgg shallow) collects data including name gameid and publisher
// 3rd - 4th calls (bgg deep, youtube) both of these start when 2nd call ends



// example code

// var promise1 = getDataFromBGGApi(saveDataShallowCall, 'lords of waterdeep');
// var promise2 = getDataFromBGGApi(printData, _ , '110327, 122996, 146704, 134342');
// $.when(promise1, promise2)
// .then(function (result1, result2) {
// console.log(result1); // result from first ajax request
// console.log(result2); // result from second ajax request
// });
