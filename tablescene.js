
import * as THREE from 'three'
import {GUI} from "dat.gui";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

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

const gltfLoader = new GLTFLoader();

// Load ship
// gltfLoader.load('textures/ships/scene.gltf', function(gltf) {
//     // The loaded object is a group (or a scene), so you can just add it to your scene
//     const mesh = gltf.scene;
//     mesh.traverse((child) => {
//         if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//         }
//     })
//     // If you want to adjust the position, scale, or rotation, you can do so here
//     // For example:
//     gltf.scene.position.set(10, 0, 10);
//     // gltf.scene.scale.set(1, 1, 1);
//     // gltf.scene.rotation.set(0, 0, 0);
//     scene.add(mesh);
// }, undefined, function(error) {
//     console.error(error);
// });

// raw means no built in uniforms or attributes
// let shadermaterial = new THREE.RawShaderMaterial({
//     vertexShader: vertexShaderSource,
//     fragmentShader: fragmentShaderSource
// });



// var texture = textureLoader.load('walltext.png');

// LOADER FOR OBJ AND MTL FILES
// Create the loaders
// var mtlLoader = new MTLLoader();
// var objLoader = new OBJLoader();

// // Load the MTL file
// mtlLoader.load('textures/OBJ/Wall_1.mtl', function(materials) {
//     materials.preload();

//     // Set the materials for the OBJ loader
//     objLoader.setMaterials(materials);

//     // Load the OBJ file
//     objLoader.load('textures/OBJ/Wall_1.obj', function(object) {
//         // Enable shadows for the object
//         object.traverse(function(node) {
//             if (node instanceof THREE.Mesh) {
//                 node.castShadow = true;
//                 node.receiveShadow = true;

//                 if (node.geometry.attributes.uv) {
//                     console.log('UVs:', node.geometry.attributes.uv.array);
//                 } else {
//                     console.log('No UVs found for this mesh');
//                 }

//             // Create a new material with the texture and apply it to the mesh
//             var material = new THREE.MeshStandardMaterial({ map: texture });
//             node.material = material;
//             }
//         });

//         // Add the object to the scene
//         scene.add(object);
//     });
// });


// LOADS GLTF MODELS
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

// enable shadows for objects
function enableShadows(gltf) {
    gltf.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            //node.receiveShadow = true;
        }
    });
}

// texture loader with set path of textures folder
var textureLoader = new THREE.TextureLoader().setPath('textures/');

// ASYNC LOAD OBJECTS
Promise.all([
    loadModel('table/scene.gltf'),
    loadModel('hanging/scene.gltf')
]).then(([table, lamp]) => {
    
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


    table.scale.set(0.08, 0.08, 0.08);
    table.position.set(0, -15, 10);
    scene.add(table);

   
    lamp.scale.set(3, 3, 2);
    lamp.position.set(0, 25, 10);
    scene.add(lamp);

    enableShadows(table);
    enableShadows(lamp);
}).catch((error) => {
    console.error(error);
});


// LIGHTS
//point light
const pointlight = new THREE.PointLight(0xffffff, 100, 100);
pointlight.position.set(0,2,10);
pointlight.castShadow = true;
scene.add(pointlight);
const pointlighthelper = new THREE.PointLightHelper( pointlight, 10, 0xff0000 );
scene.add( pointlighthelper );

// const spotlight = new THREE.SpotLight(0xffffff, 10, 100, 0, 0.5, 1);
// spotlight.position.set(0,0,0);
// spotlight.castShadow = true;
// scene.add(spotlight);
// const spotlighthelper = new THREE.SpotLightHelper( spotlight );
// scene.add( spotlighthelper );

// const rectlight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
// rectlight.position.set(0, 25, 0);
// rectlight.lookAt(0, 0, 0);
// rectlight.castShadow = true;
// scene.add(rectlight);
// const rectlighthelper = new THREE.RectAreaLightHelper( rectlight );
// scene.add( rectlighthelper );

// ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientlight);

// directional light
const directionallight = new THREE.DirectionalLight(0xffffff, 2);
directionallight.position.set(0, 24, 0);

//directionallight.target.position.set(0,0,0);
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

// gui.add({name: 'Spotlight X', value: spotlight.position.x}, 'value', -100, 100)
//     .name('Spotlight X')
//     .onChange(function(value) {
//         spotlight.position.x = value;
//     });

// gui.add({name: 'Spotlight Y', value: spotlight.position.y}, 'value', -100, 100)
//     .name('Spotlight Y')
//     .onChange(function(value) {
//         spotlight.position.y = value;
//     });

// gui.add({name: 'Spotlight Z', value: spotlight.position.z}, 'value', -100, 100)
//     .name('Spotlight Z')
//     .onChange(function(value) {
//         spotlight.position.z = value;
//     });

// gui.add({name: 'Spotlight Intensity', value: spotlight.intensity}, 'value', 0, 1000)
//     .name('Spotlight Intensity')
//     .onChange(function(value) {
//         spotlight.intensity = value;
//     });

    
gui.add({name: 'Directional Light X', value: directionallight.position.x}, 'value', -100, 100)
.name('Directional Light X')
.onChange(function(value) {
    directionallight.position.x = value;
});

gui.add({name: 'Directional Light Y', value: directionallight.position.y}, 'value', -100, 100)
.name('Directional Light Y')
.onChange(function(value) {
    directionallight.position.y = value;
});

gui.add({name: 'Directional Light Z', value: directionallight.position.z}, 'value', -100, 100)
.name('Directional Light Z')
.onChange(function(value) {
    directionallight.position.z = value;
});

gui.add({name: 'Point Light X', value: pointlight.position.x}, 'value', -100, 100)
.name('Point Light X')
.onChange(function(value) {
    pointlight.position.x = value;
});

gui.add({name: 'Point Light Y', value: pointlight.position.y}, 'value', -100, 100)
.name('Point Light Y')
.onChange(function(value) {
    pointlight.position.y = value;
});

gui.add({name: 'Point Light Z', value: pointlight.position.z}, 'value', -100, 100)
.name('Point Light Z')
.onChange(function(value) {
    pointlight.position.z = value;
});

gui.add({name: 'Point Light Intensity', value: pointlight.intensity}, 'value', 0, 1000)
.name('Point Light Intensity')
.onChange(function(value) {
    pointlight.intensity = value;
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
camera.near = 0.1;
camera.far = 1000;
camera.updateProjectionMatrix();

yawObject.position.set(0, 3, 25); // Set the initial position of yawObject
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
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'sounds/ambience.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.7 );
	sound.play();
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
        composer.render();
        stats.end();
    }
    tick();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
