
import * as THREE from 'three'
import {GUI} from "dat.gui";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import {TransformControls} from "three/examples/jsm/controls/TransformControls.js";
import * as CANNON from 'cannon';



const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
// canvas 
const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60 , WIDTH / HEIGHT, 0.1, 1000);

// renders in canvas
const renderer = new THREE.WebGLRenderer({canvas: canvas});

// antialias: -40 fps
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x444444, 1); // arkaplan rengi


var objects = [];

// LOADS GLTF MODELS
var table, newlamp, greenrock;

// texture loader with set path of textures folder
const loader = new GLTFLoader();
loader.load('table/scene.gltf', function (gltf) {
    table = gltf.scene;
    table.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            //node.receiveShadow = true;
        }
    });
    table.scale.set(0.08, 0.08, 0.08);
    table.position.set(0, -15, 10);

    const tableShape = new CANNON.Plane();
    const tableBody = new CANNON.Body({ mass: 0 }); // mass 0 makes the body static
    tableBody.addShape(tableShape);
    tableBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Make the plane horizontal
    world.addBody(tableBody);

    scene.add(table);
});

loader.load('oldlamp/scene.gltf', function (gltf) {
    newlamp = gltf.scene;
    newlamp.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            //node.receiveShadow = true;
        }
    });
    newlamp.scale.set(0.3, 0.3, 0.3);
    newlamp.position.set(0, 25, 10);
    newlamp.rotation.set(0, Math.PI/2, 0)
    scene.add(newlamp);
});

function loadModel(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, (gltf) => {
            resolve(gltf.scene);
        }, undefined, reject);
    });
}

let greenrockBody;

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // m/s²

loadModel('greenrock/scene.gltf').then((model) => {
    greenrock = model;
    greenrock.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
        }
    });
    greenrock.scale.set(1.5, 1.5, 1.5);
    greenrock.position.set(0, 15, 10);
    scene.add(greenrock);

    // Create a box body for the greenrock
    const greenrockShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)); // Replace with the actual size of the greenrock
    greenrockBody = new CANNON.Body({ mass: 3}); // Replace with the actual mass of the greenrock
    greenrockBody.addShape(greenrockShape);
    greenrockBody.position.copy(greenrock.position);
    world.addBody(greenrockBody);

    // You can use greenrock and greenrockBody here
}).catch((error) => {
    console.error('Error loading model:', error);
});

var textureLoader = new THREE.TextureLoader().setPath('textures/');

// front wall
textureLoader.load('texttable.png', function(texture) {
    // Create the geometry and material
    var geometry = new THREE.PlaneGeometry(100, 70); // Adjust the size as needed
    var material = new THREE.MeshStandardMaterial({ map: texture });

    // Create the mesh and add it to the scene
    var wall = new THREE.Mesh(geometry, material);
    wall.position.set(0, 20, -20); // Adjust the position as needed
    scene.add(wall);
});

// left wall up
textureLoader.load('walltext.png', function(texture) {
    var geometry = new THREE.PlaneGeometry(70, 70); 
    var material = new THREE.MeshStandardMaterial({ map: texture });
                    
    var wall = new THREE.Mesh(geometry, material);
    wall.position.set(-50, 20, 2); 
    wall.rotation.set(0, Math.PI/2, 0);
    scene.add(wall);
});


// right wall
textureLoader.load('walltext.png', function(texture) {
    // Create the geometry and material
    var geometry = new THREE.PlaneGeometry(70, 70); // Adjust the size as needed
    var material = new THREE.MeshStandardMaterial({ map: texture });

    // Create the mesh and add it to the scene
    var wall = new THREE.Mesh(geometry, material);
    wall.position.set(50, 20, 2); // Adjust the position as needed
    wall.rotation.set(0, -Math.PI/2, 0);
    scene.add(wall);
});

