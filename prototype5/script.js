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
const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(5, 5, 5)
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

let preset = {}

const uiObj = {
    sourceText: "The turbo gtr raced and overtook the stick aventador",
    saveSourceText() {
        saveSourceText()
    },
    term1: 'gtr',
    color1: '#aa00ff', 
    term2: 'turbo',
    color2: '#00ffaa',
    term3: 'aventador', 
    color3: '#ffffff',
    saveTerms: () => saveTerms() 

    
 }

//UI Functions
const saveSourceText = () =>
{
    //UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()


    //Text Analysis
    tokenizeSourceText(uiObj.sourceText)
    
}

const saveTerms = () =>
{
    //UI 
    preset = ui.save()
    visualizeFolder.hide()

    //Text Analysis 
    findSearchTermInTokenizedText(uiObj.term1, uiObj.color1)
    findSearchTermInTokenizedText(uiObj.term2, uiObj.color2)
    findSearchTermInTokenizedText(uiObj.term3, uiObj.color3)
}

//Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("Source Text")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("Save")

//Terms and Visualize Folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")

termsFolder
    .add(uiObj, 'term1')
    .name("Term 1")
termsFolder
    .addColor(uiObj, 'color1')
    .name("Term 1 Color")

termsFolder
    .add(uiObj, 'term2')
    .name("Term 2")
termsFolder
    .addColor(uiObj, 'color2')
    .name("Term 2 Color")

termsFolder
    .add(uiObj, 'term3')
    .name("Term 3")
termsFolder
    .addColor(uiObj, 'color3')
    .name("Term 3 Color")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("visualize")
//Terms and Visualize Folders are hidden by default
termsFolder.hide()
visualizeFolder.hide()

/******************
** TEXT ANALYSIS **
*******************/

// Variables
let parsedText, tokenizedText

// Parse and Toknize sourceText
const tokenizeSourceText = (sourceText) =>
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


//tokenizeSourceText()
//findSearchTermInTokenizedText("gtr", "blue")
//findSearchTermInTokenizedText("aventador", "orange")
//findSearchTermInTokenizedText("turbo", "purple")


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