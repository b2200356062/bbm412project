
import * as THREE from 'three'
import * as CANNON from 'cannon';
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

export default function tableScene(){

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// canvas 
const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60 , WIDTH / HEIGHT, 0.1, 100);

camera.position.set(0, 5, 30);
// renders in canvas
const renderer = new THREE.WebGLRenderer({canvas: canvas, powerPreference: "high-performance"});

// antialias: -40 fps
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000, 1); // arkaplan rengi

// Create a div element
var div = document.createElement('div');
div.style.position = 'absolute';
div.style.top = '40px';
div.style.left = '10px';
div.style.width = '250px'; 
div.style.height = '600px'; 
div.style.backgroundImage = 'url(ui/card1/cardx1.png)';
div.style.backgroundSize = 'cover'; 
div.style.color = 'white'; 
div.style.padding = '40px';
div.style.fontFamily = 'monospace'; 
div.style.fontSize = 'large';

var text = document.createTextNode('Drop the objects into their respective bins to recycle them and help space be a cleaner place!');
var text1 = document.createTextNode('You can use arrow keys to change camera direction');
var text2 = document.createTextNode('You can use mouse to move objects');
var text3 = document.createTextNode('Press F to enter and exit the inspection mode');
var text4 = document.createTextNode('In inspection mode you can use mouse to rotate the object');
var text5 = document.createTextNode('You should put "" objects to "" bins, otherwise you will not get any points!');
var points = 0;
// Create a text node for the points
var pointsText = document.createTextNode('Points: ' + points);

div.appendChild(text);
var newline = document.createElement('div');
newline.style.height = '20px'; // Adjust the height as needed
div.appendChild(newline);
div.appendChild(text1);
var newline = document.createElement('div');
newline.style.height = '20px'; // Adjust the height as needed
div.appendChild(newline);
div.appendChild(text2);
var newline = document.createElement('div');
newline.style.height = '20px'; // Adjust the height as needed
div.appendChild(newline);
div.appendChild(text3);
var newline = document.createElement('div');
newline.style.height = '20px'; // Adjust the height as needed
div.appendChild(newline);
div.appendChild(text4);
var newline = document.createElement('div');
newline.style.height = '20px'; // Adjust the height as needed
div.appendChild(newline);
div.appendChild(text5);
var newline = document.createElement('div');
newline.style.height = '20px'; // Adjust the height as needed
div.appendChild(newline);
div.appendChild(pointsText);
document.body.appendChild(div);

// physics
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // m/s²

const loader = new GLTFLoader();
let objects = {};
let table, lamp, greenrock, bin, robot;

// load model function
function loadModel(name, path, position, scale, rotation, mass, castShadow, recieveShadow) {
    return new Promise((resolve, reject) => {        
        loader.load(path, function (gltf) {
            const model = gltf.scene;
            model.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = castShadow;
                    node.receiveShadow = recieveShadow;
                }
            });
            model.scale.set(scale.x, scale.y, scale.z);
            model.position.copy(position);
            model.rotation.copy(rotation);

            // Calculate the bounding box of the model
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
    
            if (name === 'table') {
                size.y *= 1.5;
            }

            // Create a box shape for the model with the actual size of the model
            const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));

            // Create a body for the model and add the shape to it
            const body = new CANNON.Body({ mass: mass });
            body.addShape(shape);
            body.position.copy(model.position);

            // Set the quaternion of the body using the Euler angles of the model
            body.quaternion.setFromEuler(model.rotation.x, model.rotation.y, model.rotation.z);

            world.addBody(body);

            scene.add(model);

            // Add the model and its body to the objects object
            objects[name] = { model: model, body: body };

            resolve({ model: model, body: body });
        }, undefined, function (error) {
            console.error('An error occurred while loading the model:', error);
            reject(error);
        });
    });
}
Promise.all([
    loadModel('table', 'table/scene.gltf', new THREE.Vector3(0, -15, 10), new THREE.Vector3(0.05, 0.08, 0.08), new THREE.Euler(0,0,0), 0, true, true),
    loadModel('lamp', 'oldlamp/scene.gltf', new THREE.Vector3(0, 25, 10), new THREE.Vector3(0.3, 0.3, 0.3), new THREE.Euler(0, Math.PI/2,0), 0, false, false),
    loadModel('greenrock', 'greenrock/scene.gltf', new THREE.Vector3(0, 3, 10), new THREE.Vector3(1.5, 1.5, 1.5), new THREE.Euler(0, 0, 0), 3, true, true),
    loadModel('bin', 'cop/scene.gltf', new THREE.Vector3(17, -10, 17), new THREE.Vector3(0.08, 0.08, 0.08), new THREE.Euler(0, 0, 0), 0, true, true),
    loadModel('robot', 'robot/scene.gltf', new THREE.Vector3(6, 0, 10), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, 0, 0), 5, true, true)
]).then(() => {

}).catch(console.error);

