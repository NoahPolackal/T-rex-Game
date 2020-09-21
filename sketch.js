var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameover,gameoverImage;
var restart,restartImage;
var jumpSound , checkPointSound, dieSound;
var score;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud1.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(600, 200);
   obstaclesGroup = createGroup();
   cloudsGroup = createGroup();
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("circle",0,0,40);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameover = createSprite(300,100);
   gameover.addImage(gameoverImage);
   gameover.scale = 0.5;
  
  restart = createSprite(300,125);
   restart.addImage(restartImage);
   restart.scale = 0.5;
  gameover.visible = false;
  restart.visible = false;
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() { 
  background("black");
  text("Score: "+ score, 500,50);
 
  if (gamestate === PLAY){
     ground.velocityX = -(4 + 3*score/100);
    
    if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -13;
      jumpSound.play();
      
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
  //spawn the clouds
    spawnClouds();
  
  //spawn obstacles on the ground
    spawnObstacles();
     score = score + Math.round(getFrameRate()/60);
     if(score % 100 === 0 && score > 0 ){
       checkPointSound.play();
     }
  if(obstaclesGroup.isTouching (trex)){
    gamestate = END;
    //trex.velocityY = -10;
    dieSound.play();
    
  }
  }
 else if (gamestate === END){
   ground.velocityX = 0;
   trex.velocityY = 0;
   trex.changeAnimation("collided",trex_collided)
   obstaclesGroup.setVelocityXEach(0); 
   obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setVelocityXEach(0);
   cloudsGroup.setLifetimeEach(-1);
   gameover.visible = true;
   restart.visible = true;
   
   if(mousePressedOver(restart)){
     reset();
   }
  }
  
  trex.collide(invisibleGround);
  drawSprites();
}
function reset(){
  gamestate = PLAY;
  score = 0;
  trex.changeAnimation  ("running",trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
   gameover.visible = false;
   restart.visible = false;
}
function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(4 + 3*score/100);

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   obstaclesGroup.add(obstacle)
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(20,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200  ;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
    
  }
  
}