var bubble = null;
var cartDetail = null;
var priceTag = null;

var price = 0;
var inBasket = 0;

var opened = false;

function removeClass(dom,s){
  var res = ""
  parts = dom.className.split(" ");
  for(var i = 0; i < parts.length; i++){
    if(parts[i] != s){
      res += parts[i]+" ";
    }
  }
  dom.className = res;
}

function addClass(dom, s){
  dom.className += " " + s;
}

function addToBasket(p){
  price += p;
  inBasket ++;
  updateBubble();
  priceTag.innerHTML = "£"+price;
}


function updateBubble(){
  bubble.innerHTML = inBasket;
  removeClass(bubble,"hidden");
}

function cartOver(){
  if(inBasket > 0)
  removeClass(cartDetail,"hidden");
}

function cartLeave(){
  if(inBasket > 0)
  addClass(cartDetail,"hidden");
}

function getPrice(dom, price){
  var newPrice = "" + (price / 44.444);
  newPrice = newPrice.substring(0,6);
  dom.innerHTML = newPrice;
}

function cartClick(){
  if(inBasket > 0){
    if(opened){
      addClass("hidden")
      opened = false;
    }else{
      opened = true;
      removeClass("hidden")
    }
  }
}



window.onload = function(){
  var $ = function(id){
    return document.getElementById(id);
  }

  bubble = $("basketCount");
  cartDetail = $("basketDet");
  priceTag = $("cost");
  $("cart").addEventListener("mouseover",cartOver);
  $("cart").addEventListener("mouseout", cartLeave);
  $("cart").addEventListener("click", cartClick);
}
