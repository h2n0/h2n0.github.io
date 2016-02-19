var sounds = ["Damn-It","Im-Not-Gay","Like-A-Boss","Lube","Luke","Oh-My","Oh-Thats-Nasty","Ooo","Party","Scream1","Scream2","Woo"];

window.onload = function(){
  var ul = document.getElementById("list");
  for(var i in sounds){
    var node = document.createElement("li");
    var text = document.createTextNode(sounds[i].replace(/-/g, " "));
    var btn = document.createElement("div");
    node.className = "audioBtn";
    btn.innerHTML = "Sound!";
    btn.className = "btn"
    setUpButton(btn,i);
    node.appendChild(text);
    node.appendChild(btn);
    ul.appendChild(node);
  }
}

function setUpButton(btn,i){
  btn.onclick = function(){
    playSound(i);
  }
}

function playSound(i){
  var aud = new Audio("assets/audio/"+sounds[i]+".mp3");
  console.log(aud.src);
  aud.play();
}
