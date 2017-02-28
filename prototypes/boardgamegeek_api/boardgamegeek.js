// State object for API data
var BggData = {
	hotlist: [],
	mainData: [],
	youtubeSearchterms: [],
}


;
//TODO remove test later
var BggDataTest = [{
    gameId: ''
  },
  {
    gameId: ''
  },
  {
    gameId: ''
  },
  {
    gameId: ''
  },
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
    for (var i = 0; i < xml.childNodes.length; i++) {
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

// getting shallow data (name id, publisher)
// 1st api call to BGG returns hotlist
// 2nd api > shallow search of games using search term, triggering 3rd and 4th calls
// 3rd api > BGG (gameid) more indepth on those particular games
// 4th api > youtube (name) (+ "playthrough") > playthrough

var BOARDGAMEGEEK_SEARCH_URL = "http://boardgamegeek.com/xmlapi/search/";
var BOARDGAMEGEEK_GAMEID_URL = "http://boardgamegeek.com/xmlapi/boardgame/";
var BOARDGAMEGEEK_HOTLIST_URL = "http://boardgamegeek.com/xmlapi2/hot?type=boardgame";
// search and gameID not provided, returns hot list
// search provided, returns shallow search of games,
// game id provided, returns deep search of games
function getDataFromBGGApi(callback, search, gameId) {

  // parameters for Boardgameapi, plus changes depending on search conditions
  var boardgamegeekSearchSetting = {
    url: '',
    data: {
      search: search,
      stats: '',
    },
    dataType: 'xml',
    type: 'GET',
    success: callback
  };

  // TODO breakout validation into separate function


  if ((!search) && (!gameId)) {

    boardgamegeekSearchSetting.url = BOARDGAMEGEEK_HOTLIST_URL;
		console.log("Ajax: Hotlist");
  } else if (search !== undefined) {
    boardgamegeekSearchSetting.url = BOARDGAMEGEEK_SEARCH_URL;
		console.log("Ajax: Bgg search")
  } else {
    boardgamegeekSearchSetting.url = BOARDGAMEGEEK_GAMEID_URL + gameId;
    console.log('Ajax: Bgg gameid ' + boardgamegeekSearchSetting);
    boardgamegeekSearchSetting.data.stats = '1';
  };
  $.ajax(boardgamegeekSearchSetting);
}


var _ = undefined;
// main function calls for testing
// tested and working
// getDataFromBGGApi(printData, 'lords of waterdeep');
getDataFromBGGApi(saveDataShallowSearch, 'lords of waterdeep');
// getDataFromBGGApi(printData);
// getDataFromBGGApi(printData, _, '110327, 122996, 146704, 134342');
getDataFromBGGApi(saveDataDeepSearch, _ , '110327, 122996, 146704, 134342');
// getDataFromBGGApi(saveDataHotlist);


var YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search"
function getDataFromYoutubeApi(callback) {

  var youtubeSendSetting = {
    url: YOUTUBE_BASE_URL,
    data: {
      q: BggData.youtubeSearchterms[0],
      part: 'snippet',
      key: 'AIzaSyCpcsrpsW5YrXga0kp0tg241mPPwhsxwvA',
      r: 'json',
      maxResults: 1,
      type: 'video'

    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(youtubeSendSetting);
}


// testing youtube api call
// getDataFromYoutubeApi(printData);


function saveYTdata(data) {
	var youtubeUrl = "https://www.youtube.com/watch?v=" + data.items.id.videoId;
	return youtubeUrl;
}


// testing ajax and conversion to JSON
function printData(data) {
  console.log("Youtube data: " , data);
  // var Bggshallowdata = xmlToJson(data);
  // console.log("This is the raw json conversion: ", Bggshallowdata);
}

function saveDataHotlist(data){

	// convert to JSON
	var hotlist = xmlToJson(data);
	// console.log(hotlist);

	hotlist.items.item.forEach(function(element, index){
		// create keys
		var hotlistData = {};
		var hotlistRank = element['@attributes'].rank;
		var hotlistGameId = element['@attributes'].id;
		var hotlistGameName = element.name['@attributes'].value;
		var hotlistThumbnail = element.thumbnail['@attributes'].value;
		var hotlistYearPublished = element.yearpublished['@attributes'].value;

		// push keys to object
		hotlistData.hotlistRank = hotlistRank;
		hotlistData.hotlistGameId = hotlistGameId;
		hotlistData.hotlistGameName = hotlistGameName;
		hotlistData.hotlistThumbnail = hotlistThumbnail;
		hotlistData.hotlistYearPublished = hotlistYearPublished;

		// push to global object
		BggData.hotlist[index] = hotlistData;

		// test variables
		// console.log(hotlistRank);
		// console.log(hotlistGameId);
		// console.log(hotlistGameName);
		// console.log(hotlistThumbnail);
		// console.log(hotlistYearPublished);

	});
	// console.log(BggData.hotlist);
}

// save data to State => BggData
function saveDataShallowSearch(data) {

  // Clear previous data
  BggData.length = 0;

  // convert from xml to JSON
  var Bggshallowdata = xmlToJson(data);

  // iterate array of objects
  BggData.mainData = Bggshallowdata.boardgames.boardgame.map(function(element, index) {
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

// makes string of game ids from game ids at global object

function createGameIdString() {
  var gameString = '';
  var comma = ', ';
  BggData.mainData.forEach(function(elem, index) {
    if (index === BggData.length - 1) {
      gameString += elem.gameId;
    } else {
      var gameidstr = elem.gameId + comma;
      gameString += gameidstr;
    }
  });
  console.log(gameString);
  return gameString
}

// 2nd api call to BGG api (deep search using game ids)
function saveDataDeepSearch(data) {
  // data is not cleared as it is being aggregated from the first api call

  // convert xml to json
  var Bggdeepdata = xmlToJson(data)

  // iterate deep data
  Bggdeepdata.boardgames.boardgame.forEach(function(element, index) {
    console.log("element:", element)
    // define data keys
    var image = element.image['#text'];
    var players = element.minplayers['#text'] + ' - ' + element.maxplayers['#text'];
    var playingtime = element.playingtime['#text'] + ' minutes';
    var age = element.age['#text'];
    var description = element.description['#text'];
    var boardgamepublisher = element.boardgamepublisher['#text'];
    var boardgameAvgRating = element.statistics.ratings.average['#text'];

    // Inconsistent data handling for board game rank
    if (Array.isArray(element.statistics.ratings.ranks.rank)) {
      var boardgameRank = element.statistics.ratings.ranks.rank[0]['@attributes'].value;
      console.log('full boardgame rank: ', boardgameRank);
    } else if (typeof(element.statistics.ratings.ranks.rank) === 'object') {
      var boardgameRank = element.statistics.ratings.ranks.rank['@attributes'].value;
    } else {
      var boardgameRank = 'Not Ranked';
    }

    // Inconsistent data handling of board game mechanics
    // element.boardgamemechanic will be mapped to an array (which along with other keys will return into an object)
    // console.log(element, element.boardgamemechanic, element.boardgamemechanic.map)
    if (Array.isArray(element.boardgamemechanic)) {
      var boardgamemechanics = element.boardgamemechanic.map(function(elem) {
        console.log('elem is an array, and this is the mechanic: ' + elem['#text'])
        return elem['#text'];
      });
    } else if ((typeof(element.boardgamemechanic) === 'object') && (element.boardgamemechanic !== null)) {
      //  object keys, iterate over keys, send into array
      var boardgamemechanics = element.boardgamemechanic['#text']
      console.log('elem is an object, and this is the mechanic: ' + boardgamemechanics);
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
    // console.log("image: " + image);
    // console.log("players: " + players);
    // console.log("playing time: " + playingtime);
    // console.log("age: " + age);
    // console.log("board game publisher: " + boardgamepublisher);
    // console.log("description: " + description);
    // console.log("board game rank: " + boardgameRank);
    // console.log("board game mechanics: " + boardgamemechanics)
    // console.log("board game avg rating: " + boardgameAvgRating);

    BggData.mainData[index].boardGameImage = image;
    BggData.mainData[index].players = players;
    BggData.mainData[index].playingTime = playingtime;
    BggData.mainData[index].age = age;
    BggData.mainData[index].boardgamepublisher;
    BggData.mainData[index].description = description;
    BggData.mainData[index].boardgameAvgRating = boardgameAvgRating;
    BggData.mainData[index].boardgamemechanics = boardgamemechanics;
    BggData.mainData[index].boardgameRank = boardgameRank;
  })
  console.log(Bggdeepdata);
  console.log(BggData.mainData);
}
