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


// LIGHTS
//point light
// const pointlight = new THREE.PointLight(0xffffff, 1000, 100);
// pointlight.position.set(0,2,10);
// pointlight.castShadow = true;
// scene.add(pointlight);

// const pointLight = new THREE.PointLight(0xffffff, 1000, 100); // Adjust color, intensity, and distance as needed
// // Position the point light at the same location as the newlamp object
// pointLight.position.set(0, 24, 10);
// const pointlighthelper = new THREE.PointLightHelper( pointLight, 10, 0xff0000 );
// scene.add( pointlighthelper );
// // Add the point light to the scene
// scene.add(pointLight);

// gui.add({name: 'Directional Light X', value: directionallight.position.x}, 'value', -100, 100)
// .name('Directional Light X')
// .onChange(function(value) {
//     directionallight.position.x = value;
// });

// gui.add({name: 'Directional Light Y', value: directionallight.position.y}, 'value', -100, 100)
// .name('Directional Light Y')
// .onChange(function(value) {
//     directionallight.position.y = value;
// });

// gui.add({name: 'Directional Light Z', value: directionallight.position.z}, 'value', -100, 100)
// .name('Directional Light Z')
// .onChange(function(value) {
//     directionallight.position.z = value;
// });

// gui.add({name: 'Point Light X', value: pointlight.position.x}, 'value', -100, 100)
// .name('Point Light X')
// .onChange(function(value) {
//     pointlight.position.x = value;
// });

// gui.add({name: 'Point Light Y', value: pointlight.position.y}, 'value', -100, 100)
// .name('Point Light Y')
// .onChange(function(value) {
//     pointlight.position.y = value;
// });

// gui.add({name: 'Point Light Z', value: pointlight.position.z}, 'value', -100, 100)
// .name('Point Light Z')
// .onChange(function(value) {
//     pointlight.position.z = value;
// });

// gui.add({name: 'Point Light Intensity', value: pointlight.intensity}, 'value', 0, 1000)
// .name('Point Light Intensity')
// .onChange(function(value) {
//     pointlight.intensity = value;
// });

// gui.add({name: 'Point Light X', value: pointLight.position.x}, 'value', -100, 100)
// .name('Point Light X')
// .onChange(function(value) {
//     pointLight.position.x = value;
// });

// gui.add({name: 'Point Light Y', value: pointLight.position.y}, 'value', -100, 100)
// .name('Point Light Y')
// .onChange(function(value) {
//     pointLight.position.y = value;
// });

// gui.add({name: 'Point Light Z', value: pointLight.position.z}, 'value', -100, 100)
// .name('Point Light Z')
// .onChange(function(value) {
//     pointLight.position.z = value;
// });
// gui.add({name: 'Point Light Intensity', value: pointLight.intensity}, 'value', 0, 1000)
// .name('Point Light Intensity')
// .onChange(function(value) {
//     pointLight.intensity = value;
// });



// AUDIO
// const listener = new THREE.AudioListener();
// camera.add(listener);

// const sound = new THREE.Audio(listener);

// window.addEventListener('click', function() {
//     // Resume the AudioContext
//     listener.context.resume().then(() => {
//         // Start the audio inside the event handler
//         if (!sound.isPlaying) {
//             sound.play();
//         }
//     });
// });

