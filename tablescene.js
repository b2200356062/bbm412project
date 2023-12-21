
import * as THREE from 'three'
import {GUI} from "dat.gui";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import {vertexShaderSource, fragmentShaderSource} from "./tableSceneShaders.js";
import {FirstPersonControls} from "three/addons/controls/FirstPersonControls.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
// canvas 
const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 0.1, 100);
// renders in canvas
const renderer = new THREE.WebGLRenderer({canvas: canvas});

// antialias: - 40 fps, kötü performans
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xeeeee, 1); // arkaplan rengi


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;


// raw means no built in uniforms or attributes
let shadermaterial = new THREE.RawShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource
});

function loadModel(path) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            resolve(gltf.scene);
        }, (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + " % loaded");
        }, (error) => {
            reject(error);
        });
    });
}

// Load the texture
var textureLoader = new THREE.TextureLoader();



Promise.all([
    loadModel('table/scene.gltf'),
    loadModel('hanging/scene.gltf')
]).then(([table, lamp]) => {

    scene.traverse((node) => {
        if(node instanceof THREE.Mesh){
            node.material = shadermaterial;
        }
    });
    
    textureLoader.load('texttable.png', function(texture) {
    // Create the geometry and material
    var geometry = new THREE.PlaneGeometry(300, 200); // Adjust the size as needed
    var material = new THREE.MeshBasicMaterial({ map: texture });

    // Create the mesh and add it to the scene
    var wall = new THREE.Mesh(geometry, material);
    wall.position.set(0, 10, -40); // Adjust the position as needed
    scene.add(wall);
    });

    textureLoader.load('wall.jpg', function(texture) {
        // Create the geometry and material
        var geometry = new THREE.PlaneGeometry(300, 300); // Adjust the size as needed
        var material = new THREE.MeshBasicMaterial({ map: texture });
    
        // Create the mesh and add it to the scene
        var floor = new THREE.Mesh(geometry, material);
        floor.rotation.set(-Math.PI / 2, 0, 0);
        floor.position.set(0, -15, 0); // Adjust the position as needed
        scene.add(floor);
        
    });

    table.scale.set(0.08, 0.08, 0.08);
    table.position.set(0, -15, 10);
    table.rotation.set(0, 0, 0);
    scene.add(table);

    lamp.position.set(0, 15, 0);
    lamp.scale.set(3, 3, 2);
    scene.add(lamp);
}).catch((error) => {
    console.error(error);
});

// const tableLoader = new GLTFLoader();
// tableLoader.load('table/scene.gltf', function (gltf){
//     scene.add(gltf.scene);

//     gltf.scene.scale.set(0.08,.08,.08);
//     gltf.scene.position.set(0,-15,10);
//     gltf.scene.rotation.set(0,0,0);

// }, function (xhr){
//     console.log((xhr.loaded/xhr.total * 100) + " %100 loaded")
// }, function (error){
//     console.log(error);
// } );


// // final - hanging lamp
// const lampLoader = new GLTFLoader();
// lampLoader.load('hanging/scene.gltf', (gltf) => {
//     const mesh = gltf.scene;
//     mesh.traverse((child) => {
//        if(child.isMesh){
//            child.castShadow = true;
//            child.receiveShadow = true;
//        }
//     });
//     mesh.position.set(0,15,0);
//     mesh.scale.set(3,3,2);
//     scene.add(mesh);
// });


// immediately use the texture for material creation

//const material = new THREE.MeshBasicMaterial( { map:texture } );


//directional light
const plight = new THREE.PointLight(0xffffff, 100);
plight.position.set(0,0,0);
plight.castShadow = true;

//scene.add(plight);


const spotlight = new THREE.SpotLight(0xffffff, 300);
spotlight.position.set(0,10,0);
spotlight.castShadow = true;

scene.add(spotlight);

// const dlight = new THREE.DirectionalLight(0xffffff, 5);
// dlight.position.set(0,1,0);
// dlight.rotation.set(0,0,0);
// dlight.castShadow = true;
// scene.add(dlight);

const alight = new THREE.AmbientLight(0xffffff, 5);
scene.add(alight);

// // fps counter
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const gui = new GUI();

// gui.add(plight.position, 'x', -100, 100);
// gui.add(plight.position, 'y', -100, 100);
// gui.add(plight.position, 'z', -100, 100);

// gui.add(dlight.position, 'x', -100, 100);
// gui.add(dlight.position, 'y', -100, 100);
// gui.add(dlight.position, 'z', -100, 100);

gui.add(spotlight.position, 'x', -100, 100);
gui.add(spotlight.position, 'y', -100, 100);
gui.add(spotlight.position, 'z', -100, 100);

var customShader = {
    uniforms: {
        "tDiffuse": { value: null }, // The render target texture
        // Add any additional uniforms you need
    },
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            // Modify the color using your custom shader logic
            gl_FragColor = color;
        }
    `
};

var customPass = new ShaderPass(customShader);

// Create an EffectComposer
var composer = new EffectComposer(renderer);

// Add a RenderPass to render the scene
composer.addPass(new RenderPass(scene, camera));

// Add your custom ShaderPass
composer.addPass(customPass);

var speed = 0.001; // Adjust this value to change the speed of rotation
var pitchObject = new THREE.Object3D();
var yawObject = new THREE.Object3D();

camera.rotation.set(0, 0, 0);
camera.position.set(0, 0, 0);

// Adjust the camera's near and far values
camera.near = 0.1;
camera.far = 1000;
camera.updateProjectionMatrix();

yawObject.position.set(0, 3, 30); // Set the initial position of yawObject
yawObject.add(pitchObject);
pitchObject.add(camera);

// Add yawObject to the scene instead of the camera
scene.add(yawObject);

// Update the mouse position
document.addEventListener('click', function() {
    document.body.requestPointerLock();
}, false);

// Update the camera rotation when the mouse moves
document.addEventListener('mousemove', function(event) {
    if (document.pointerLockElement === document.body) {
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        var newYaw = yawObject.rotation.y - movementX * speed;
        var newPitch = pitchObject.rotation.x - movementY * speed;

        // Constrain the yaw and pitch
        var maxAngle = Math.PI / 9; // 30 degrees
        yawObject.rotation.y = Math.max(-maxAngle, Math.min(maxAngle, newYaw));
        pitchObject.rotation.x = Math.max(-maxAngle, Math.min(maxAngle, newPitch));
    }
}, false);

window.addEventListener('keydown', (event) =>{
    switch (event.code){
        case 'KeyA':
            camera.position.x -= 5;
            //cube.position.x -= 5;
            break;
        case 'KeyD':
            camera.position.x += 5;
            //cube.position.x += 5;
            break;
        case 'KeyW':
            camera.position.z -= 5;
            //cube.position.y += 5;was
            break;
        case 'KeyS':
            camera.position.z += 5;
            //cube.position.y -= 5;
            break;
        case 'KeyQ':
            // mouse q ve e yi overrideliyor
            camera.position.y += 5;
            //cube.position.z += 5;
            break;
        case 'KeyE':
            camera.position.y -= 5;
            break;
    }
});

// render function
function render(){
    const tick = () =>{
        stats.begin();
        requestAnimationFrame(render);
        composer.render();
        
        stats.end();
    }
    tick();
}

requestAnimationFrame(render);
