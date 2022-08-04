

//para dibujar la imagen necesitamos una serie de propiedades que vienen en el json:
// -Nº de columnas(ancho) del mapa: mapData.height
// -Nº de filas(alto): mapData.width

//parece raro pero funciona, igualmente es mejor que el mapa sea cuadrado y coincidirán siempre

//-Tamaño de la casilla, son cuadradas por lo que también coincide: mapData.tileheight o tilewidth, da igual. 

//a la hora de iterar el array usaremos estas columnas para movernos por él y sacar la casilla, por tanto también necesitamos el array

//-Array con el mapa en Json: mapData.layers[0].data

//nota que las capas son un array por lo que es mejor recuperarlo como mapData.layers y con un bucle for o forEach hacer un renderizado de cada capa

//-Necesitamos la imagen del stylesheet: mapData.tilesets[0].image, y usar new Image() e image.src para crear una imagen html que poder renderizar

//tilesets es un array de objetos porque podemos usar más de un stylesheet, a la hora de renderizar en base al id renderizaremos desde un png u otro.

//de momento usaremos solo uno

//ahora que tenemos la imagen necesitamos su primer Id, a la hora de renderizar debemos restar este id al id que obtenemos del mapa

//Un ejemplo: Tenemos dos tilesets, la primera contiene 20 casillas y la segunda 10, en Json cada objeto tendrá una propiedad firstId, el de la primera sería 1 y el de la segunda sería 21, entonces si el Id de nuestra casilla es 23 nos estará pidiendo la segunda casilla de la segunda hoja, es decir: 23-21 = 2

//también necesitamos el numero de columnas del tilesets, que no tiene porqué coincidir con el de nuestro mapa y dependerá del tamaño de la imagen y del de cada casilla de la misma

//con eso ya podemos hacer la clase



export default class Map {
  constructor({
    mapData,
    c,
    canvas,
  }){
    this.c = c
    this.camara = {
      speed: 2.5,
      x:10,
      y:50,
      width: canvas.width,
      height: canvas.height,
      maxX: mapData.width * mapData.tilewidth - canvas.width,
      maxY: mapData.height * mapData.tileheight - canvas.height

    }
    //datos del mapa
    this.columnas = mapData.height
    this.rows = mapData.width
    this.tileSize = mapData.tilewidth
    this.layers = mapData.layers
    this.tilesets = mapData.tilesets
    this.tilesArray = mapData.tilesets.map(function(object){
      return object.image
    })//array con las sources de cada tileset
    this.tilesetCreado = mapData.tilesets.map(function (object){
      let imagen = new Image();
      imagen.src = './Assets/'+object.image;
      return imagen
    })


    this.collisions = []//array de objetos con la x y la y de cada colision para comparar
   


  }//fin del constructor

  //el metodo getTile recupera el id de la posición del array que estamos recorriendo
  getTile(data,col, row){
    return data[row * this.columnas + col]
  }



