// Testing api
// http://streamfinder.com/api/index.php?api_codekey=mYRQDsM0Kaca6Kf1aOthIjaykucbtrqlPfLV3T9nVhNB4aSy9UNvkzMJrQsanhQ5fLlLcPpe2S5S7Yu0Ha4m7vKNzj8SiYaTobKrQhKOziXjblsPZ6CG1Qv8uqt9URIw&return_data_format=json&do=genre_search&gid=42&format=mp3&num=10

var youtubeData = {
  q: ''
};
// accesskey mYRQDsM0Kaca6Kf1aOthIjaykucbtrqlPfLV3T9nVhNB4aSy9UNvkzMJrQsanhQ5fLlLcPpe2S5S7Yu0Ha4m7vKNzj8SiYaTobKrQhKOziXjblsPZ6CG1Qv8uqt9URIw
var OMDB_BASE_URL = "http://streamfinder.com/api/index.php"
function getDataFromStreamfinderApi(callback) {

  var streamfinderSendSetting = {
    url: OMDB_BASE_URL,
    data: {
      api_codekey: 'mYRQDsM0Kaca6Kf1aOthIjaykucbtrqlPfLV3T9nVhNB4aSy9UNvkzMJrQsanhQ5fLlLcPpe2S5S7Yu0Ha4m7vKNzj8SiYaTobKrQhKOziXjblsPZ6CG1Qv8uqt9URIw',
      return_data_format: 'json',
      do: get_genre_list,
      // num: 10,
      format: mp3,

    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(streamfinderSendSetting);

}

function printData(){
  console.log(data);
}

(function(){getDataFromStreamfinderApi({printData});});