// // load a sound and set it as the Audio object's buffer
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load('sounds/ambience.mp3', function(buffer) {
//     sound.setBuffer(buffer);
//     sound.setLoop(true);
//     sound.setVolume(0.7);
// });


// COLLISION WITH DRAG ( WORKING )
// let isDragging = false;
// let isPhysicsPaused = false;

// let plane = new THREE.Plane();
// let raycaster = new THREE.Raycaster();
// let offset = new THREE.Vector3();
// let intersection = new THREE.Vector3();
// let mouse = new THREE.Vector2();

// renderer.domElement.addEventListener('mousedown', function(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);
//     if (raycaster.ray.intersectBox(new THREE.Box3().setFromObject(greenrock), intersection)) {
//         isDragging = true;
//         isPhysicsPaused = true;
//         plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), intersection);
//         if (raycaster.ray.intersectPlane(plane, intersection)) {
//             offset.copy(intersection).sub(greenrock.position);
//         }
//     }
// });

// renderer.domElement.addEventListener('mousemove', function(event) {
//     if (!isDragging) return;
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);
//     if (raycaster.ray.intersectPlane(plane, intersection)) {
//         greenrock.position.copy(intersection.sub(offset));
//         greenrockBody.position.copy(greenrock.position);
//     }
// });

// renderer.domElement.addEventListener('mouseup', function(event) {
//     isDragging = false;
//     isPhysicsPaused = false;
//     greenrockBody.type = CANNON.Body.DYNAMIC; // Set the body back to dynamic when the drag ends
// });



// DRAG CONTROLS ( NOT WORKING )
// const dragcontrols = new DragControls(objects, camera, renderer.domElement);
// //const transformcontrols = new TransformControls(camera, renderer.domElement);

// //scene.add(transformcontrols);

// let originalPosition = new THREE.Vector3();

// dragcontrols.addEventListener('dragstart', function (event) {
//     event.object.material.emissive.set(0xffffff);
//     originalPosition.copy(event.object.position);
//     greenrockBody.type = CANNON.Body.STATIC;
//     isDragging = true;
// });

// const scaleFactor = 0.1; // Adjust this value to match the scales of your Three.js scene and Cannon.js world

// dragcontrols.addEventListener('drag', function (event) {
//     let displacement = event.object.position.clone().sub(originalPosition);
//     greenrockBody.position.copy(originalPosition).add(displacement);
// });
// dragcontrols.addEventListener('dragend', function (event) {
//     event.object.material.emissive.set(0x000000);
//     isDragging = false;
//     greenrockBody.type = CANNON.Body.DYNAMIC;
// });

// dragcontrols.addEventListener('hoveron', function (event) {

// });


// NEW MAIN JS
// import spaceScene  from './spacescene.js';
// import tableScene from './tablescene.js';
// import Stats from "three/addons/libs/stats.module.js";
// import * as THREE from 'three';

// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

// let renderer = new THREE.WebGLRenderer();

// let { render: tableRender, update: tableUpdate, camera: tableCamera } = tableScene();
// let { render: spaceRender, earthLoaded: earthloader, sunLoaded: sunloader, camera: spaceCamera } = spaceScene();

// let currentScene = 'table';
// let modelsLoaded = false;

// let renderFunctions = {
//     'table': tableRender,
//     'space': spaceRender
// };

// let updateFunctions = {
//     'table': tableUpdate,
//     'space': function() {
//         // update logic for space scene
//     }
// };

// Promise.all([earthloader, sunloader]).then(() => {
//     render();
//     modelsLoaded = true;
// }).catch((error) => {
//     console.error('An error occurred while loading the models:', error);
// });

// function switchScene(sceneName) {
//     // Check if the scene exists
//     if (renderFunctions[sceneName] && updateFunctions[sceneName]) {
//         // Switch to the new scene
//         currentScene = sceneName;
//     } else {
//         console.error('Scene not found:', sceneName);
//     }
// }

// window.addEventListener('keydown', (event) => {
//     if (event.key === '1') {
//         switchScene('table');

//     } else if (event.key === '2') {
//         switchScene('space');
//     }
// });

// let then = 0;
// let fpsInterval = 1000 / 60; // for 60 fps

// window.addEventListener('resize', function () {
//     // Update the camera's aspect ratio and projection matrix
//     if (currentScene === 'table') {
//         tableCamera.aspect = window.innerWidth / window.innerHeight;
//         tableCamera.updateProjectionMatrix();
//     } else if (currentScene === 'space') {
//         spaceCamera.aspect = window.innerWidth / window.innerHeight;
//         spaceCamera.updateProjectionMatrix();
//     }

//     // Update the renderer's size
//     renderFunctions[currentScene].setSize(window.innerWidth, window.innerHeight);
// });

// function render(now) {
//     const elapsed = now - then;
    
//     if (elapsed < fpsInterval) {
//         requestAnimationFrame(render);
//         return;
//     }
//     then = now - (elapsed % fpsInterval);

//     if (updateFunctions[currentScene]) {
//         updateFunctions[currentScene]();
//     }
//     if (renderFunctions[currentScene]) {
//         renderFunctions[currentScene]();
//     }
    
//     stats.update();
//     requestAnimationFrame(render);
// }

// algorithm for the collision detection
// let isDragging = false;
// let isPhysicsPaused = false;
// let plane = new THREE.Plane();
// let raycaster = new THREE.Raycaster();
// let offset = new THREE.Vector3();
// let intersection = new THREE.Vector3();
// let mouse = new THREE.Vector2();

// renderer.domElement.addEventListener('mousedown', function(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);
//     if (raycaster.ray.intersectBox(new THREE.Box3().setFromObject(greenrock), intersection)) {
//         isDragging = true;
//         isPhysicsPaused = true;
//         plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), intersection);
//         if (raycaster.ray.intersectPlane(plane, intersection)) {
//             offset.copy(intersection).sub(greenrock.position);
//         }
//     }
// });

// renderer.domElement.addEventListener('mousemove', function(event) {
//     if (!isDragging){
//      return;
//     }
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);
//     if (raycaster.ray.intersectPlane(plane, intersection)) {
//         greenrock.position.copy(intersection.sub(offset));
//         greenrockBody.position.copy(greenrock.position); 
//     }
// });

// GUI FOR SPOTLIGHT
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

//     gui.add({name: 'Spotlight Rotate X', value: spotlightObject.rotation.x}, 'value', 0,2 * Math.PI)
//     .name('Spotlight X')
//     .onChange(function(value) {
//         spotlightObject.rotation.x= value;
//     });

// gui.add({name: 'Spotlight Rotate Y', value: spotlightObject.rotation.y}, 'value', 0, 2 *Math.PI)
//     .name('Spotlight Y')
//     .onChange(function(value) {
//         spotlightObject.rotation.y = value;
//     });

// gui.add({name: 'Spotlight Rotate Z', value: spotlightObject.rotation.z}, 'value', 0, 2 * Math.PI)
//     .name('Spotlight Z')
//     .onChange(function(value) {
//         spotlightObject.rotation.z = value;
//     });


// shader for camera
// var customShader = {
//     uniforms: {
//         "tDiffuse": { value: null },
//     },
//     vertexShader: //         varying vec2 vUv;

//         void main() {
//             vUv = uv;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//     `,
//     fragmentShader: `
//         uniform sampler2D tDiffuse;
////         varying vec2 vUv;

