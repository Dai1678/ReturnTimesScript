function doPost(e){
  var latitude = e.parameters["latitude"][0];
  var longitude = e.parameters["longitude"][0];
  
  var originPos = latitude + "," + longitude;
  var destinationPos = 35.681167 + "," + 139.767052;  //DEBUG 東京駅
  
  var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric" + 
            "&language=" + "ja" +
            "&origins=" + originPos + //現在地
            "&destinations=" + destinationPos + //目的地
            "&transit_mode=" + "'rail'" +  //交通手段
            "&avoid=" + "tolls" +
            "&key=" + APIKEY_GOOGLE_DISTANCE_MATRIX;
  
  var res  = UrlFetchApp.fetch(url);
  var json = JSON.parse(res.getContentText());
  
  console.log(json);
  
  if(json["status"] == "OK") {
    var time = json["rows"][0]["elements"][0]["duration"]["text"];
    var value = json["rows"][0]["elements"][0]["duration"]["value"];
    
    var arriveTime = new Date();
    arriveTime.setSeconds(value);
    
    var arriveTimeText = arriveTime.getHours() + "時" + arriveTime.getMinutes() + "分";
    
    sendLineNotify(arriveTimeText);
  }
  
}


function sendLineNotify(arriveTime){
  var sendMessage = "\n帰宅連絡です。\n" + 
                    arriveTime + "に家に帰ります。";
  
  var options = {
    "method"  : "post",
    "payload" : "message=" + sendMessage,
    "headers" : {"Authorization" : "Bearer "+ APIKEY_LINE_NOTIFY}
  };

  UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}