// floor texture
textureLoader.load('floortext.jpg', function(texture) {
    // Create the geometry and material
    var geometry = new THREE.PlaneGeometry(100, 70); // Adjust the size as needed
    var material = new THREE.MeshStandardMaterial({ map: texture });

    // Create the mesh and add it to the scene
    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.set(-Math.PI / 2, 0, 0);
    floor.receiveShadow = true;
    floor.position.set(0, -15, 0); // Adjust the position as needed
    scene.add(floor);
});

// ceiling texture
textureLoader.load('ceilingtext.png', function(texture) {
    // Create the geometry and material
    var geometry = new THREE.PlaneGeometry(100, 60); // Adjust the size as needed
    var material = new THREE.MeshStandardMaterial({ map: texture });

    var ceiling = new THREE.Mesh(geometry, material);
    ceiling.rotation.set(Math.PI / 2, 0, 0);
    ceiling.position.set(0, 55, 0); // Adjust the position as needed
    scene.add(ceiling);
});

const spotlight = new THREE.SpotLight(0xffff00, 250, 20, Math.PI / 4, 0.25, 1);
// Position the spotlight above the table
spotlight.position.set(0, 10, 10);
spotlight.castShadow = true;
// Point the spotlight at the table
spotlight.target.position.set(0, 0, 10);
scene.add(spotlight);

const spotlighthelper = new THREE.SpotLightHelper( spotlight );
//scene.add( spotlighthelper );

// ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientlight);

// light for the lamps emitting light
const rectlight = new THREE.RectAreaLight(0xffff00, 20, 25, 5);
rectlight.position.set(0, 15, 10);
rectlight.lookAt(0, 0, 10);
scene.add(rectlight);


// directional light
const directionallight = new THREE.DirectionalLight(0xffffff, 5);
directionallight.position.set(0, 24, 0);
directionallight.castShadow = true;

// Adjust the shadow camera's frustum
directionallight.shadow.camera.left = -45; // Adjust as needed
directionallight.shadow.camera.right = 45; // Adjust as needed
directionallight.shadow.camera.top = 45; // Adjust as needed
directionallight.shadow.camera.bottom = -45; // Adjust as needed
directionallight.shadow.camera.near = 0.1; // Adjust as needed
directionallight.shadow.camera.far = 50; // Adjust as needed
directionallight.shadow.mapSize.width = 1024; // Adjust as needed
directionallight.shadow.mapSize.height = 1024; // Adjust as needed
const shadowCameraHelper = new THREE.CameraHelper(directionallight.shadow.camera);
//scene.add(shadowCameraHelper);
const directionallighthelper = new THREE.DirectionalLightHelper( directionallight, 20, 0xff0000);
//scene.add( directionallighthelper );
scene.add(directionallight);

// GUI FOR LIGHTS AND STATS
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const gui = new GUI();
gui.width = 320;

gui.add({name: 'Spotlight X', value: spotlight.position.x}, 'value', -100, 100)
    .name('Spotlight X')
    .onChange(function(value) {
        spotlight.position.x = value;
    });

gui.add({name: 'Spotlight Y', value: spotlight.position.y}, 'value', -100, 100)
    .name('Spotlight Y')
    .onChange(function(value) {
        spotlight.position.y = value;
    });

gui.add({name: 'Spotlight Z', value: spotlight.position.z}, 'value', -100, 100)
    .name('Spotlight Z')
    .onChange(function(value) {
        spotlight.position.z = value;
    });

    gui.add({name: 'Spotlight Rotation X', value: spotlight.target.position.x}, 'value', -90, 100)
    .name('Spotlight Rotation X')
    .onChange(function(value) {
        spotlight.target.position.x = value;
    });

gui.add({name: 'Spotlight Rotation Y', value: spotlight.target.position.y}, 'value', -Math.PI, Math.PI)
    .name('Spotlight Rotation Y')
    .onChange(function(value) {
        spotlight.target.position.y = value;
    });