//         void main() {
//             vec4 color = texture2D(tDiffuse, vUv);
//             gl_FragColor = color;
//         }
//     `
// };

// // CAMERA VARIABLES

// var customPass = new ShaderPass(customShader);

// var composer = new EffectComposer(renderer);

// composer.addPass(new RenderPass(scene, camera));

// composer.addPass(customPass);

// var speed = 0.0005;
// var pitchObject = new THREE.Object3D();
// var yawObject = new THREE.Object3D();

// camera.rotation.set(0, 0, 0);
// camera.position.set(0, 0, 0);

// camera.near = 0.01;
// camera.far = 1000;
// camera.updateProjectionMatrix();

// yawObject.position.set(0, 3, 25); // Set the initial position of yawObject
// yawObject.add(pitchObject);
// pitchObject.add(camera);

// // Add yawObject to the scene instead of the camera
// scene.add(yawObject);

//Update the mouse position
// document.addEventListener('click', function() {
//     document.body.requestPointerLock();
// }, false);

// // Update the camera rotation when the mouse moves
// document.addEventListener('mousemove', function(event) {
//     if (document.pointerLockElement === document.body) {
//         var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
//         var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

//         var newYaw = yawObject.rotation.y - movementX * speed;
//         var newPitch = pitchObject.rotation.x - movementY * speed;

//         // Constrain the yaw and pitch
//         var maxAngle = Math.PI / 6; // 30 degrees
//         yawObject.rotation.y = Math.max(-maxAngle, Math.min(maxAngle, newYaw));
//         pitchObject.rotation.x = Math.max(-maxAngle, Math.min(maxAngle, newPitch));
//     }
// }, false);


// // algorithm for the collision detection and dragging object
// let isDragging = false;
// let isPhysicsPaused = false;
// let plane = new THREE.Plane();
// let raycaster = new THREE.Raycaster();
// let offset = new THREE.Vector3();
// let intersection = new THREE.Vector3();
// let mouse = new THREE.Vector2();
// let isInspecting = false;
// let originalPosition = new THREE.Vector3();

// renderer.domElement.addEventListener('mousedown', function(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);
//     if (event.shiftKey && raycaster.ray.intersectBox(new THREE.Box3().setFromObject(greenrock), intersection)) {
//         // Enter inspection mode
//         isInspecting = true;
//         isRotating = true;
//         originalPosition.copy(greenrock.position);
//         greenrock.position.copy(camera.position);
//         plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), intersection);
//         if (raycaster.ray.intersectPlane(plane, intersection)) {
//             offset.copy(intersection).sub(greenrock.position);
//         }
//     }
// });

// renderer.domElement.addEventListener('mousemove', function(event) {
//     if (!isDragging && !isInspecting){
//         return;
//     }
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);
//     if (raycaster.ray.intersectPlane(plane, intersection)) {
//         greenrock.position.copy(intersection.sub(offset));
//         greenrockBody.position.copy(greenrock.position); 
//     }
//     if (isRotating) {
//         // Rotate the object with the mouse
//         greenrock.rotation.y += (event.movementX / window.innerWidth) * 2;
//         greenrock.rotation.x += (event.movementY / window.innerHeight) * 2;
//     }
// });

// // collision for the greenrock and bin
// renderer.domElement.addEventListener('mouseup', function(event) {
//     if (isInspecting) {
//         // Exit inspection mode
//         isInspecting = false;
//         isRotating = false;
//         greenrock.position.copy(originalPosition);
//     }
//     isDragging = false;
//     isPhysicsPaused = false;
//     greenrockBody.type = CANNON.Body.DYNAMIC; // Set the body back to dynamic when the drag ends

//     // greenrockBody.addEventListener("beginContact", function (event) {
//     //     console.log("yuh");
//     //     if (event.body === binBody) { // If the other body is the bin body
//     //         objectRecycled();
//     //         scene.remove(greenrock); // Remove the greenrock mesh from the scene
//     //         world.remove(greenrockBody); // Remove the greenrock body from the physics world
//     //     }
//     // });

// });


// // objects
// var objects = [];
// var table, newlamp, greenrock, bin;

// // world for physics
// const world = new CANNON.World();
// world.gravity.set(0, -9.82, 0); // m/s²

// // texture loader with set path of textures folder
// const loader = new GLTFLoader();
// loader.load('table/scene.gltf', function (gltf) {
//     table = gltf.scene;
//     table.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             node.castShadow = true;
//             node.receiveShadow = true;
//         }
//     });
//     table.scale.set(0.05, 0.08, 0.08);
//     table.position.set(0, -15, 10);

//     // Calculate the bounding box of the table
//     const box = new THREE.Box3().setFromObject(table);
//     const size = box.getSize(new THREE.Vector3());

//     // Create a box shape for the table with the actual size of the table
//     const tableShape = new CANNON.Box(new CANNON.Vec3(size.x / 2.2, size.y / 1.3, size.z/2));

//     // Create a body for the table and add the shape to it
//     const tableBody = new CANNON.Body({ mass: 0 }); // The table is static, so its mass is 0
//     tableBody.addShape(tableShape);
//     tableBody.position.copy(table.position);
//     world.addBody(tableBody);

//     scene.add(table);
// });

