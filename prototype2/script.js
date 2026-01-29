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
scene.background = new THREE.Color('grey')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    size.aspectRatio,
    0.1,
    100
)
scene.add(camera)
camera.position.set(-2, 2, 5)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(size.width, size.height)

// Controls
const controls = new OrbitControls(camera, canvas) 
controls.enableDamping = true

/********************
** MESHES **
*********************/
//testSphere
const torusknotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 15)
const torusknotMaterial = new THREE.MeshNormalMaterial()
const testTorusKnot = new THREE.Mesh(torusknotGeometry, torusknotMaterial)

scene.add(testTorusKnot) 



// Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 50, 50)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide, 
    wireframe: true
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = Math.PI * 0.5
scene.add(plane)


/********
** UI **
*********/
// UI
const ui = new dat.GUI() 

// UI Object
const uiObject = {
    speed: 1,
    distance: 1,
    rotationSpeed: 1
}

//testSphere UI
const torusknotfolder = ui.addFolder('TorusKnot') 

torusknotfolder
    .add(uiObject, 'speed') 
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Speed')

torusknotfolder
    .add(uiObject, 'distance')
    .min(0.1)
    .max(10)
    .step(0.1)
    .name('Distance') 

torusknotfolder
    .add(uiObject, 'rotationSpeed')
    .min(0)
    .max(10)
    .step(0.1)
    .name('Rotation')

//plane UI
const planefolder = ui.addFolder('Plane') 

planefolder
    .add(planeMaterial, 'wireframe')
    .name("Toggle WireFrame") 




/********************
** ANIMATION LOOP **
*********************/
const clock = new THREE.Clock()

const animation = () =>
{
    
    //Return elapasedTime
    const elapsedTime = clock.getElapsedTime()

    //Animate 
    testTorusKnot.position.y = Math.sin(elapsedTime * uiObject.speed) * uiObject.distance 
    
    // Rotation
    testTorusKnot.rotation.x = elapsedTime * uiObject.rotationSpeed * 0.5
    testTorusKnot.rotation.y = elapsedTime * uiObject.rotationSpeed * 0.5
    //Update OrbitControls
    controls.update()

    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation() 