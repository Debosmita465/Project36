//Create variables here
var database, dog, foodS, foodStock, position;
var bedroom, garden, washroom;
var dogImg, happyDogImg;

var feedButton, addButton;
var fedTime, lastFed, currentTime;
var foodObject;

 var gameState, readState;

function preload()
{
  //load images here
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happydog.png");
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);
  
  dog = createSprite(550,350,20,20);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  foodObject = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feedButton = createButton("Feed the dog");
  feedButton.position(700,95);
  feedButton.mousePressed(FeedDog);

  addButton = createButton("Add Food");
  addButton.position(800,95);
addButton.mousePressed(AddFood);

readState = database.ref('gameState');
readState.on("value",function(data){
  gameState = data.val();
})
}


function draw() {  
  background(46,139,87);
  drawSprites();

  fedTime = database.ref('fedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
 textSize(15);
 if(lastFed>=12){
   text("Last Feed :"+ lastFed%12 + "PM", 350,30);
 }
 else if(lastFed==0){
   text("Last Feed : 12AM", 350,30);
 }
 else{
   text("Last Feed :"+ lastFed + "AM",350,30);
 }

 if(gameState != "hungry"){
   feedButton.hide();
   addButton.hide();
   //dog.remove();
 }
 if(gameState == "hungry"){
   feedButton.show();
   addButton.show();
 // dog.addImage(dogImg);
   }

 currentTime = hour();
 if(currentTime == (lastFed+1)){
   update("playing");
   foodObject.garden();
 }
 else if(currentTime == (lastFed+2)){
   update("sleeping");
   foodObject.bedroom();
 }
 else if(currentTime > (lastFed+2) && currentTime <=(lastFed+4)){
   update("bathing");
   foodObject.washroom();
 }
 else{
   update("hungry");
   foodObject.display();
 }

 drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObject.updateFoodStock(foodS);
}

function FeedDog(){
  dog.addImage(happyDogImg);
  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    fedTime:hour(),
    gameState:"hungry"
  })
}

function AddFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}