// TEXTURES
var textureLoader = new THREE.TextureLoader().setPath('textures/');

// front wall
textureLoader.load('texttable.png', function(texture) {
    // Create the geometry and material
    var geometry = new THREE.PlaneGeometry(100, 50); // Adjust the size as needed
    var material = new THREE.MeshStandardMaterial({ map: texture });

    // Create the mesh and add it to the scene
    var wall = new THREE.Mesh(geometry, material);
    wall.position.set(0, 10, -15); // Adjust the position as needed
    scene.add(wall);
});

// left wall up
textureLoader.load('walltext.png', function(texture) {
    var geometry = new THREE.PlaneGeometry(50, 50); 
    var material = new THREE.MeshStandardMaterial({ map: texture });
                    
    var wall = new THREE.Mesh(geometry, material);
    wall.position.set(-50, 10, 10); 
    wall.rotation.set(0, Math.PI/2, 0);
    scene.add(wall);
});


// right wall
textureLoader.load('walltext.png', function(texture) {
    // Create the geometry and material
    var geometry = new THREE.PlaneGeometry(50, 50); // Adjust the size as needed
    var material = new THREE.MeshStandardMaterial({ map: texture });

    // Create the mesh and add it to the scene
    var wall = new THREE.Mesh(geometry, material);
    wall.position.set(50, 10, 10); // Adjust the position as needed
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
    floor.position.set(0, -15, 10); // Adjust the position as needed
    scene.add(floor);

    let box = new THREE.Box3().setFromObject(floor);
    let size = box.getSize(new THREE.Vector3());

    // Create a box shape for the table with the actual size of the table
    const floorshape = new CANNON.Box(new CANNON.Vec3(size.x, size.y, size.z));

    // Create a body for the table and add the shape to it
    const floorbody = new CANNON.Body({ mass: 0 }); // The table is static, so its mass is 0
    floorbody.addShape(floorshape);
    floorbody.position.copy(floor.position);
    world.addBody(floorbody);
});

// ceiling texture
textureLoader.load('ceilingtext.png', function(texture) {
    // Create the geometry and material
    var geometry = new THREE.PlaneGeometry(100, 50); // Adjust the size as needed
    var material = new THREE.MeshStandardMaterial({ map: texture });

    var ceiling = new THREE.Mesh(geometry, material);
    ceiling.rotation.set(Math.PI / 2, 0, 0);
    ceiling.position.set(0, 35, 10); // Adjust the position as needed
    scene.add(ceiling);
});

// spotlight
const spotlight = new THREE.SpotLight(0xffff00, 250, 20, Math.PI / 4, 0.25, 1);
spotlight.position.set(0, 10, 10);
spotlight.target.position.set(0, 0, 10);
spotlight.castShadow = true;
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
const directionallight = new THREE.DirectionalLight(0xffffff, 3);
directionallight.position.set(0, 24, 0);
directionallight.castShadow = true;

// Adjust the shadow camera's frustum
directionallight.shadow.camera.left = -50; 
directionallight.shadow.camera.right = 50; 
directionallight.shadow.camera.top = 50; 
directionallight.shadow.camera.bottom = -50; 
directionallight.shadow.camera.near = 0.01; 
directionallight.shadow.camera.far = 50;
directionallight.shadow.mapSize.width = 1024; 
directionallight.shadow.mapSize.height = 1024;
const shadowCameraHelper = new THREE.CameraHelper(directionallight.shadow.camera);
//scene.add(shadowCameraHelper);
const directionallighthelper = new THREE.DirectionalLightHelper( directionallight, 20, 0xff0000);
//scene.add( directionallighthelper );
scene.add(directionallight);

// GUI FOR LIGHTS AND STATS
const gui = new GUI();
gui.width = 320;

gui.add({name: 'Spotlight X', value: spotlight.position.x}, 'value', -30, 30)
    .name('Spotlight X')
    .onChange(function(value) {
        spotlight.position.x = value;
    });