// loader.load('oldlamp/scene.gltf', function (gltf) {
//     newlamp = gltf.scene;
//     newlamp.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             //node.castShadow = true;
//             //node.receiveShadow = true;
//         }
//     });
//     newlamp.scale.set(0.3, 0.3, 0.3);
//     newlamp.position.set(0, 25, 10);
//     newlamp.rotation.set(0, Math.PI/2, 0)
//     scene.add(newlamp);
// });


// // async loader for greenrock 
// function loadModel(url) {
//     return new Promise((resolve, reject) => {
//         loader.load(url, (gltf) => {
//             resolve(gltf.scene);
//         }, undefined, reject);
//     });
// }

// let greenrockBody;

// loadModel('greenrock/scene.gltf').then((model) => {
//     greenrock = model;
//     greenrock.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             node.castShadow = true;
//         }
//     });
//     greenrock.scale.set(1.5, 1.5, 1.5);
//     greenrock.position.set(0, 5, 10);
//     scene.add(greenrock);
//     objects.push(greenrock);

//     // Create a box body for the greenrock
//     const greenrockShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)); // Replace with the actual size of the greenrock
//     greenrockBody = new CANNON.Body({ mass: 3}); // Replace with the actual mass of the greenrock
//     greenrockBody.addShape(greenrockShape);
//     greenrockBody.position.copy(greenrock.position);
//     world.addBody(greenrockBody);
//     greenrockBody.collisionResponse = true;

// }).catch((error) => {
//     console.error('Error loading model:', error);
// });

// // bounding box for greenrock for debugging
// // const boxGeometry = new THREE.BoxGeometry(2, 2, 2); // The size should be twice the size of the Cannon.js Vec3
// // const boxMaterial = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
// // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// // scene.add(boxMesh);

// var binBody, recycleBinMesh;

// // recycle bin
// loader.load('cop/scene.gltf', function (gltf) {
//     bin = gltf.scene;
//     bin.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             node.castShadow = true;
//             node.receiveShadow = true;
//         }
//     });
//     bin.scale.set(0.08, 0.08, 0.08);
//     bin.position.set(17,-10, 17);
    
//     scene.add(bin);

//     const box = new THREE.Box3().setFromObject(bin);
//     const size = box.getSize(new THREE.Vector3());

//     const recycleBinShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
//     binBody = new CANNON.Body({ mass: 0 }); // The recycle bin is static, so its mass is 0
//     binBody.addShape(recycleBinShape);
//     binBody.position.copy(bin.position);
//     world.addBody(binBody);

//     binBody.collisionResponse = true;

//     // // Create a box geometry for the recycle bin
//     // const recycleBinGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
//     // const recycleBinMaterial = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
//     // recycleBinMesh = new THREE.Mesh(recycleBinGeometry, recycleBinMaterial);
//     // recycleBinMesh.position.copy(binBody.position);
//     // console.log('Size:', size.x, size.y, size.z);
//     // scene.add(recycleBinMesh);
// });

    
// TABLESCENE YEDEK
// import * as THREE from 'three'
// import * as CANNON from 'cannon';
// import { GUI } from "dat.gui";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader.js';
// import {BokehPass} from 'three/examples/jsm/postprocessing/BokehPass.js';

// export default function tableScene(){

// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;

// // canvas 
// const canvas = document.querySelector('#canvas');
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 60 , WIDTH / HEIGHT, 0.1, 100);

// camera.position.set(0, 5, 30);
// // renders in canvas
// const renderer = new THREE.WebGLRenderer({canvas: canvas, powerPreference: "high-performance"});

// // antialias: -40 fps
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor(0x000000, 1); // arkaplan rengi

// // world for physics
// const world = new CANNON.World();
// world.gravity.set(0, -9.82, 0); // m/s²

// let objects = [];

// function loadModel(path) {
//     return new Promise((resolve, reject) => {
//         // Create a GLTFLoader
//         const loader = new GLTFLoader();

//         // Load the model
//         loader.load(
//             path,
//             (gltf) => {
//                 // When the model is loaded, resolve the promise with the scene
//                 resolve(gltf.scene);
//             },
//             undefined,
//             (error) => {
//                 // If there's an error, reject the promise with the error
//                 reject(error);
//             }
//         );
//     });
// }

// function loadObject(path, position, scale, mass) {
//     return new Promise((resolve, reject) => {
//         loadModel(path).then((model) => {
//             model.traverse((node) => {
//                 if (node instanceof THREE.Mesh) {
//                     node.castShadow = true;
//                 }
//             });
//             model.scale.set(scale.x, scale.y, scale.z);
//             model.position.set(position.x, position.y, position.z);
//             scene.add(model);

//             // Create a box body for the object
//             const shape = new CANNON.Box(new CANNON.Vec3(scale.x, scale.y, scale.z));
//             const body = new CANNON.Body({ mass: mass });
//             body.addShape(shape);
//             body.position.copy(model.position);
//             world.addBody(body);
//             body.collisionResponse = true;

//             // Add the model and its body to the objects array
//             objects.push({ model: model, body: body });

//             resolve({ model: model, body: body });
//         }).catch((error) => {
//             console.error('Error loading model:', error);
//             reject(error);
//         });
//     });
// }

// let greenrock, recyclebin, table, oldLamp;

