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
// 'cors-anywhere.herokuapp.com'
// 'https://'
(function() {
    var cors_api_host = 'corsproxy.' ;
    var cors_api_url = 'http://' + cors_api_host + '/';
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

  	// iterate array of objects, returning objects with the board game data into each index
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


// more psuedocode
// alterDOM(id, data) {
// alter dom code goes here
// }
//
// id = getid();
// promise.then(alterDOM.bind(null, id);

// $.ajax( "example.php" ) .done(function() { console.log( "DO YOUR MAIN CALLBACK" ); }) .always(function() { console.log( "PASS THE NEXT CALL IN LINE" ); });



// var p1 = $.ajax(getDataFromBGGApi(saveDataHotlist));
// var p2 = $.ajax(getDataFromBGGApi(saveDataDeepSearch, _, '110327, 122996, 146704, 134342'));
// var error = Promise.reject(new Error("I am a fake error!"));
//
// Promise.all([error, p1, p2])
// .then(values => {
//  console.log(values); // [3, 1337, "foo"]
// }).catch(function(error){
//  console.log('There was error');
//  console.log(error);
// });
//
// ---------------------
// function foo() {
//  return new Promise(function (resolve, reject) {
//
//    resolve($.ajax(getDataFromBGGApi(saveDataHotlist)));
//
//  }).then($.ajax(getDataFromBGGApi(saveDataShallowSearch, 'lords of waterdeep')))
//    .then($.ajax(getDataFromBGGApi(saveDataDeepSearch, _, '110327, 122996, 146704, 134342')))
//    .then(searchAllYoutubeTerms());
// }
//
// foo();


// function createGameIdString() {
//   return new Promise(function(resolve, reject) {
//     var gameString = '';
//     var comma = ', ';
//     BggData.mainData.forEach(function(elem, index) {
//       if (index === BggData.length - 1) {
//         gameString += elem.gameId;
//       } else {
//         var gameidstr = elem.gameId + comma;
//         gameString += gameidstr;
//       }
//     });
//     console.log(gameString);
//     resolve(gameString)
//   })
// }






    // var gameids = createGameIdString();
    // var deepsearch = $.ajax(getDataFromBGGApi(saveDataDeepSearch, gameids));

    // shallowsearch.then(gameids).then(deepsearch);

    // var shallowPromise = $.ajax(getDataFromBGGApi(saveDataShallowSearch, _, boardgamesearchterm));
    // var gameids = createGameIdString();
    // var deepPromise = $.ajax(getDataFromBGGApi(saveDataDeepSearch, gameids));
    // var error = Promise.reject(new Error("Something went wrong"));
    //
    // Promise.all([shallowPromise, gameids, saveDataDeepSearch]).then(renderSearchHtml)
