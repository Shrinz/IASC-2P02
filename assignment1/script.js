import * as THREE from "three";
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
 ** STEUP **
 ***********/
// Sizes 
const size = {
    width: window.innerWidth * 0.45, 
    height: window.innerHeight,
    aspectRatio: window.innerWidth * 0.45/ window.innerHeight
}

/***********
 ** SCENE **
 ***********/
//Canavas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color('black')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(10, 2, 7.5)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
})
renderer.setSize(size.width, size.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


// Controls
const controls = new OrbitControls(camera, canvas) 
controls.enableDamping = true

/********************
** MESHES **
*********************/

//Cave
const caveGeometry = new THREE.PlaneGeometry( 15.5, 7.5 );
const caveMaterial = new THREE.MeshStandardMaterial( { 
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
} );
const cave = new THREE.Mesh( caveGeometry, caveMaterial )
cave.rotation.y = Math.PI * 0.5
cave.receiveShadow = true
scene.add(cave);

//Object

//Smiley Face
const smileGroup = new THREE.Group();
scene.add(smileGroup)

// Eyes
const eyeGeometery = new THREE.SphereGeometry(0.5, 16, 16); 
const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 'red'
}); 

const leftEye = new THREE.Mesh(eyeGeometery, eyeMaterial);
leftEye.position.set(15, 4.5, 1);
leftEye.castShadow = true; 


const rightEye = new THREE.Mesh(eyeGeometery, eyeMaterial);
rightEye.position.set(15, 4.5, -1);
rightEye.castShadow = true; 

// Mouth

const smileGeometry = new THREE.TorusGeometry(1.5, 0.2, 100, 32, Math.PI)
const smileMaterial = new THREE.MeshStandardMaterial({
   color: 'yellow'
})
const smile = new THREE.Mesh(smileGeometry, smileMaterial)

smile.position.set(15, 2.5, 0)
smile.rotation.y = Math.PI * 0.5 
smile.rotation.x = Math.PI      
smile.castShadow = true
smileGroup.add(leftEye, rightEye, smile)

/*
const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.2)
const torusKnotMaterial = new THREE.MeshNormalMaterial()
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
torusKnot.position.set(15, 2.5, 0)
torusKnot.castShadow = true
scene.add(torusKnot)
*/
/********************
** Lights **
*********************/
// Ambient Light
//const ambientLight = new THREE.AmbientLight(0x404040)
//const ambientLight = new THREE.AmbientLight(
//    new THREE.Color('white')
//)
//scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'), 
    0.8
)
scene.add(directionalLight)
directionalLight.position.set(20, 5, 0)
directionalLight.target = cave
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024


// Directional Light Helper
const directionalLigthHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLigthHelper)
/*******************
** DOM INTERACTIONS **
********************/ 
const domObject = {
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false,
}


//part-one
document.querySelector('#part-one').onclick = function(){
    domObject.part = 1
}

//part-two
document.querySelector('#part-two').onclick = function(){
    domObject.part = 2
}

// First-change
document.querySelector('#first-change').onclick = function(){
    domObject.firstChange = true
}
// Second-change
document.querySelector('#second-change').onclick = function(){
    domObject.secondChange = true
}
// Third-change
document.querySelector('#third-change').onclick = function(){
    domObject.thirdChange = true
}
// Fourth-change
document.querySelector('#fourth-change').onclick = function(){
    domObject.fourthChange = true
}
/********
** UI **
*********/
// UI
/*
const ui = new dat.GUI()

const lightPositionFolder = ui.addFolder('Light Position')

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Y')

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)
    .name('Z')
*/

/********************
** ANIMATION LOOP **
*********************/
const clock = new THREE.Clock()

const animation = () =>
{
    
    //Return elapasedTime
    const elapsedTime = clock.getElapsedTime()


    // Part-One
    if(domObject.part === 1)
    {
          camera.position.set(6, 0, 0)
          camera.lookAt(0, 0, 0)
    }
    // Part-Two
    if(domObject.part === 2)
    {
        camera.position.set(25, 5, 0)
        camera.lookAt(0, 0, 0)
    }

    // First Change
    if(domObject.firstChange)
    {
       smile.rotation.z = Math.sin(elapsedTime * 2) * Math.PI 
    }

    // Second Change
     if(domObject.secondChange)
    {
        leftEye.position.z = Math.cos(elapsedTime * 2) * 1;
        rightEye.position.z = Math.sin(elapsedTime * 3 + (Math.PI / 2)) * -1;
    }

    // Third Change
     if(domObject.thirdChange)
    {
        smile.position.y = 2.5 + Math.sin(elapsedTime * 5) * 0.5;
    }

    // Fourth Change
     if(domObject.fourthChange)
    {
        smileGroup.scale.y = 1 + Math.sin(elapsedTime * 2) * 0.5
       
    }
    //Animate Object
    //torusKnot.rotation.y = elapsedTime

    // Update DirectionalLighthelper
    directionalLigthHelper.update()


    //Update OrbitControls
    controls.update()

    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation() 