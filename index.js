import jsonMap from './Assets/dinamicMap.json' assert  { type: "json" }
import Player from './Classes/player.js';
import Npc from './Classes/Npc.js'
import { npcData } from './Data/npcData.js';
import Map from './Classes/Map.js'

const canvas = document.querySelector('canvas');

canvas.width =window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext('2d')

const mapData=jsonMap;
const npcsData = npcData

//para ampliar el tamaño puedes usar c scale o en draw multiplicar el tamaño y posición del dibujo
// c.scale(2.5,2.5)

const map = new Map({
  mapData: mapData,
  c:c,
  canvas: canvas
})

const player = new Player(c)

const npcs =[]
npcsData.forEach(npc => {
  
   let  id = new Npc({//poniendo npc[name] en el array saldrá leah y podremos acceder a ella
    name: npc.name,
    spriteSrc:npc.spriteSrc,
    sprites: npc.sprites,
    currentSpritesheet: npc.sprites.down,
    c:c,
    maxX: npc.maxX,
    maxY: npc.maxY
    
  })
  npcs.push(id) 
})


console.log(npcs[0])
console.log(npcsData[0].sprites)

function animate(){
  window.requestAnimationFrame(animate)
  map.draw(player)
  player.draw()

  npcs.forEach(npc =>{
    npc.update(map)
  })
 

}
 animate()


window.addEventListener('keydown',(e)=>{

  e.preventDefault()
  switch(e.key){
    case "ArrowLeft": 
      map.move("left",player,npcs)
      player.move("left")
      break
    case "ArrowRight":
      map.move("right",player,npcs)
      player.move("right")
      break
    case "ArrowUp":
      map.move("up",player,npcs)
      player.move("up")
      break
    case "ArrowDown":
      map.move("down",player,npcs)
      player.move("down")
      break
  }

})