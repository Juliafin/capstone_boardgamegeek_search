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
function getDataFromBGGApi(gameId, search) {

  // parameters for Boardgameapi, plus changes depending on search conditions
  var boardgamegeekSearchSetting = {
    url: '',
    data: {
      search: search || undefined,
      stats: ''
    },
    dataType: 'xml',
    type: 'GET',
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
    console.log('Ajax: Bgg gameid ', boardgamegeekSearchSetting);
    boardgamegeekSearchSetting.data.stats = '1';
  };
  return boardgamegeekSearchSetting
  // $.ajax(boardgamegeekSearchSetting).then(function(){
  // console.log('This happens after the ajax call .then')
  // console.log(boardgamegeekSearchSetting.url);
  // });
}


var _ = undefined;
// Calls for testing
// tested and working
// getDataFromBGGApi(printData);
// getDataFromBGGApi(printData, '110327, 122996, 146704, 134342');

// Main calls for now!
// $.ajax(getDataFromBGGApi(saveDataHotlist)).then(function(){
// 	$.ajax(getDataFromBGGApi(saveDataShallowSearch, _, 'lords of waterdeep'))
// }).then(function(){
// 	$.ajax(getDataFromBGGApi(saveDataDeepSearch, '110327, 122996, 146704, 134342'))
// })
// .then(searchAllYoutubeTerms());

// var gameIdsearch = createGameIdString();
// console.log("Contains the commma separated game ids: " + gameIdsearch);
// $.ajax(getDataFromBGGApi(saveDataDeepSearch, _, gameIdsearch))

// getDataFromBGGApi(saveDataShallowSearch, 'lords of waterdeep'); // search term = BggData.searchTerm
// getDataFromBGGApi(saveDataDeepSearch, _ , '110327, 122996, 146704, 134342');
// Testing single call:
// $.ajax(getDataFromBGGApi(saveDataShallowSearch, _, 'lords of waterdeep')).then($.ajax(getDataFromBGGApi(saveDataDeepSearch, '110327')));

// searchAllYoutubeTerms();



var YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search"