// Promise.all([
//     loadObject('greenrock/scene.gltf', new THREE.Vector3(0, 5, 10), new THREE.Vector3(1.5, 1.5, 1.5), 3),
//     loadObject('cop/scene.gltf', new THREE.Vector3(0, 5, 10), new THREE.Vector3(0.7, 0.7, 0.7), 0),
//     loadObject('table/scene.gltf', new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.08, 0.08, 0.08), 0),
//     loadObject('oldlamp/scene.gltf', new THREE.Vector3(-20, 10, 10), new THREE.Vector3(0.1, 0.1, 0.1), 0),
//     // Add more loadObject calls for each object you want to load
// ]).then((loadedObjects) => {
//     [greenrock, recyclebin, table, oldLamp] = loadedObjects.map(object => object.model);
//     animate();
// }).catch((error) => {
//     console.error('Error loading objects:', error);
// });


// // TEXTURES
// var textureLoader = new THREE.TextureLoader().setPath('textures/');

// // front wall
// textureLoader.load('texttable.png', function(texture) {
//     // Create the geometry and material
//     var geometry = new THREE.PlaneGeometry(100, 50); // Adjust the size as needed
//     var material = new THREE.MeshStandardMaterial({ map: texture });

//     // Create the mesh and add it to the scene
//     var wall = new THREE.Mesh(geometry, material);
//     wall.position.set(0, 10, -15); // Adjust the position as needed
//     scene.add(wall);
// });

// // left wall up
// textureLoader.load('walltext.png', function(texture) {
//     var geometry = new THREE.PlaneGeometry(50, 50); 
//     var material = new THREE.MeshStandardMaterial({ map: texture });
                    
//     var wall = new THREE.Mesh(geometry, material);
//     wall.position.set(-50, 10, 10); 
//     wall.rotation.set(0, Math.PI/2, 0);
//     scene.add(wall);
// });


// // right wall
// textureLoader.load('walltext.png', function(texture) {
//     // Create the geometry and material
//     var geometry = new THREE.PlaneGeometry(50, 50); // Adjust the size as needed
//     var material = new THREE.MeshStandardMaterial({ map: texture });

//     // Create the mesh and add it to the scene
//     var wall = new THREE.Mesh(geometry, material);
//     wall.position.set(50, 10, 10); // Adjust the position as needed
//     wall.rotation.set(0, -Math.PI/2, 0);
//     scene.add(wall);
// });

// // floor texture
// textureLoader.load('floortext.jpg', function(texture) {
//     // Create the geometry and material
//     var geometry = new THREE.PlaneGeometry(100, 70); // Adjust the size as needed
//     var material = new THREE.MeshStandardMaterial({ map: texture });

//     // Create the floor and add it to the scene
//     var floor = new THREE.Mesh(geometry, material);
//     floor.rotation.set(-Math.PI / 2, 0, 0);
//     floor.receiveShadow = true;
//     floor.position.set(0, -15, 10); // Adjust the position as needed
//     scene.add(floor);

//     let box = new THREE.Box3().setFromObject(floor);
//     let size = box.getSize(new THREE.Vector3());

//     // Create a box shape for the table with the actual size of the table
//     const floorshape = new CANNON.Box(new CANNON.Vec3(size.x, size.y, size.z));

//     // Create a body for the table and add the shape to it
//     const floorbody = new CANNON.Body({ mass: 0 }); // The table is static, so its mass is 0
//     floorbody.addShape(floorshape);
//     floorbody.position.copy(floor.position);
//     world.addBody(floorbody);
// });

// // ceiling texture
// textureLoader.load('ceilingtext.png', function(texture) {
//     // Create the geometry and material
//     var geometry = new THREE.PlaneGeometry(100, 50); // Adjust the size as needed
//     var material = new THREE.MeshStandardMaterial({ map: texture });

//     var ceiling = new THREE.Mesh(geometry, material);
//     ceiling.rotation.set(Math.PI / 2, 0, 0);
//     ceiling.position.set(0, 35, 10); // Adjust the position as needed
//     scene.add(ceiling);
// });


// // spotlight
// const spotlight = new THREE.SpotLight(0xffff00, 250, 20, Math.PI / 4, 0.25, 1);
// spotlight.position.set(0, 10, 10);
// spotlight.target.position.set(0, 0, 10);
// scene.add(spotlight);
// const spotlighthelper = new THREE.SpotLightHelper( spotlight );
// //scene.add( spotlighthelper );

// // ambient light
// const ambientlight = new THREE.AmbientLight(0xffffff, 2);
// scene.add(ambientlight);

// // light for the lamps emitting light
// const rectlight = new THREE.RectAreaLight(0xffff00, 20, 25, 5);
// rectlight.position.set(0, 15, 10);
// rectlight.lookAt(0, 0, 10);
// scene.add(rectlight);

// // directional light
// const directionallight = new THREE.DirectionalLight(0xffffff, 3);
// directionallight.position.set(0, 24, 0);
// directionallight.castShadow = true;

// // Adjust the shadow camera's frustum
// directionallight.shadow.camera.left = -50; // Adjust as needed
// directionallight.shadow.camera.right = 50; // Adjust as needed
// directionallight.shadow.camera.top = 50; // Adjust as needed
// directionallight.shadow.camera.bottom = -50; // Adjust as needed
// directionallight.shadow.camera.near = 0.1; // Adjust as needed
// directionallight.shadow.camera.far = 50; // Adjust as needed
// directionallight.shadow.mapSize.width = 1024; // Adjust as needed
// directionallight.shadow.mapSize.height = 1024; // Adjust as needed
// const shadowCameraHelper = new THREE.CameraHelper(directionallight.shadow.camera);
// //scene.add(shadowCameraHelper);
// const directionallighthelper = new THREE.DirectionalLightHelper( directionallight, 20, 0xff0000);
// //scene.add( directionallighthelper );
// scene.add(directionallight);

