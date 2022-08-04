

//clase player, empezamos con lo básico, dibujarlo

export default class Player {
  constructor(c){
    this.position={
      x:680,
      y:360
      
    }
    this.ctx = c
    this.width = 16,
    this.height = 32
    this.stylesheetSrc = './Assets/spriteSebastianStardew.png'
    this.stylesheet={
      stand:{
        x:23,
        y:0,
        aumentoX:16
      },
      up:{
        x:22,
        y:67,
        aumentoX:16
      },
      right:{
        x:23,
        y:35,
        aumentoX:16
      },
      left:{
        x:23,
        y:99,
        aumentoX:16
      }
      //añadir animacion de fumar usando http://www.spritecow.com/
    }
    this.frames = 0
    this.maxFrames = 4
    this.frameRatio = 0
    this.currentStylesheet = this.stylesheet.right

    this.movable = {//controla el desplazamiento cuando la camara se bloquea
      left:false,
      right:false,
      up:false,
      down:false
    }
  }

  draw(){
    this.frameRatio++
    if(this.frameRatio==10){
    this.frames++
    this.frameRatio=0
    }
    if(this.frames>=this.maxFrames){
      this.frames=0
    }
    let c=this.ctx
    let image = new Image();
    image.src = this.stylesheetSrc;

 
    c.drawImage(
      image,
      this.currentStylesheet.x +(this.currentStylesheet.aumentoX *this.frames),
      this.currentStylesheet.y,
      13,
      31.5,
      this.position.x, //donde dibujarlo en x
      this.position.y, //donde dibujarlo en y
      16*2, //ancho de la imagen final
      32*2 //alto de la imagen final
    )
  }
  
  move(direccion){
    switch (direccion){
      case "down":
        this.currentStylesheet = this.stylesheet.stand
        if(this.movable.down ==true){
          this.position.y += 5
        }
        break
      case "up":
        this.currentStylesheet = this.stylesheet.up
        if(this.movable.up ==true){
          this.position.y -= 5
        }
        break
      case "left":
        this.currentStylesheet = this.stylesheet.left
        if(this.movable.left ==true){
          this.position.x -= 5
        }
        break
      case "right":
        this.currentStylesheet = this.stylesheet.right
        if(this.movable.right ==true){
          this.position.x += 5
        }
        break
    }
  }
}