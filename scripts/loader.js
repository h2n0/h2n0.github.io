window.onload = function(){

    document.getElementById("show").onclick = function(){
        var xmlhttp = new XMLHttpRequest();
        var url = "https://dl.dropboxusercontent.com/u/142299734/Mike/data.json";
        var text = "";
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                text = xmlhttp.responseText;
                var b = JSON.parse(text);
                add(b["view"],b["mike"]);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
}

function add(b,v){
    if(b){
        document.getElementById("show").style.visibility = "hidden";
        document.getElementById("place").innerHTML = document.getElementById("place").innerHTML + '<embed class="swfContainer" src="https://db.tt/7Fc1mn58" width="640" height="480"/>';
    }else{
        alert("Code 5:\n"+
              "No one is allowed to see!");   
        document.getElementById("show").style.visibility = "hidden";
    }   
    document.getElementById("title").innerHTML = document.getElementById("title").innerHTML + " ["+v+"]";
}

function editValue(v,nv){
    var xmlhttp = new XMLHttpRequest();
        var url = "https://dl.dropboxusercontent.com/u/142299734/Mike/data.json";
        var text = "";
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                text = xmlhttp.responseText;
                var b = JSON.parse(text);
                add(b["view"],b["mike"]);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
}