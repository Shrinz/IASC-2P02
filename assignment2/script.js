import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/********** 
 ** SETUP **
***********/
// Sizes
const sizes ={
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

// Resizing
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight

    // Update camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/***********
 ** SCENE **
 ***********/
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
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
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** LIGHTS **
************/

// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)



/************
 ** MESHES **
 ************/
// Cube Geomtry
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const paddleGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.5) 
const ballGeometry = new THREE.SphereGeometry(0.3, 16, 16)

const drawCube = (height, params) =>
{
    // Create cube material
    let geometry = cubeGeometry 
    if(params.shape === 'flat' )
    {
       // material = new THREE.MeshLambertMaterial({
         //   emissive: new THREE.Color(params.color),
           // emissiveIntensity: height * 0.05
        //})
        geometry = paddleGeometry

    } else if (params.shape === 'sphere') {
        geometry = ballGeometry
    
    //else {
        //material = new THREE.MeshStandardMaterial({ 
          //  color: new THREE.Color(params.color)
        //})
    }

    let material 
    if(params.emissive) {
        material = new THREE.MeshLambertMaterial({
            emissive: new THREE.Color(params.color),
            emissiveIntensity: 1    
        })
    }else {
        material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(params.color)
        })
    }
    // Wireframe
    if(params.wireframe)
    {
        material.wireframe = true
    }

    // Create cube
    const mesh = new THREE.Mesh(geometry, material)

    // Position cube
    mesh.position.x = (Math.random() - 0.5) * params.diameter
    mesh.position.z = (Math.random() - 0.5) * params.diameter
    mesh.position.y = height - 10

    // Scale cube
    mesh.scale.set(params.scale, params.scale, params.scale)

    // Dynamic Scale
   // if(params.dynamicScale)
    //{
      //  cube.scale.x = height * params.scale * 0.2
      //  cube.scale.y = height * params.scale * 0.2
      //  cube.scale.z = height * params.scale * 0.2
    //}

    // Randomize cube rotation
    if(params.randomized){
    mesh.rotation.set(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
    )
    }


    // Add cube to group
    params.group.add(mesh)
}



//drawCube(0, 'pink')
//drawCube(5, 'pink')


/********
 ** UI **
 ********/
// UI
const ui = new dat.GUI()

let preset = {}

// Groups
const group1 = new THREE.Group()
scene.add(group1)
const group2 = new THREE.Group()
scene.add(group2)
const group3 = new THREE.Group()
scene.add(group3)


const uiObj = {
    sourceText: "",
    saveSourceText() {
        saveSourceText()
    },
term1: {
    term: 'marty',
    color: '#aaff00',
    group: group1,
    shape: 'box', 
    diameter: 10,
    randomized: true,
    nCubes: 25,
    wireframe: false,
    scale: 0.5

},
term2: {
    term: 'paddle',
    color: '#00ffaa',
    group: group2,
    shape: 'flat', 
    diameter: 15,
    randomized: true,
    nCubes: 50,
    wireframe: false,
    scale: 1

},
term3: {
    term: 'ball',
    color: '#6d6dff',
    group: group3,
    shape: 'sphere',
    diameter: 3.5,
    randomized: true,
    nCubes: 35,
    wireframe: false,
    scale: 0.75
},
    saveTerms(){
        saveTerms()
    },
    rotateCamera: false
}

// UI Functions
const saveSourceText = () =>
{
    // UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()

    // text Analysis
    tokenizeSourceText(uiObj.sourceText)
    //console.log(uiObj.sourceText)
}

const saveTerms = () =>
{
    // UI
    preset = ui.save
    visualizeFolder.hide()
    cameraFolder.show()


    // Testing
    //console.log(uiObj.term1)
    //console.log(uiObj.color1)
    //console.log(uiObj.term2)
    //console.log(uiObj.color2)
    //console.log(uiObj.term3)
    //console.log(uiObj.color3)

    // Text Analysis
    findSearchTermInTokenizedText(uiObj.term1)
    findSearchTermInTokenizedText(uiObj.term2)
    findSearchTermInTokenizedText(uiObj.term3)

}

// Text Folder
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("source Text")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("Save")

// Terms, Visualize, and Camera Folders
const termsFolder = ui.addFolder("Search Terms")
const visualizeFolder = ui.addFolder("Visualize")
const cameraFolder = ui.addFolder("Camera")

termsFolder
    .add(uiObj.term1, 'term')
    .name("Term 1")

termsFolder
    .add(group1, 'visible')
    .name("Term 1 Visibility")

termsFolder
    .addColor(uiObj.term1, 'color')
    .name("Term 1 Color")

termsFolder
    .add(uiObj.term2, 'term')
    .name("Term 2")

termsFolder
    .add(group2, 'visible')
    .name("Term 2 Visibility")

termsFolder
    .addColor(uiObj.term2, 'color')
    .name("Term 2 Color")

termsFolder
    .add(uiObj.term3, 'term')
    .name("Term 3")

termsFolder
    .add(group3, 'visible')
    .name("Term 3 Visibility")

termsFolder
    .addColor(uiObj.term3, 'color')
    .name("Term 3 Color")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

cameraFolder
    .add(uiObj, 'rotateCamera')
    .name("Turntable")

// Terms, visualize, and camera folder are hidden by default
termsFolder.hide()
visualizeFolder.hide()
cameraFolder.hide()

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
const findSearchTermInTokenizedText = (params) =>
{
    // Use a for loop to go through the toknizedText array
    for (let i = 0; i < tokenizedText.length; i++)
    {
        // If tokenized Tex[i] matches our searchTerm, then we draw a cube
        if (tokenizedText[i] === params.term){
            // convert i into height, which is a value between 0 and 20
            const height = (100 / tokenizedText.length) * i * 0.2

            // call drawCube function nCubes times using converted height value
            for(let a = 0; a < params.nCubes; a++)
            {
                drawCube(height, params)
            }
        }
    }
}


//tokenizeSourceText("Here is my source text")
//findSearchTermInTokenizedText("father", "red")
//findSearchTermInTokenizedText("daughter", "white")
//findSearchTermInTokenizedText("park", "green")

/********************
 ** ANIMATION LOOP ** 
 ********************/
const clock = new THREE.Clock()

const animation = () =>
{
    // Return elapsedtime
    const elapsedTime = clock.getElapsedTime()
    
    // Update OrbitControls
    controls.update()
     group1.children.forEach((child, index) => {
        child.material.color.setHSL((elapsedTime * 0.2 + index * 0.01) % 1, 0.7, 0.5)
    })

    // Rotate Group 2
    group2.rotation.z = Math.sin(elapsedTime * 2) * 0.2

    // Spin Group 3
   group3.position.x = Math.sin(elapsedTime * 3) * 5

    // Rotate Camera
    if(uiObj.rotateCamera)
    {
        camera.position.x = Math.sin(elapsedTime * 0.1) * 20
        camera.position.z = Math.cos(elapsedTime * 0.1) * 20
        camera.position.y = 5
        camera.lookAt(0, 0, 0)

    }


    //renderer
    renderer.render(scene, camera)

    //request next frame
    window.requestAnimationFrame(animation)

}

animation()