// // const controls = new OrbitControls(camera, renderer.domElement);
// // controls.update();
// // controls.enableDamping = true;
// // controls.dampingFactor = 0.02;
// // controls.enablePan = false;
// // if(greenrock){
// //     controls.target = greenrock.position;
// // }

// // GUI FOR LIGHTS AND STATS
// const gui = new GUI();
// gui.width = 320;

// var parameters = {
//     'Spotlight Switch': true
// };

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

// //     gui.add({name: 'Spotlight Rotation X', value: spotlight.angle}, 'value', -90, 100)
// //     .name('Spotlight Rotation X')
// //     .onChange(function(value) {
// //         spotlight.target.position.x = value;
// //     });

// // gui.add({name: 'Spotlight Rotation Y', value: spotlight.target.position.y}, 'value', -Math.PI, Math.PI)
// //     .name('Spotlight Rotation Y')
// //     .onChange(function(value) {
// //         spotlight.target.position.y = value;
// //     });

// // gui.add({name: 'Spotlight Rotation Z', value: spotlight.target.position.z}, 'value', -20, 20)
// //     .name('Spotlight Rotation Z')
// //     .onChange(function(value) {
// //         spotlight.target.position.z = value;
// //     });

// gui.add({name: 'Spotlight Intensity', value: spotlight.intensity}, 'value', 0, 500)
//     .name('Spotlight Intensity')
//     .onChange(function(value) {
//         spotlight.intensity = value;
//     });
    
// gui.add(parameters, 'Spotlight Switch')
//     .name('Spotlight On/Off')
//     .onChange(function(value) {
//         spotlight.visible = value;
//     });


// let lookAtVector = new THREE.Vector3(0, 0, -1);
// camera.lookAt(lookAtVector);    
// // keyboard camera for debugging
// window.addEventListener('keydown', (event) =>{
//     switch (event.code){
//         case 'KeyA':
//             camera.position.x -= 5;
//             break;
//         case 'KeyD':
//             camera.position.x += 5;
//             break;
//         case 'KeyW':
//             camera.position.z -= 5;
//             break;
//         case 'KeyS':
//             camera.position.z += 5;
//             break;
//         case 'KeyQ':
//             camera.position.y += 5;
//             break;
//         case 'KeyE':
//             camera.position.y -= 5;
//             break;
//         case 'ArrowUp':
//             // Tilt the camera up
//             if(lookAtVector.y > 25){
//                 break;
//             }
//             lookAtVector.y += 2;
//             event.preventDefault();
//             break;
//         case 'ArrowDown':
//             // Tilt the camera down
//             if(lookAtVector.y < -25){
//                 break;
//             }
//             lookAtVector.y -= 2;
//             event.preventDefault();
//             break;
//         case 'ArrowLeft':
//             // Rotate the camera to the left
//             if(lookAtVector.x < -25){
//                 break;
//             }
//             lookAtVector.x -= 2;
//             event.preventDefault();
//             break;
//         case 'ArrowRight':
//             // Rotate the camera to the right
//             if(lookAtVector.x > 25){
//                 break;
//             }
//             lookAtVector.x += 2;
//             event.preventDefault();
//             break;
//     }
//     camera.lookAt(lookAtVector);
// });

// // algorithm for the collision detection, drag and rotation controls for the object

// let isDragging = false;
// let isPhysicsPaused = false;
// let isInspecting = false;
// let plane = new THREE.Plane();
// let raycaster = new THREE.Raycaster();
// let offset = new THREE.Vector3();
// let intersection = new THREE.Vector3();
// let mouse = new THREE.Vector2();
// let originalPosition = new THREE.Vector3();
// let originalRotation = new THREE.Quaternion();
// let initialRotation = new THREE.Quaternion();
// let originalMass;

// renderer.domElement.addEventListener('mousedown', function(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);
//     if (raycaster.ray.intersectBox(new THREE.Box3().setFromObject(greenrock), intersection)) {
//         isDragging = true;
//         originalMass = greenrockBody.mass; // Save the original mass
//         greenrockBody.mass = 0; // Set the mass to 0 to disable gravity
//         greenrockBody.updateMassProperties(); // Update the mass propertie
//         originalRotation.copy(greenrock.quaternion); // Save the current rotation
//         plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), intersection);
//         if (raycaster.ray.intersectPlane(plane, intersection)) {
//             offset.copy(intersection).sub(greenrock.position);
//         }
//     }
// });

// let progress = 0;
// let hasInspected = false;

