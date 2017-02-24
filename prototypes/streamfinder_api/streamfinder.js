// Testing api
// http://streamfinder.com/api/?api_codekey=mYRQDsM0Kaca6Kf1aOthIjaykucbtrqlPfLV3T9nVhNB4aSy9UNvkzMJrQsanhQ5fLlLcPpe2S5S7Yu0Ha4m7vKNzj8SiYaTobKrQhKOziXjblsPZ6CG1Qv8uqt9URIw&return_data_format=json&do=genre_search&gid=42&format=mp3&num=10


http://streamfinder.com/api/?api_codekey=mYRQDsM0Kaca6Kf1aOthIjaykucbtrqlPfLV3T9nVhNB4aSy9UNvkzMJrQsanhQ5fLlLcPpe2S5S7Yu0Ha4m7vKNzj8SiYaTobKrQhKOziXjblsPZ6CG1Qv8uqt9URIw&return_data_format=json&do=get_genre_list&format=mp3

// accesskey mYRQDsM0Kaca6Kf1aOthIjaykucbtrqlPfLV3T9nVhNB4aSy9UNvkzMJrQsanhQ5fLlLcPpe2S5S7Yu0Ha4m7vKNzj8SiYaTobKrQhKOziXjblsPZ6CG1Qv8uqt9URIw
var OMDB_BASE_URL = "https://streamfinder.com/api/index.php"
function getDataFromStreamfinderApi(callback) {

  var streamfinderSendSetting = {
    url: OMDB_BASE_URL,
    data: {
      api_codekey: 'mYRQDsM0Kaca6Kf1aOthIjaykucbtrqlPfLV3T9nVhNB4aSy9UNvkzMJrQsanhQ5fLlLcPpe2S5S7Yu0Ha4m7vKNzj8SiYaTobKrQhKOziXjblsPZ6CG1Qv8uqt9URIw',
      return_data_format: 'json',
      do: 'get_genre_list',
      num: '10',
      format: 'mp3',
    },
    dataType: 'jsonP',
    type: 'GET',
    success: callback
  };
  $.ajax(streamfinderSendSetting);

}

function printData(){
  console.log(data);
}

getDataFromStreamfinderApi(printData);

(function(){getDataFromStreamfinderApi({printData});});
