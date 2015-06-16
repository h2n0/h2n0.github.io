window.onload = function(){

    document.getElementById("show").onclick = function(){
        var b = false;
        if(b){
            document.getElementById("show").style.visibility = "hidden";
        document.getElementById("place").innerHTML = document.getElementById("place").innerHTML + '<embed class="swfContainer" src="https://db.tt/7Fc1mn58" width="640" height="480"/>';
        }else{
            alert("Code 5:\n"+
                  "No one is allowed to see!");   
        }
    }
}