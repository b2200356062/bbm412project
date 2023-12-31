
import * as THREE from 'three'
import * as CANNON from 'cannon';
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';


export default function tableScene(){

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// canvas 
const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60 , WIDTH / HEIGHT, 0.1, 1000);

// renders in canvas
const renderer = new THREE.WebGLRenderer({canvas: canvas, powerPreference: "high-performance"});

// antialias: -40 fps
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000, 1); // arkaplan rengi

// objects
var objects = [];
var table, newlamp, greenrock, bin;

// world for physics
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // m/s²

// texture loader with set path of textures folder
const loader = new GLTFLoader();
loader.load('table/scene.gltf', function (gltf) {
    table = gltf.scene;
    table.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    table.scale.set(0.05, 0.08, 0.08);
    table.position.set(0, -15, 10);

    // Calculate the bounding box of the table
    const box = new THREE.Box3().setFromObject(table);
    const size = box.getSize(new THREE.Vector3());

    // Create a box shape for the table with the actual size of the table
    const tableShape = new CANNON.Box(new CANNON.Vec3(size.x / 2.2, size.y / 1.3, size.z/2));

    // Create a body for the table and add the shape to it
    const tableBody = new CANNON.Body({ mass: 0 }); // The table is static, so its mass is 0
    tableBody.addShape(tableShape);
    tableBody.position.copy(table.position);
    world.addBody(tableBody);

    scene.add(table);
});

loader.load('oldlamp/scene.gltf', function (gltf) {
    newlamp = gltf.scene;
    newlamp.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            //node.castShadow = true;
            //node.receiveShadow = true;
        }
    });
    newlamp.scale.set(0.3, 0.3, 0.3);
    newlamp.position.set(0, 25, 10);
    newlamp.rotation.set(0, Math.PI/2, 0)
    scene.add(newlamp);
});


// async loader for greenrock 
function loadModel(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, (gltf) => {
            resolve(gltf.scene);
        }, undefined, reject);
    });
}

let greenrockBody;

loadModel('greenrock/scene.gltf').then((model) => {
    greenrock = model;
    greenrock.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
        }
    });
    greenrock.scale.set(1.5, 1.5, 1.5);
    greenrock.position.set(0, 5, 10);
    scene.add(greenrock);
    objects.push(greenrock);

    // Create a box body for the greenrock
    const greenrockShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)); // Replace with the actual size of the greenrock
    greenrockBody = new CANNON.Body({ mass: 3}); // Replace with the actual mass of the greenrock
    greenrockBody.addShape(greenrockShape);
    greenrockBody.position.copy(greenrock.position);
    world.addBody(greenrockBody);
    greenrockBody.collisionResponse = true;

}).catch((error) => {
    console.error('Error loading model:', error);
});

// bounding box for greenrock for debugging
// const boxGeometry = new THREE.BoxGeometry(2, 2, 2); // The size should be twice the size of the Cannon.js Vec3
// const boxMaterial = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(boxMesh);

var binBody, recycleBinMesh;

// recycle bin
loader.load('cop/scene.gltf', function (gltf) {
    bin = gltf.scene;
    bin.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    bin.scale.set(0.08, 0.08, 0.08);
    bin.position.set(17,-10, 17);
    
    scene.add(bin);

    const box = new THREE.Box3().setFromObject(bin);
    const size = box.getSize(new THREE.Vector3());

    const recycleBinShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    binBody = new CANNON.Body({ mass: 0 }); // The recycle bin is static, so its mass is 0
    binBody.addShape(recycleBinShape);
    binBody.position.copy(bin.position);
    world.addBody(binBody);

    binBody.collisionResponse = true;

    // // Create a box geometry for the recycle bin
    // const recycleBinGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    // const recycleBinMaterial = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
    // recycleBinMesh = new THREE.Mesh(recycleBinGeometry, recycleBinMaterial);
    // recycleBinMesh.position.copy(binBody.position);
    // console.log('Size:', size.x, size.y, size.z);
    // scene.add(recycleBinMesh);
});

    

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
    var geometry = new THREE.PlaneGeometry(100, 50); // Adjust the size as needed
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

const spotlight = new THREE.SpotLight(0xffff00, 250, 20, Math.PI / 4, 0.25, 1);
// Position the spotlight above the table
spotlight.position.set(0, 10, 10);
//spotlight.castShadow = true;
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
directionallight.shadow.camera.left = -50; // Adjust as needed
directionallight.shadow.camera.right = 50; // Adjust as needed
directionallight.shadow.camera.top = 50; // Adjust as needed
directionallight.shadow.camera.bottom = -50; // Adjust as needed
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