gui.add({name: 'Spotlight Rotation Z', value: spotlight.target.position.z}, 'value', -20, 20)
    .name('Spotlight Rotation Z')
    .onChange(function(value) {
        spotlight.target.position.z = value;
    });

gui.add({name: 'Spotlight Intensity', value: spotlight.intensity}, 'value', 0, 1000)
    .name('Spotlight Intensity')
    .onChange(function(value) {
        spotlight.intensity = value;
    });

// shader for camera
var customShader = {
    uniforms: {
        "tDiffuse": { value: null },
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

// CAMERA VARIABLES

var customPass = new ShaderPass(customShader);

// Create an EffectComposer
var composer = new EffectComposer(renderer);

// Add a RenderPass to render the scene
composer.addPass(new RenderPass(scene, camera));

// Add your custom ShaderPass
composer.addPass(customPass);

var speed = 0.0005; // Adjust this value to change the speed of rotation
var pitchObject = new THREE.Object3D();
var yawObject = new THREE.Object3D();

camera.rotation.set(0, 0, 0);
camera.position.set(0, 0, 0);

// Adjust the camera's near and far values
camera.near = 0.01;
camera.far = 1000;
camera.updateProjectionMatrix();

yawObject.position.set(0, 3, 25); // Set the initial position of yawObject
yawObject.add(pitchObject);
pitchObject.add(camera);

// Add yawObject to the scene instead of the camera
scene.add(yawObject);


//Update the mouse position
// document.addEventListener('click', function() {
//     document.body.requestPointerLock();
// }, false);


// Update the camera rotation when the mouse moves
document.addEventListener('mousemove', function(event) {
    if (document.pointerLockElement === document.body) {
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        var newYaw = yawObject.rotation.y - movementX * speed;
        var newPitch = pitchObject.rotation.x - movementY * speed;

        // Constrain the yaw and pitch
        var maxAngle = Math.PI / 6; // 30 degrees
        yawObject.rotation.y = Math.max(-maxAngle, Math.min(maxAngle, newYaw));
        pitchObject.rotation.x = Math.max(-maxAngle, Math.min(maxAngle, newPitch));
    }
}, false);


// keyboard camera for debugging
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

let isDragging = false;

const dragcontrols = new DragControls(objects, camera, renderer.domElement);
const transformcontrols = new TransformControls(camera, renderer.domElement);

scene.add(transformcontrols);

dragcontrols.addEventListener('dragstart', function (event) {
    event.object.material.emissive.set(0xffffff);
    greenrockBody.type = CANNON.Body.KINEMATIC;
    isDragging = true;
});

dragcontrols.addEventListener('drag', function (event) {
    // When you drag the object, update the position of the physics body to match the position of the object
    greenrockBody.position.copy(greenrock.position);
});

dragcontrols.addEventListener('dragend', function (event) {
    event.object.material.emissive.set(0x000000);
    greenrockBody.type = CANNON.Body.DYNAMIC;
    isDragging = false;
});

dragcontrols.addEventListener('hoveron', function (event) {
    console.log("üstündeyim");
})

// Listen for mousedown events
renderer.domElement.addEventListener('mousedown', function (event) {
    if (isDragging) {
        transformcontrols.attach(dragcontrols.object);
        transformcontrols.setMode('rotate');
    }
});

// Listen for mouseup events
renderer.domElement.addEventListener('mouseup', function (event) {
    transformcontrols.detach();
});


// 60 fps lock 
let then = performance.now();
const fpsInterval = 1000 / 60;

// render function
function render(now){
    const elapsed = now - then;
    
    if (elapsed < fpsInterval) {
        requestAnimationFrame(render);
        return;
    }

    then = now - (elapsed % fpsInterval);

    const tick = () =>{
        stats.begin();
        world.step(1 / 60);

        if (greenrock && greenrockBody) {
            greenrock.position.copy(greenrockBody.position);
            greenrock.quaternion.copy(greenrockBody.quaternion);
        }

        composer.render();
        stats.end();
    }
    tick();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
