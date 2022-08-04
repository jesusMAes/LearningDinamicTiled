
export default class Npc {

  constructor({
    name,
    spriteSrc,
    sprites,
    currentSpritesheet,
    c,
    maxX,
    maxY
  }){
    this.name = name
    this.spriteSrc = spriteSrc
    this.sprites = sprites
    this.currentFrame=0,
    this.frameRatio=0
    this.currentSpritesheet = currentSpritesheet
    this.position = {
      x:200,
      y:200
    }
    this.originalPosition={
      x:50,
      y:50
    }
    this.maxX = maxX
    this.maxY = maxY 
    this.ctx = c
    this.moveCounter = 0
    this.direcciones = ["down", "up","left","right"]
    this.currentDirection = "down"
    this.steps = {
      x:0,
      y:0
    }
  }

  update(map){
    this.frameRatio++
    if(this.frameRatio == 10){
    this.currentFrame++
    this.frameRatio=0
    }
    this.mover(map)

    if(this.currentFrame > this.currentSpritesheet.frames){
      this.currentFrame =0
    }
    let c = this.ctx
    let image = new Image();
    image.src = this.spriteSrc;


    c.drawImage(
      image,
      21+(this.currentFrame*this.currentSpritesheet.aumentoX),
      this.currentSpritesheet.y,
      16,
      32,
      this.position.x,
      this.position.y,
      16*2,
      32*2
    )


  }

  mover(){
    //decidir si cambia de direccion
    this.moveCounter++
    let aleatorio

    if(this.moveCounter ==100){
      this.moveCounter=0
       aleatorio = Math.random()*100

      if(aleatorio < 25){
        //elegir nueva direccion, también aleatorio
        let random = Math.floor(Math.random()*4)
        this.currentDirection = this.direcciones[random]
      }
    }

    //comprobar que no se aleja demasiado

    if(this.steps.x <0){
      this.currentDirection = "right"
      console.log("entré")
    }else if(this.steps.x >this.maxX){
      this.currentDirection = "left"
      console.log("entré")
    }else if(this.steps.y > this.maxY){
      this.currentDirection = "up"
      console.log("entré")
    }else if(this.steps.y <0){
      this.currentDirection = "down"
      console.log("entré")

    }

    switch(this.currentDirection){
      case "down":
        this.currentSpritesheet= this.sprites[this.currentDirection];
        this.position.y +=2
        this.steps.y +=2

        break
      case "up":
        this.currentSpritesheet = this.sprites[this.currentDirection];
        this.position.y -=2.5
        this.steps.y -=2
        break
      case "left":
        this.currentSpritesheet = this.sprites[this.currentDirection];
        this.position.x -=2.5
        this.steps.x +=2
        break
      case "right":
        this.currentSpritesheet = this.sprites[this.currentDirection]
        this.position.x +=2.5
        this.steps.x +=2
    }
  }

}//fin de clase