// window.addEventListener('keydown', function(event) {
//     if (event.key === 'f' || event.key === 'F') {
//         if (isInspecting) {
//             // Exit inspection mode
//             console.log("exit");
//             isInspecting = false;
//             progress = 0; // Start the animation
//             originalRotation.copy(greenrock.quaternion); 
//             greenrockBody.position.copy(greenrock.position); // Update the body position
//             greenrockBody.velocity.set(0, 0, 0); // Reset the body velocity
//             greenrockBody.mass = originalMass; // Restore the original mass
//             greenrockBody.updateMassProperties(); // Update the mass properties
//             greenrockBody.type = CANNON.Body.DYNAMIC; // Set the body back to dynamic after a small delay
//             console.log(greenrockBody);
//         } 
//         else {
//             // Enter inspection mode
//             console.log("enter inspection");
//             isInspecting = true;
//             hasInspected = true;
//             originalPosition.copy(greenrock.position);
//             originalMass = greenrockBody.mass; // Save the original mass
//             greenrock.position.set(0, 5, 15); // Move the object to the desired position
//             greenrockBody.position.copy(greenrock.position);
//             greenrockBody.type = CANNON.Body.KINEMATIC; // Set the body to kinematic to control its position directly
//             greenrockBody.mass = 0; // Set the mass to 0 to disable gravity
//             greenrockBody.updateMassProperties(); // Update the mass properties
//         }
//     }
// });

// renderer.domElement.addEventListener('mousemove', function(event) {
//     if (isDragging) {
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//         raycaster.setFromCamera(mouse, camera);
//         if (raycaster.ray.intersectPlane(plane, intersection)) {
//             if (isInspecting) {
//                 // Rotate the object with the mouse
//                 let deltaRotationQuaternion = new THREE.Quaternion()
//                     .setFromEuler(new THREE.Euler(
//                         (event.movementY / window.innerHeight) * 4,
//                         (event.movementX / window.innerWidth) * 4,
//                         0,
//                         'XYZ'
//                     ));
//                 greenrock.quaternion.multiplyQuaternions(deltaRotationQuaternion, greenrock.quaternion);
//                 greenrockBody.quaternion.copy(greenrock.quaternion);
//             } else {
//                 greenrock.position.copy(intersection.sub(offset));
//                 greenrockBody.position.copy(greenrock.position);
//             }
//         }
//     }
// });

// renderer.domElement.addEventListener('mouseup', function(event) {
//     if (isDragging) {
//         isDragging = false;
//         if (!isInspecting) {
//             greenrockBody.mass = originalMass; // Restore the original mass
//             greenrockBody.updateMassProperties(); // Update the mass properties
//         }
//     }
// });

// let score = 0;

// function objectRecycled() {
//     score++;
//     document.getElementById('points').textContent = 'Points: ' + score;
    
//     // sound effect
//     const listener = new THREE.AudioListener();
//     camera.add(listener);

//     const sound = new THREE.Audio(listener);

//     // load a sound and set it as the Audio object's buffer
//     const audioLoader = new THREE.AudioLoader();
//     audioLoader.load('sounds/yahoo.mp3', function(buffer) {
//         sound.setBuffer(buffer);
//         sound.setVolume(0.7);
//         sound.play();
//     });
// }

// var composer = new EffectComposer(renderer);
// // Add a RenderPass
// composer.addPass(new RenderPass(scene, camera));

// // Add a Brightness/Contrast pass
// var brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
// brightnessContrastPass.uniforms['brightness'].value = 0 // Reduce brightness
// brightnessContrastPass.uniforms['contrast'].value = 0 // Reduce contrast
// composer.addPass(brightnessContrastPass);

// // if(greenrock){
// //     focusDistance = camera.position.distanceTo(greenrock.position);
// //     console.log(greenrock);
// // }

// // // depth of field effect
// // let bokehPass = new BokehPass(scene, camera, {
// //     focus: focusDistance,
// //     aperture: 0.0025,
// //     maxblur: 0.01,
// //     width: WIDTH,
// //     height: HEIGHT
// // });
// // composer.addPass(bokehPass);

// let isInBin = false;
// function update(){
//     // physics update
//     if (!isPhysicsPaused) {
//         world.step(1 / 60);
//     } 

//     objects.forEach((object) => {
//         if (object.model && object.body && recyclebin) {
//             // distance calculation for the collision
//             let distanceX = Math.abs(object.body.position.x - binBody.position.x);
//             let distanceY = Math.abs(object.body.position.y - binBody.position.y);
//             let distanceZ = Math.abs(object.body.position.z - binBody.position.z);

//             let sumHalfExtentsX = object.body.shapes[0].halfExtents.x + binBody.shapes[0].halfExtents.x;
//             let sumHalfExtentsY = object.body.shapes[0].halfExtents.y + binBody.shapes[0].halfExtents.y;
//             let sumHalfExtentsZ = object.body.shapes[0].halfExtents.z + binBody.shapes[0].halfExtents.z;

//             if (distanceX < sumHalfExtentsX && distanceY < sumHalfExtentsY && distanceZ < sumHalfExtentsZ) {
//                 if (!isInBin) {
//                     // The object body is colliding with the binBody
//                     scene.remove(object.model); // Remove the object mesh from the scene
//                     world.remove(object.body); // Remove the object body from the physics world
//                     objectRecycled();
//                     isInBin = true;
//                 }
//             }
//             // physics positions for the object
//             object.model.position.copy(object.body.position);
//             object.model.quaternion.copy(object.body.quaternion);
//             // bounding box for object for debugging
//             // boxMesh.position.copy(object.body.position);
//             // boxMesh.quaternion.copy(object.body.quaternion);
//         }
//     });

//     // physics positions for recycle bin
//     if (recyclebin && recycl) {
//         recyclebin.position.copy(binBody.position);
//         recyclebin.quaternion.copy(binBody.quaternion);
//     }

