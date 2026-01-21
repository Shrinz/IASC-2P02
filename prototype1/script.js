import * as THREE from 'three';

/***********
 ** SCENE **
 ***********/
//Canavas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('blanchedalmond')

//Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
scene.add(camera)
camera.position.set(0, 0, 5)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

/********************
** MESHES **
*********************/
//testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

scene.add(testSphere)

/********************
** MESHES (square) **
*********************/
const squareGeometry = new THREE.BoxGeometry(1)
const squareMaterial = new THREE.MeshNormalMaterial()
const testSquare = new  THREE.Mesh(squareGeometry, squareMaterial)

testSquare.position.x = 2

scene.add(testSquare)

/********************
** ANIMATION LOOP **
*********************/
const clock = new THREE.Clock()

const animation = () =>
{
    
    //Return elapasedTime
    const elapsedTime = clock.getElapsedTime()
   
    //Animate testSphere
    testSphere.position.y = Math.sin(elapsedTime*2) * 2

    testSquare.position.x = Math.sin(elapsedTime / 2) * 3
    testSquare.position.z = Math.cos(elapsedTime / 2) * 3
    //Renderer
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation)
}

animation() 