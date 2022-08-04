
//para el renderizado dinámico necesitamos una cámara, lo que hacemos es que la camara define las tiles que se ven y en los bucles for en lugar de renderizar desde la primera casilla renderizamos desde la primera de la camara hasta la ultima que se ve el resto de la fórmula es igual


export default class Camara {
  //recibe los mismos datos del mapa que el mapa
  constructor(mapData, canvas){
    this.speed = 50//pixels por segundo que se mueve, modificando podemos cambiar la velocidad
    this.x=50
    this.y=10
    this.width = canvas.width
    this.height=canvas.height
    this.maxX = mapData.width * mapData.tilewidth - canvas.width
    this.maxY = mapData.height * mapData.tileheight - canvas.height
  }

move(direccion){
  switch(direccion){
    case "left":

      this.x -= 1 * this.speed

      break
    case "right":

      this.x += 1 * this.speed

      break
    case "up":
      this.y -= 1 * this.speed
      break
    case "down":
      this.y +=1 * this.speed
      break
  }
}

}