function getDataFromYoutubeApi(callback, index) {

  var youtubeSendSetting = {
    url: YOUTUBE_BASE_URL,
    data: {
      q: BggData.youtubeSearchterms[index],
      part: 'snippet',
      key: 'AIzaSyCpcsrpsW5YrXga0kp0tg241mPPwhsxwvA',
      r: 'json',
      maxResults: 1,
      type: 'video',
      videoEmbeddable: 'true'
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
  if (data.items.length === 0) {
    return;
  }
  var youtubeUrl = "https://www.youtube.com/watch?v=" + data.items.id.videoId;
  // console.log("This is the youtube url: ", youtubeUrl)
  return youtubeUrl;
}


function searchAllYoutubeTerms() {
  BggData.youtubeSearchterms.forEach(function(element, index) {
    getDataFromYoutubeApi(saveYTdata, index);
  });
}


// testing ajax and conversion to JSON
function printData(data) {
  // console.log("Youtube data: " , data);
  var Bggrawdata = xmlToJson(data);
  // console.log("This is the raw json conversion: ", Bggrawdata);
}

function saveDataHotlist(data) {

  // convert to JSON
  var hotlist = xmlToJson(data);
  // console.log(hotlist);

  hotlist.items.item.forEach(function(element, index) {
    // create keys
    var hotlistData = {};
    var hotlistRank = element['@attributes'].rank;
    var hotlistGameId = element['@attributes'].id;
    var hotlistGameName = element.name['@attributes'].value;
    var hotlistThumbnail = element.thumbnail['@attributes'].value;

    if ("yearpublished" in element) {
      hotlistData.hotlistYearPublished = element.yearpublished['@attributes'].value;
      // console.log(hotlistData.hotlistYearPublished);
    };


    // push keys to object
    hotlistData.hotlistRank = hotlistRank;
    hotlistData.hotlistGameId = hotlistGameId;
    hotlistData.hotlistGameName = hotlistGameName;
    hotlistData.hotlistThumbnail = hotlistThumbnail;
    // hotlistData.hotlistYearPublished = hotlistYearPublished;

    // push to global object
    BggData.hotlist[index] = hotlistData;

    // test keys
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

  // console.log("Youtube search terms before expansion filtered:" , BggData.youtubeSearchterms);

  // Clear previous data
  BggData.length = 0;

  // convert from xml to JSON
  var Bggshallowdata = xmlToJson(data);
  // iterate array of objects
  BggData.mainData = Bggshallowdata.boardgames.boardgame.map(function(element, index) {
    var bgObj = {};
    // console.log(element['@attributes'].objectid);
    bgObj.gameId = element['@attributes'].objectid;
    bgObj.boardGameName = element.name['#text'];

    // if the year published doesn't exist, make the key N/A
    if ('yearpublished' in element) {
      bgObj.yearpublished = element.yearpublished['#text'];
    } else {
      bgObj.yearpublished = "N/A"
    }

    // console.log(BggData.gameId);

    // pushes the board game name as youtube search term into state
    BggData.youtubeSearchterms[index] = element.name['#text'] + " walkthrough";

    // console.log(bgObj);
    return bgObj

  })
  // console.log("Bgg data, shallow search done", BggData);
  // console.log("Youtube search terms: ", BggData.youtubeSearchterms)

  // TODO temporary call
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
  // console.log("Game id string: " + gameString);
  return gameString
}


// 2nd api call to BGG api (deep search using game ids)
function saveDataDeepSearch(data) {
  // data is not cleared as it is being aggregated from the first api call
  // convert xml to json
  var Bggdeepdata = xmlToJson(data)
  // console.log("Raw deep data:", Bggdeepdata);

  // if the first key of the raw data is an array!
  if (Array.isArray(Bggdeepdata.boardgames.boardgame)) {
    // iterate deep data
    Bggdeepdata.boardgames.boardgame.forEach(function(element, index) {
      // console.log("element:", element)
      // define data keys

      // corrects if image doesn't exist
      if ('image' in element) {
        var image = 'http:' + element.image['#text'];
      };

      // correcting when players is zero
      if ((element.maxplayers != 0) && (element.minplayers != 0)) {
        var players = element.minplayers['#text'] + ' - ' + element.maxplayers['#text'];
      } else if (element.maxplayers === element.minplayers) {
        var players = element.maxplayers;
      } else {
        var players = "N/A";
      };

      // corrects playingtime if it doesn't exist
      if ('playingtime' in element) {
        var playingtime = element.playingtime['#text'] + ' minutes';
      } else {
        var playingtime = "N/A"
      };

      // corrects age if it doesn't exist
      if ('age' in element) {
        var age = element.age['#text'];
      } else {
        var age = "N/A"
      };

      // corrects description if it doesn't exist
      if ('description' in element) {
        var description = element.description['#text'];
      } else {
        var description = "N/A"
      }

      // corrects publisher if it doesn't exist
      if ('boardgamepublisher' in element) {
        var boardgamepublisher = element.boardgamepublisher['#text'];
      } else {
        var boardgamepublisher = "N/A"
      }

      // corrects average if it doesn't exist
      if ('statistics.ratings.average' in element) {
        var boardgameAvgRating = element.statistics.ratings.average['#text'];
      } else {
        var boardgameAvgRating = "N/A"
      }

      // Inconsistent data handling for board game rank
      if (Array.isArray(element.statistics.ratings.ranks.rank)) {
        var boardgameRank = element.statistics.ratings.ranks.rank[0]['@attributes'].value;
        // console.log('full boardgame rank: ', boardgameRank);
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
          // console.log('elem is an array, and this is the mechanic: ' + elem['#text'])
          return elem['#text'];
        });
      } else if ((typeof(element.boardgamemechanic) === 'object') && (element.boardgamemechanic !== null)) {
        //  object keys, iterate over keys, send into array
        var boardgamemechanics = element.boardgamemechanic['#text']
        // console.log('elem is an object, and this is the mechanic: ' + boardgamemechanics);
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
      BggData.mainData[index].boardgamepublisher = boardgamepublisher;
      BggData.mainData[index].description = description;
      BggData.mainData[index].boardgameAvgRating = boardgameAvgRating;
      BggData.mainData[index].boardgamemechanics = boardgamemechanics;
      BggData.mainData[index].boardgameRank = boardgameRank;

      // Eliminate board games from the youtube search that are expansions (and will not return a valid result from the api call, limiting the number of necessary youtube calls). Test whether element.boardgamecategory has a (nested) value of "expansion". If it does, filter out the matching game name for the element from the state object bggdata.youtubeSearchterms

      // boardgamecategory is an array
      if (Array.isArray(element.boardgamecategory)) {

        var boardgameCategoryArr = element.boardgamecategory.map(function(element) {
          return element['#text'];
        }).join().replace(/,/g, ' ').split(' ');
        // console.log(boardgameCategoryArr);

        if (boardgameCategoryArr.indexOf('Expansion') !== -1) {
          var expansionName = element.name['#text'] + " walkthrough";
          var expansionIndex = BggData.youtubeSearchterms.indexOf(expansionName);
          BggData.youtubeSearchterms.splice(expansionIndex, 1);
          // console.log(boardgameCategoryArr);
        };

        // boardgamecategory is an object
      } else if ((typeof(element.boardgamecategory) === 'object') && (element.boardgamecategory !== null)) {
        var boardgamecategoryStr = element.boardgamecategory['#text'];
        // console.log(boardgamecategoryStr);
        var boardgamecategoryArr = boardgamecategoryStr.split(' ');
        // console.log(boardgamecategoryArr);
        if (boardgamecategoryArr.indexOf('Expansion') !== -1) {
          var expansionName = element.name['#text'] + " walkthrough";
          var expansionIndex = BggData.youtubeSearchterms.indexOf(expansionName);
          BggData.youtubeSearchterms.splice(expansionIndex, 1);
        };
      } else if (element.boardgamecategory === undefined) {
        return
      }

    }); //ends forEach function (iterating boardgame.boardgames)

    console.log("Bggdata youtube search terms", BggData.youtubeSearchterms);
    console.log("Bgg main data written: ", BggData.mainData);
    console.log("Bgg state object", BggData);


  } else if ((typeof(Bggdeepdata.boardgames.boardgame) === 'object') && (Bggdeepdata.boardgames.boardgame !== null)) {
    // top layer equivalent to "element" when boardgames.boardgame is an array
    var element = Bggdeepdata.boardgames.boardgame;

    // corrects if image doesn't exist
    if ('image' in element) {
      var image = 'http:' + element.image['#text'];
    }

    // correcting when players is zero
    if ((element.maxplayers != 0) && (element.minplayers != 0)) {
      var players = element.minplayers['#text'] + ' - ' + element.maxplayers['#text'];
    } else if (element.maxplayers === element.minplayers) {
      var players = element.maxplayers;
    } else {
      var players = "N/A";
    };

    // Corrects playtime when it doesn't exist
    if ('playtime' in element) {
      var playingtime = element.playingtime['#text'] + ' minutes';
    } else {
      var playingtime = "N/A";
    };

    // Corrects age when it doesn't exist
    if ('age' in element) {
      var age = element.age['#text'];
    } else {
      var age = "N/A";
    };

    // Corrects description when it doesn't exist
    if ('description' in element) {
      var description = element.description['#text'];
    } else {
      var description = "N/A"
    };

    // Corrects board game publisher when it doesn't exist
    if ('boardgamepublisher' in element) {
      var boardgamepublisher = element.boardgamepublisher['#text'];
    } else {
      var boardgamepublisher = "N/A"
    };

    if ('statistics.ratings.average' in element) {
      var boardgameAvgRating = element.statistics.ratings.average['#text'];
    } else {
      var boardgameAvgRating = "N/A"
    }

    // Inconsistent data handling for board game rank
    if (Array.isArray(element.statistics.ratings.ranks.rank)) {
      var boardgameRank = element.statistics.ratings.ranks.rank[0]['@attributes'].value;
      // console.log('full boardgame rank: ', boardgameRank);
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
        // console.log('elem is an array, and this is the mechanic: ' + elem['#text'])
        return elem['#text'];
      });
    } else if ((typeof(element.boardgamemechanic) === 'object') && (element.boardgamemechanic !== null)) {
      //  object keys, iterate over keys, send into array
      var boardgamemechanics = element.boardgamemechanic['#text']
      // console.log('elem is an object, and this is the mechanic: ' + boardgamemechanics);
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

    BggData.mainData[0].boardGameImage = image;
    BggData.mainData[0].players = players;
    BggData.mainData[0].playingTime = playingtime;
    BggData.mainData[0].age = age;
    BggData.mainData[0].boardgamepublisher = boardgamepublisher;
    BggData.mainData[0].description = description;
    BggData.mainData[0].boardgameAvgRating = boardgameAvgRating;
    BggData.mainData[0].boardgamemechanics = boardgamemechanics;
    BggData.mainData[0].boardgameRank = boardgameRank;

    // clears youtube search terms from main object and replaces it with just the single boardgame searched
    BggData.youtubeSearchterms = [];
    var boardgameName = element.name['#text'] + " walkthrough";
    BggData.youtubeSearchterms[0] = boardgameName;
    console.log("Youtube search results", BggData.youtubeSearchterms)

  }; // closes main else if
  console.log("This is the bggdeepdata", Bggdeepdata);
  console.log("This is the BggData", BggData);

} // closes deep search


//  Collects board game from form submit
function getSearchTerm() {

  $('#boardgamesearch').submit(function(event) {

    event.preventDefault();

    var boardgamesearchterm = $('#boardgameterm').val();
    console.log(boardgamesearchterm);

    renderLoader();

    // var gameIDs = '';
    var _;
    $.ajax(getDataFromBGGApi(_, boardgamesearchterm)).then(function(response) {
      saveDataShallowSearch(response);
      var gameIDs = createGameIdString();
      $.ajax(getDataFromBGGApi(gameIDs)).then(function(response) {
        saveDataDeepSearch(response);
        renderSearchHtml();
      }); // closes first then
    }); // closes second then

  }); // closes submit listener
} // closes function


getSearchTerm();


function renderSearchHtml() {

  // clear existing html

  $('section#searchresults').empty()

  BggData.mainData.forEach(function(element, index) {

    // create the html element from state
    var html =
		`<article class="hidden boardgame" id="index${index}" gameid="${element.gameId}">
			<h2 class="boardgamename">${element.boardGameName}</h2>
			<div class="boardgameimage" id="imageindex${index}">
				<img class= "imagethumbnail" src="${element.boardGameImage}" alt="${element.boardGameName}">
			</div>
			<div class="playersandplaytime">
				<ul>
					<li>Playing time: ${element.playingTime}</li>
					<li>Number of players: ${element.players}</li>
				</ul>
			</div>
			<div class="boardgamemechanics">
				<ul id="boardgamemechanicsOne${index}" class="boardgamemechanics">
					<li>Board game mechanics:</li>
				</ul>
				<ul id="boardgamemechanicsTwo${index}" class="boardgamemechanics">
				</ul>
			</div>
		</article>`;

    // append main element to DOM
    $('#searchresults').append(html);

    // creates the list for board game mechanics
    var boardgamemechanicsSelector = '#boardgamemechanics' + index;
		var boardgamemechanicsSelectorTwo = '#boardgamemechanicsTwo' + index;

		// If the element is a string (containing only one mechanic)
    if (typeof(element.boardgamemechanics) === 'string') {
      var boardgamemechanicsList = `<li>${element.boardgamemechanics}</li>`;


      // Testing if the selector exists
      // console.log("Boardgames mechanics is a string at index: " + index);
      // console.log(boardgamemechanicsList);
      // console.log(boardgamemechanicsSelector);
      // if ($(boardgamemechanicsSelector).length > 0) {
      // 	console.log("The board game mechanics selector exists")
      // } else {
      // 	console.log ("The board games mechanics selector does not exist")
      // };

      // append to boardgamemechanics + index
      $(boardgamemechanicsSelector).append(boardgamemechanicsList);

    } else {
      var boardgamemechanicsList = '';
			var boardgamemechanicsListTwo = '';
			var listcounter = 0;
      element.boardgamemechanics.forEach(function(mechanic) {

        if (listcounter > 4) {
          var boardgamemechanicsTwoHTML = `<li>${mechanic}</li>`;
          boardgamemechanicsListTwo += boardgamemechanicsHTML;
          // console.log(boardgamemechanicsList);
          listcounter++;

        } else {
          var boardgamemechanicsHTML = `<li>${mechanic}</li>`;
          boardgamemechanicsList += boardgamemechanicsHTML;
          // console.log(boardgamemechanicsList);
          listcounter++;
        };
      });

      // testing whether the selector exists
      // console.log(boardgamemechanicsSelector);
      // console.log(boardgamemechanicsList);
      // if ($(boardgamemechanicsSelector).length > 0) {
      // 	console.log("The board game mechanics selector exists")
      // } else {
      // 	console.log ("The board games mechanics selector does not exist")
      // };

      // append mechanicws list to the class specific to the main index
      $(boardgamemechanicsSelector).append(boardgamemechanicsList);

			if (boardgamemechanicsListTwo !== '') {
				$(boardgamemechanicsSelectorTwo).append(boardgamemechanicsListTwo);
			}

    }; // closes else on boardgamemechanics being an array (forEach)

    // add even and odd classes to control image floats in html
    if (index % 2 === 0) {
      var evenSelector = "#imageindex" + index;
      $(evenSelector).addClass('even');
    } else {
      var oddSelector = "#imageindex" + index;
      $(oddSelector).addClass('odd');
    };

    // With a delay, reveal each element
    setTimeout(function() {

      var showElementSelector = "#index" + index;
      $(showElementSelector).removeClass('hidden');
    }, 50); // closes setTimeout

  }); // ends main forEach

  // restore pointer events on submit
  $('#submitbutton').css("pointer-events", "auto");

  // remove loader
  $('.loadingcontainer').remove();

	// starts listener listening for clicks on articles
	boardgameArticleListener();

} // ends the render function


function renderLoader() {

  var loaderhtml = `<div class=loadingcontainer>
					<img class="loading" src="images/ajax-loader.gif" alt="">
					</div>`;

  $('body').prepend(loaderhtml);

  // disable submit clicks while loading
  $('#submitbutton').css("pointer-events", "none");
}

function boardgameArticleListener() {

$('.boardgame').click(function(event){

	event.preventDefault();

	// get the game id from element clicked
	var gameid = $(this).attr('gameid');
	console.log("The game id clicked is: " + gameid);

	// find index of currently clicked gameid
	var gameidIndex = BggData.mainData.map(function(element,index){
		if (gameid == element.gameId) {
			return index
		} else {
			var emptystring = '';
			return emptystring
		}

	}).join().replace(/,+/g, '').replace(/\s+/g, '')

	console.log("This is the index matching the gameid: " , gameidIndex);
	console.log(typeof(gameidIndex));
	renderAndDisplayFullBoardgame(gameidIndex);


}); // ends click event listener

}


function renderAndDisplayFullBoardgame (index) {

	// get keys from mainData state at the index matching gameid
		var gamename = BggData.mainData[index].boardGameName;
		var averagerating = BggData.mainData[index].boardgameAvgRating;
		var rank = BggData.mainData[index].boardgameRank;
		var gamepublisher = BggData.mainData[index].boardgamepublisher;
		var description = BggData.mainData[index].description;
		var players = BggData.mainData[index].players;
		var playingTime = BggData.mainData[index].playingTime;
		var yearpublished = BggData.mainData[index].yearpublished;
		var image = BggData.mainData[index].boardGameImage;
		var boardgamemechanicshtml =		BggData.mainData.map(function(element){
			 return `<li>${element.boardgamemechanics}</li>`
		}).join();

		var gameLightboxHtml = `

		<div class="lightbox hidden">
		    <h2 class="boardgamenameLB">${gamename}</h2>
		    <div class="boardgameimageLB">
		        <img class="imagethumbnailLB" src="${image}" alt="${gamename}">
		    </div>
		    <div class="statsLB">Game Stats
		        <ul>
		            <li>Playing time: ${playingTime}</li>
		            <li>Number of players: ${players}</li>
		            <li>Game publisher: ${gamepublisher}</li>
		            <li>Year Published: ${yearpublished}</li>
		            <li>Rank: ${rank}</li>
		            <li>Average player rating: ${averagerating}</li>
		        </ul>
		    </div>
		    <div class="description">
		        <h3>description</h3>
		        <p>${description}</p>
		    </div>
		    <div class="boardgamemechanicsLB">
		        <ul id="boardgamemechanics${index}" class="boardgamemechanics">
		            <li>Board game mechanics:</li>${boardgamemechanicshtml}
		        </ul>
		    </div>
		    <button class="backbutton" type="button" name="button">Back</button>

		</div>
		`;


		$('body').prepend(gameLightboxHtml);



		// Stop scroll on main window
		$('html, body').css('overflow', 'hidden');


		// disable submit clicks and clicks on additional elements
	  $('#submitbutton, article').css("pointer-events", "none");

		// listener for the backbutton
		backbuttonListener();

		// fade the lightbox in (default 0 opacity)
		$('.lightbox').fadeIn();
}


function backbuttonListener () {

	$('.backbutton').click(function(event){
		event.preventDefault();

		// Re-allow click events on the main page
		$('#submitbutton, article').css("pointer-events", "auto");

		// Re-Allow scrolling on the body
		$('html, body').css('overflow', 'auto');

		// fade out lightbox
		$('.lightbox').fadeOut();
		$('.lightbox').remove();

	})
}