  draw(player){
    //vaciamos array de colisiones
    this.collisions = []
    const ctx = this.c//canvas en el que dibujaremos
    let layers = [];
    layers = this.layers
    //dentro del metodo podemos cambiar la currentImage en base al id

    //es mejor poner como current imagen la ultima del array porque las otras se cargarán antes y esperará a que se cargue esta
    let currentImage = this.tilesetCreado[2]

     //usamos la camara para marcar el punto de inicio, al movernos cambiamos las propiedades de la camara y con ello a partir de que fila se empieza a dibujar y en cual se para
     
     var startCol = Math.floor(this.camara.x/this.tileSize)
     var endCol = startCol + (this.camara.width / this.tileSize)
     var startRow = Math.floor(this.camara.y/this.tileSize)
     var endRow = startRow + (this.camara.height / this.tileSize)


     //las variables ofset son para compensar, si nuestra camara apunta a x:5, y:10 no podemos empezar a dibujar ahí o el mapa empezaria mal tenemos que dibujar las que van antes en x y en y, eso es el offset
     var offsetX = -this.camara.x + startCol * this.tileSize
     var offsetY = -this.camara.y + startRow * this.tileSize



    layers.forEach(layer =>{

      let data = layer.data
     
      
      for(let c = startCol; c < endCol; c++){
        
        for(let r = startRow; r < endRow; r++){
          //conseguimos el id de la imagen
          let idTile = this.getTile(data,c,r);
          for(let i = 0;i<this.tilesets.length;i++){
            //el if comprueba a que imagen pertenece esa casilla y ajusta el id que debe ser el de la globalid menos el firstid de la imagen
            if(idTile >= this.tilesets[i].firstgid && idTile <=this.tilesets[i].firstgid+ this.tilesets[i].tilecount){
              currentImage = this.tilesetCreado[i];
              this.tilesetColumns =this.tilesets[i].columns
              idTile -=  this.tilesets[i].firstgid

            }
          }
          
          if(idTile != 0){

          //comprobamos si el tile tiene animación
          
          
          //usamos el id para obtener la posición en X
          let posX = (idTile % this.tilesetColumns) * this.tileSize;
          let x = (c - startCol) * this.tileSize + offsetX;
          let xInMap = Math.round(x)

          //encontramos la posición en Y
          let posY = (Math.floor(idTile/this.tilesetColumns))*this.tileSize
          var y = (r - startRow) * this.tileSize + offsetY;
          let yInMap = Math.round(y)
          //establecemos las colisiones
          let xCollision = Math.round(xInMap*3.5)
          let yCollision = Math.round(yInMap*3.5)


          if(layer.name == 'Collisions' && (
            (xCollision-player.position.x >0 && xCollision - player.position.x <50) ||(player.position.x - xCollision >0 && player.position.x - xCollision <50 ) &&
            ( (yCollision - player.position.y > 0 && yCollision - player.position.y <50) || (player.position.y - yCollision > 0 &&player.position.y - yCollision <50) ))){
            
            this.collisions.push({x: xCollision, y: yCollision})
            
          }
          if(layer.name != 'Collisions'){
           //con esas coordenadas ya podemos dibujarlo 
           ctx.drawImage(
            currentImage,//imagen a dibujar
            posX, //posicion donde empezar a cortar en X
            posY, //posicion donde empezar a cortar en y
            this.tileSize, //ancho a cortar
            this.tileSize, //alto a corta
            xInMap*3.5, //donde dibujarlo en x
            yInMap*3.5, //donde dibujarlo en y
            this.tileSize*3.5, //ancho de la imagen final
            this.tileSize*3.5 //alto de la imagen final
           )}

        }
        }
      }
    })  


  }//metodo draw


  move(direccion, player,npcs){

    //recalculamos la columna de dibujo aqui y si es menos que cero no movemos nada
    var startCol = Math.floor(this.camara.x/this.tileSize)
    var endCol = startCol + (this.camara.width / this.tileSize)
    var startRow = Math.floor(this.camara.y/this.tileSize)
    var endRow = startRow + (this.camara.height / this.tileSize)
    //ponemos en falso el movimiento del jugador
    player.movable.left = false
    player.movable.right =false
    player.movable.up = false
    player.movable.down = false
    let speed;
    switch(direccion){
      case "left": speed = -5
        break
      case "right":speed = +5
        break
      case "up": speed = -5
        break
      case "down": speed= +5
        break
    }

    let colision = false;

    this.collisions.forEach(collision =>{ 
      
     if(
      player.position.x + speed < collision.x + this.tileSize &&
      player.position.x + speed + player.width > collision.x &&
      player.position.y + speed < collision.y + this.tileSize &&
      player.position.y + speed + player.height > collision.y 
       ){
        colision = true
       }
    })

    if(colision ==false ){
    switch(direccion){
      case "left":
        if(startCol>=1){
          npcs.forEach(npc =>{
            npc.position.x += 2 * this.camara.speed
          })
          this.camara.x -= 1 * this.camara.speed
          
        }else if(player.position.x >10){
          player.movable.left = true
        }
        break
      case "right":
        if(endCol < this.columnas*1.28 && player.position.x >=680){
          npcs.forEach(npc =>{
            npc.position.x -= 2 * this.camara.speed
          })
        this.camara.x += (1 * this.camara.speed)
        }else if(player.position.x <=680) {
          player.movable.right = true
        }
        break
      case "up":
        if(startRow >0){
          npcs.forEach(npc =>{
            npc.position.y += 2 * this.camara.speed
          })
        this.camara.y -= 1 * this.camara.speed
        }else if(player.position.y <=360 && player.position.y >10) {
          player.movable.up = true
        }
        break
      case "down":
        if(endRow < this.columnas*1.15 &&player.position.y >= 360){
          npcs.forEach(npc =>{
            npc.position.y -= 2 * this.camara.speed
          })
        this.camara.y += 1 * this.camara.speed
        }else{
          player.movable.down = true
        }
    }
  }
  }
}


 
