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

/***********
 ** SCENE **
 ***********/
//Canavas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('black')

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
    antialias: true
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

const smileGroup = new THREE.Group();
scene.add(smileGroup)

const eyeGeometery = new THREE.SphereGeometry(0.5, 16, 16); 
const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 'red'
}); 

const leftEye = new THREE.Mesh(eyeGeometery, eyeMaterial);
leftEye.position.set(6, 2, 1);
leftEye.castShadow = true; 


const rightEye = new THREE.Mesh(eyeGeometery, eyeMaterial);
rightEye.position.set(6, 2, -1);
rightEye.castShadow = true; 


//const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.2)
//const torusKnotMaterial = new THREE.MeshNormalMaterial()
//const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
//torusKnot.position.set(6, 1, 0)
//torusKnot.castShadow = true
//scene.add(torusKnot)

const smileGeometry = new THREE.TorusGeometry(1.5, 0.2, 100, 32, Math.PI)
const smileMaterial = new THREE.MeshStandardMaterial({
    color: 'yellow'
})
const smile = new THREE.Mesh(smileGeometry, smileMaterial)

smile.position.set(6, -0.25, 0)
smile.rotation.y = Math.PI * 0.5 
smile.rotation.x = Math.PI      
smile.castShadow = true
smileGroup.add(leftEye, rightEye, smile)

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
    0.5
)
scene.add(directionalLight)
directionalLight.position.set(20, 4.1, 0)
directionalLight.target = cave
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 512
directionalLight.shadow.mapSize.height = 512


// Directional Light Helper
const directionalLigthHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLigthHelper)

/********
** UI **
*********/
// UI
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


/********************
** ANIMATION LOOP **
*********************/
const clock = new THREE.Clock()

const animation = () =>
{
    
    //Return elapasedTime
    const elapsedTime = clock.getElapsedTime()

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