gui.add({name: 'Spotlight Y', value: spotlight.position.y}, 'value', -30, 50)
    .name('Spotlight Y')
    .onChange(function(value) {
        spotlight.position.y = value;
    });

gui.add({name: 'Spotlight Z', value: spotlight.position.z}, 'value', -30, 50)
    .name('Spotlight Z')
    .onChange(function(value) {
        spotlight.position.z = value;
    });

gui.add({name: 'Spotlight Intensity', value: spotlight.intensity}, 'value', 0, 500)
    .name('Spotlight Intensity')
    .onChange(function(value) {
        spotlight.intensity = value;
    });

var parameters = {
        'Spotlight Switch': true
    };
gui.add(parameters, 'Spotlight Switch')
    .name('Spotlight On/Off')
    .onChange(function(value) {
        spotlight.visible = value;
    });


//     gui.add({name: 'Spotlight Rotation X', value: spotlight.angle}, 'value', -90, 100)
//     .name('Spotlight Rotation X')
//     .onChange(function(value) {
//         spotlight.target.position.x = value;
//     });

// gui.add({name: 'Spotlight Rotation Y', value: spotlight.target.position.y}, 'value', -Math.PI, Math.PI)
//     .name('Spotlight Rotation Y')
//     .onChange(function(value) {
//         spotlight.target.position.y = value;
//     });

// gui.add({name: 'Spotlight Rotation Z', value: spotlight.target.position.z}, 'value', -20, 20)
//     .name('Spotlight Rotation Z')
//     .onChange(function(value) {
//         spotlight.target.position.z = value;
//     });



let lookAtVector = new THREE.Vector3(0, 0, -1);
camera.lookAt(lookAtVector);

// keyboard camera for debugging
window.addEventListener('keydown', (event) =>{
    switch (event.code){
        case 'KeyA':
            if(camera.position.x < -25){
                break;
            }
            camera.position.x -= 5;
            break;
        case 'KeyD':
            if(camera.position.x > 25){
                break;
            }
            camera.position.x += 5;
            break;
        case 'KeyW':
            if(camera.position.z < -50){
                break;
            }
            camera.position.z -= 5;
            break;
        case 'KeyS':
            if(camera.position.z > 50){
                break;
            }
            camera.position.z += 5;
            break;
        case 'KeyQ':
            if(camera.position.y > 25){
                break;
            }
            camera.position.y += 5;
            break;
        case 'KeyE':
            if(camera.position.y < -25){
                break;
            }
            camera.position.y -= 5;
            break;
        case 'ArrowUp':
            // Tilt the camera up
            if(lookAtVector.y > 25){
                break;
            }
            lookAtVector.y += 2;
            event.preventDefault();
            break;
        case 'ArrowDown':
            // Tilt the camera down
            if(lookAtVector.y < -25){
                break;
            }
            lookAtVector.y -= 2;
            event.preventDefault();
            break;
        case 'ArrowLeft':
            // Rotate the camera to the left
            if(lookAtVector.x < -25){
                break;
            }
            lookAtVector.x -= 2;
            event.preventDefault();
            break;
        case 'ArrowRight':
            // Rotate the camera to the right
            if(lookAtVector.x > 25){
                break;
            }
            lookAtVector.x += 2;
            event.preventDefault();
            break;
    }
    camera.lookAt(lookAtVector);
});


function objectRecycled() {

    points += 10; // Increase the points
    pointsText.nodeValue = 'Points: ' + points; // Update the points on the UI
    
    // sound effect
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sounds/yahoo.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setVolume(0.7);
        sound.play();
    });
}
var composer = new EffectComposer(renderer);
// Add a RenderPass
composer.addPass(new RenderPass(scene, camera));

// Add a Brightness/Contrast pass
var brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
brightnessContrastPass.uniforms['brightness'].value = 0 // Reduce brightness
brightnessContrastPass.uniforms['contrast'].value = 0 // Reduce contrast
composer.addPass(brightnessContrastPass);

let bokehPass = new BokehPass(scene, camera, {
    focus: camera.position.toDistance,
    aperture: 0.0025,
    maxblur: 0.01,
    width: WIDTH,
    height: HEIGHT
});

//composer.addPass(bokehPass);


let isInBin = false;
function update(){
    world.step(1 / 60);
    for (let name in objects) {
        objects[name].model.position.copy(objects[name].body.position);
        objects[name].model.quaternion.copy(objects[name].body.quaternion);
    }
}

// render function
function render(){
    composer.render();
}
// return to main 
return {scene, camera, render, update, gui};
}