//     // animation of the objects return
//     if (hasInspected && !isInspecting && progress < 1) {
//         progress += 0.01;
//         objects.forEach((object) => {
//             object.model.position.lerp(originalPosition, progress);
//             object.model.quaternion.slerp(initialRotation, progress);
//             object.body.position.copy(object.model.position);
//             object.body.quaternion.copy(object.model.quaternion);
//         });
//     }
// }

// function animate(){
//     update();
//     composer.render();
//     requestAnimationFrame(animate);
// }

// // return to main 
// return {scene, camera, renderer, update, gui};
// }


// LATEST OBJECT LOADER
// // objects
// let objects = {};

// // world for physics
// const world = new CANNON.World();
// world.gravity.set(0, -9.82, 0); // m/s²

// // texture loader with set path of textures folder
// const loader = new GLTFLoader();
// loader.load('table/scene.gltf', function (gltf) {
//     table = gltf.scene;
//     table.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             node.castShadow = true;
//             node.receiveShadow = true;
//         }
//     });
//     table.scale.set(0.05, 0.08, 0.08);
//     table.position.set(0, -15, 10);

//     // Calculate the bounding box of the table
//     const box = new THREE.Box3().setFromObject(table);
//     const size = box.getSize(new THREE.Vector3());

//     // Create a box shape for the table with the actual size of the table
//     const tableShape = new CANNON.Box(new CANNON.Vec3(size.x / 2.2, size.y / 1.3, size.z/2));

//     // Create a body for the table and add the shape to it
//     const tableBody = new CANNON.Body({ mass: 0 }); // The table is static, so its mass is 0
//     tableBody.addShape(tableShape);
//     tableBody.position.copy(table.position);
//     world.addBody(tableBody);

//     scene.add(table);
// });

// loader.load('oldlamp/scene.gltf', function (gltf) {
//     newlamp = gltf.scene;
//     newlamp.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             //node.castShadow = true;
//             //node.receiveShadow = true;
//         }
//     });
//     newlamp.scale.set(0.3, 0.3, 0.3);
//     newlamp.position.set(0, 25, 10);
//     newlamp.rotation.set(0, Math.PI/2, 0)
//     scene.add(newlamp);
// });


// // async loader for greenrock 
// function loadModel(url) {
//     return new Promise((resolve, reject) => {
//         loader.load(url, (gltf) => {
//             resolve(gltf.scene);
//         }, undefined, reject);
//     });
// }

// let greenrockBody;

// loadModel('greenrock/scene.gltf').then((model) => {
//     greenrock = model;
//     greenrock.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             node.castShadow = true;
//         }
//     });
//     greenrock.scale.set(1.5, 1.5, 1.5);
//     greenrock.position.set(0, 5, 10);
//     scene.add(greenrock);
//     objects.push(greenrock);

//     // Create a box body for the greenrock
//     const greenrockShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)); // Replace with the actual size of the greenrock
//     greenrockBody = new CANNON.Body({ mass: 3}); // Replace with the actual mass of the greenrock
//     greenrockBody.addShape(greenrockShape);
//     greenrockBody.position.copy(greenrock.position);
//     world.addBody(greenrockBody);
//     greenrockBody.collisionResponse = true;

// }).catch((error) => {
//     console.error('Error loading model:', error);
// });

// console.log(greenrock);
// // bounding box for greenrock for debugging
// // const boxGeometry = new THREE.BoxGeometry(2, 2, 2); // The size should be twice the size of the Cannon.js Vec3
// // const boxMaterial = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
// // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// // scene.add(boxMesh);

// var binBody, recycleBinMesh;

// // recycle bin
// loader.load('cop/scene.gltf', function (gltf) {
//     bin = gltf.scene;
//     bin.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             node.castShadow = true;
//             node.receiveShadow = true;
//         }
//     });
//     bin.scale.set(0.08, 0.08, 0.08);
//     bin.position.set(17,-10, 17);
    
//     scene.add(bin);

//     const box = new THREE.Box3().setFromObject(bin);
//     const size = box.getSize(new THREE.Vector3());

//     const recycleBinShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
//     binBody = new CANNON.Body({ mass: 0 }); // The recycle bin is static, so its mass is 0
//     binBody.addShape(recycleBinShape);
//     binBody.position.copy(bin.position);
//     world.addBody(binBody);

//     binBody.collisionResponse = true;

//     // // Create a box geometry for the recycle bin
//     // const recycleBinGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
//     // const recycleBinMaterial = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000});
//     // recycleBinMesh = new THREE.Mesh(recycleBinGeometry, recycleBinMaterial);
//     // recycleBinMesh.position.copy(binBody.position);
//     // console.log('Size:', size.x, size.y, size.z);
//     // scene.add(recycleBinMesh);
// });

// let robot, robotBody;

// loader.load('robot/scene.gltf', function (gltf) {
//     robot = gltf.scene;
//     robot.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//             node.castShadow = true;
//             node.receiveShadow = true;
//         }
//     });
//     robot.scale.set(2, 2, 2);
//     robot.position.set(0, 0, 0);
    
//     scene.add(robot);

//     const box = new THREE.Box3().setFromObject(robot);
//     const size = box.getSize(new THREE.Vector3());

//     const robotBodyShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
//     robotBody = new CANNON.Body({ mass: 4 }); // The recycle bin is static, so its mass is 0
//     robotBody.addShape(robotBodyShape);
//     robotBody.position.copy(robot.position);
//     world.addBody(robotBody);

//     robotBody.collisionResponse = true;
// });