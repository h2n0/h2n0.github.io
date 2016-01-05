function $(id){
	return document.getElementById(id);
}


$("tiny").onclick = function(){
	var link = "http://tinyurl.com/" + genTinyLink();
  setLink(link);
}

$("goog").onclick = function(){
	var link = genGooLink();
  setLink(link);
}

$("bitl").onclick = function(){
	var link = genBitLink();
  setLink(link);
}

function genTinyLink(){
	var parts = "abcdefghijklmnopqrstuvwxyz123456789";
  var res = "";
  var amt = 2 + Math.floor(Math.random() * 3);
  for(var i = 0; i < amt; i++){
  	var pos = Math.floor(Math.random() * parts.length);
    var s = parts.substring(pos,pos+1);
    if(pos < 26){
    	if(Math.random() > 0.5)s.toUpperCase();
    }
    res += s;
  }
  return res;
}

function genGooLink(){
  var parts = "abcdefghijklmnopqrstuvwxyz123456789";
  var res = "";
  var amt = 5 + Math.floor(Math.random());
  for(var i = 0; i < amt; i++){
    var pos = Math.floor(Math.random() * parts.length);
    var s = parts.substring(pos,pos+1);
    if(pos < 26){
      if(Math.random() > 0.5){
      	s.toUpperCase();
        console.log(s);
      }
    }
    res += s;
  }
  return "http://goo.gl/"+res;
}

function genBitLink(){
  var parts = "abcdefghijklmnopqrstuvwxyz123456789";
  var res = "";
  var amt = 1+ Math.floor(Math.random() * 5);
  for(var i = 0; i < amt; i++){
    var pos = Math.floor(Math.random() * parts.length);
    var s = parts.substring(pos,pos+1);
    if(pos < 26){
      if(Math.random() > 0.5){
      	s.toUpperCase();
      }
    }
    res += s;
  }
  return "http://bit.ly/"+res;
}
function setLink(link){
	document.getElementById("nonLink").innerHTML = link;
  document.getElementById("link").href = document.getElementById("nonLink").innerHTML;
}
