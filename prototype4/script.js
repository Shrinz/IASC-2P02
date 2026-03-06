import * as THREE from "three";
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
 ** STEUP **
 ***********/
// Sizes 
const size = {
    width: window.innerWidth, 
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

//Resizing
window.addEventListener('resize', () =>
{
    // Update sizes
    size.width = window.innerWidth
    size.height = window.innerHeight
    size.aspectRatio = window.innerWidth / window.innerHeight

    // Update camera
    camera.aspect = size.aspectRatio
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/***********
 ** SCENE **
 ***********/
//Canavas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 12, -20)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(size.width, size.height) 


// Controls
const controls = new OrbitControls(camera, canvas) 
controls.enableDamping = true

/***********
** LIGHTS **
************/

// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/********************
** MESHES **
*********************/
// Cube Geomtry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const drawCube = (height, color) =>
{
    // Create cube material
    const material = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(color)
    })

    // Create cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    // Position cube
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = height - 10

    // Randomize cube rotation
    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI

    // Add cube to scene
    scene.add(cube)
}

/********
** UI **
*********/
// UI
const ui = new dat.GUI()

/******************
** TEXT ANALYSIS **
*******************/
const sourceText = "The GTR and the Aventador were more than just machines they were how two friends spoke to each other. They spent their nights chasing the limits of the asphalt believing that life just like a street race demanded everything you had. One seat is empty now, but the bond isn't broken. Every time a turbo spoils or an engine screams at the starting line that memory pulls up right back to them."

// Variables
let parsedText, tokenizedText

// Parse and Toknize sourceText
const tokenizeSourceText = () =>
{
    // Strip periods and downcase sourceText
    parsedText = sourceText.replaceAll(".", "").toLowerCase()

    // Tokenize text
    tokenizedText = parsedText.split(/[^\w']+/)

}

// Find searchTerm in tokenizedText
const findSearchTermInTokenizedText = (term, color) =>
{
    // Use a for loop to go through the toknizedText array
    for (let i = 0; i < tokenizedText.length; i++)
    {
        // If tokenized Tex[i] matches our searchTerm, then we draw a cube
        if (tokenizedText[i] === term){
            // convert i into height, which is a value between 0 and 20
            const height = (100 / tokenizedText.length) * i * 0.2

            // call drawCube function 100 times using converted height value
            for(let a = 0; a < 100; a++)
            {
                drawCube(height, color)
            }
        }
    }
}


tokenizeSourceText()
findSearchTermInTokenizedText("gtr", "blue")
findSearchTermInTokenizedText("aventador", "orange")
findSearchTermInTokenizedText("turbo", "purple")


/********************
** ANIMATION LOOP **
*********************/
const clock = new THREE.Clock()

const animation = () =>
{
    
    //Return elapasedTime
    const elapsedTime = clock.getElapsedTime()
    
    //Update OrbitControls
    controls.update()

    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation() 