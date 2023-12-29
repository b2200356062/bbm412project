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