gui.add({name: 'Spotlight Intensity', value: spotlight.intensity}, 'value', 0, 500)
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
            gl_FragColor = color;
        }
    `
};

// CAMERA VARIABLES

var customPass = new ShaderPass(customShader);

var composer = new EffectComposer(renderer);

composer.addPass(new RenderPass(scene, camera));

composer.addPass(customPass);

var speed = 0.0005;
var pitchObject = new THREE.Object3D();
var yawObject = new THREE.Object3D();

camera.rotation.set(0, 0, 0);
camera.position.set(0, 0, 0);

camera.near = 0.01;
camera.far = 1000;
camera.updateProjectionMatrix();

yawObject.position.set(0, 3, 25); // Set the initial position of yawObject
yawObject.add(pitchObject);
pitchObject.add(camera);

// Add yawObject to the scene instead of the camera
scene.add(yawObject);

//Update the mouse position
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
            break;
        case 'KeyD':
            camera.position.x += 5;
            break;
        case 'KeyW':
            camera.position.z -= 5;
            break;
        case 'KeyS':
            camera.position.z += 5;
            break;
        case 'KeyQ':
            camera.position.y += 5;
            break;
        case 'KeyE':
            camera.position.y -= 5;
            break;
    }
});

// algorithm for the collision detection
let isDragging = false;
let isPhysicsPaused = false;
let plane = new THREE.Plane();
let raycaster = new THREE.Raycaster();
let offset = new THREE.Vector3();
let intersection = new THREE.Vector3();
let mouse = new THREE.Vector2();

renderer.domElement.addEventListener('mousedown', function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectBox(new THREE.Box3().setFromObject(greenrock), intersection)) {
        isDragging = true;
        isPhysicsPaused = true;
        plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), intersection);
        if (raycaster.ray.intersectPlane(plane, intersection)) {
            offset.copy(intersection).sub(greenrock.position);
        }
    }
});

renderer.domElement.addEventListener('mousemove', function(event) {
    if (!isDragging){
     return;
    }
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(plane, intersection)) {
        greenrock.position.copy(intersection.sub(offset));
        greenrockBody.position.copy(greenrock.position); 
    }
});

let score = 0;

function objectRecycled() {
    score++;
    document.getElementById('points').textContent = 'Points: ' + score;
    
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

// collision for the greenrock and bin
renderer.domElement.addEventListener('mouseup', function(event) {
    isDragging = false;
    isPhysicsPaused = false;
    greenrockBody.type = CANNON.Body.DYNAMIC; // Set the body back to dynamic when the drag ends

    // greenrockBody.addEventListener("beginContact", function (event) {
    //     console.log("yuh");
    //     if (event.body === binBody) { // If the other body is the bin body
    //         objectRecycled();
    //         scene.remove(greenrock); // Remove the greenrock mesh from the scene
    //         world.remove(greenrockBody); // Remove the greenrock body from the physics world
    //     }
    // });

});
let isInBin = false;

// 60 fps lock 

function update(){
    // physics update
    if (!isPhysicsPaused) {
        world.step(1 / 60);
    } 
    if (greenrock && greenrockBody && bin) {
        
        // distance calculation for the colliison
        let distanceX = Math.abs(greenrockBody.position.x - binBody.position.x);
        let distanceY = Math.abs(greenrockBody.position.y - binBody.position.y);
        let distanceZ = Math.abs(greenrockBody.position.z - binBody.position.z);
    
        let sumHalfExtentsX = greenrockBody.shapes[0].halfExtents.x + binBody.shapes[0].halfExtents.x;
        let sumHalfExtentsY = greenrockBody.shapes[0].halfExtents.y + binBody.shapes[0].halfExtents.y;
        let sumHalfExtentsZ = greenrockBody.shapes[0].halfExtents.z + binBody.shapes[0].halfExtents.z;
    
        if (distanceX < sumHalfExtentsX && distanceY < sumHalfExtentsY && distanceZ < sumHalfExtentsZ) {
            if (!isInBin) {
                // The greenrockBody is colliding with the binBody
                scene.remove(greenrock); // Remove the greenrock mesh from the scene
                world.remove(greenrockBody); // Remove the greenrock body from the physics world
                objectRecycled();
                isInBin = true;
            }
        }
        greenrock.position.copy(greenrockBody.position);
        greenrock.quaternion.copy(greenrockBody.quaternion);
        // bounding box for greenrock for debugging
        // boxMesh.position.copy(greenrockBody.position);
        // boxMesh.quaternion.copy(greenrockBody.quaternion);
    }
    if (recycleBinMesh && binBody) {
        recycleBinMesh.position.copy(binBody.position);
        recycleBinMesh.quaternion.copy(binBody.quaternion);
    }

}
// render function
function render(){
    update();
    composer.render();
}




//requestAnimationFrame(render);
    return {scene, camera, render, update};
}


