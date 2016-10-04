var ajax = getAjax();


function getAjax(){
  var res = null;
  if(window.XMLHttpRequest){
    res = new XMLHttpRequest();
    } else {
    res = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return res;
}

function send(ajax, loc){
  ajax.open("GET", loc, true);
  ajax.send();
}
