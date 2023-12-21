// // three js lib
// import * as THREE from 'three'
// // kamera kontrolleri
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// // sliderlar için gui
// import {GUI} from 'dat.gui'
// // 3d model loader
// import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
// // fps counter
// import Stats from "three/addons/libs/stats.module";
//
// import {FirstPersonControls} from "three/addons/controls/FirstPersonControls";
//
// import {FlyControls} from "three/addons/controls/FlyControls";
//
// const WIDTH = window.innerWidth;
// const HEIGHT = window.innerHeight;
//
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 0.1, 1000 );
// const renderer = new THREE.WebGLRenderer({powerPreference: "high-performance"});
// // antialias: - 40 fps, kötü performans
// renderer.shadowMap.enabled = true;
// renderer.gammaOutput = true;
//
// camera.position.z = 50; // uzaklık
//
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor(0xffffff, 1); // arkaplan rengi
// document.body.appendChild( renderer.domElement );
//
// const loader = new GLTFLoader();
//
// loader.load('public/table/scene.gltf', function (gltf){
//     scene.add(gltf.scene);
//
//     gltf.scene.scale.set(0.05,.05,.05);
//     gltf.scene.position.set(0,-10,0);
//
// }, function (xhr){
//     console.log((xhr.loaded/xhr.total * 100) + " %100 loaded")
// }, function (error){
//     console.log(error);
// } );
//
// const textureloader = new THREE.TextureLoader();
//
// const texture = textureloader.load()
//
//
//
// // küp
// const geometry = new THREE.BoxGeometry( 10, 10, 10 );
//
// // what covers an object; color, texture etc.
// const material = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // parametreler {} içinde veriliyor.
//
// // mesh: to apply material to a geometry;
// const cube = new THREE.Mesh(geometry, material);
//
// scene.add(cube);
// // scene.add(camera); optional gibimsi
//
// cube.position.x = -20;
//
// // torus?? objesi
// const torusGeometry = new THREE.TorusGeometry(7,1,6,12);
// const phongMaterial = new THREE.MeshPhongMaterial({color: 0xdddddd});
// const torus = new THREE.Mesh(torusGeometry, phongMaterial);
// //scene.add(torus);
//
// // küre
// const sphere = new THREE.SphereGeometry(7, 30, 30);
// const sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
// const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
// sphereMesh.position.x = 0;
// sphereMesh.position.y = 20;
// //scene.add(sphereMesh);
//
// // yer düzlemi
// const planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
// const planeMaterial = new THREE.MeshLambertMaterial({color: 0x555555});
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// // rotation olmazsa düzlem yerde olmuyor
// plane.rotation.x = -0.5 * Math.PI;
// plane.position.y = -30;
// scene.add(plane);
//
// // dodecahedron
// const dodecahedronGeometry = new THREE.DodecahedronGeometry(7);
// const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xdd00ff});
// const dodecahedron = new THREE.Mesh(dodecahedronGeometry, lambertMaterial);
// dodecahedron.position.x = 20;
// scene.add(dodecahedron);
//
// // directional light
// // const light = new THREE.DirectionalLight(0xffffff, 1);
// // light.position.set(1,0,0);
// // scene.add(light);
//
// // point light
// // const pl = new THREE.PointLight(0xffffff, 500);
// // pl.position.set(0,30,6);
// // scene.add(pl);
//
// const ambientlight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientlight);
//
// // mouse controls
// // const controls = new FlyControls(camera, renderer.domElement);
// // controls.movementSpeed = 100;
// // controls.rollSpeed = 1
//
// const gui = new GUI();
//
// gui.add(ambientlight.position, 'x', -100, 100);
// gui.add(ambientlight.position, 'y', -100, 100);
// gui.add(ambientlight.position, 'z', -100, 100);
//
// var conf = {
//     color: cube.material.color,
// }
// gui.addColor(conf, 'color').onChange( function (color){
//     cube.material.color.set(color);
// })
//
// //const hehe = glMatrix.mat4.create();
//
// let t = 0; // for rotation
//
// // fps counter
// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);
//
// // star background
// const stars = new Array(0);
// for ( let i = 0; i < 10000; i ++ ) {
//     let x = THREE.MathUtils.randFloatSpread( 2000 );
//     let y = THREE.MathUtils.randFloatSpread( 2000 );
//     let z = THREE.MathUtils.randFloatSpread( 2000 );
//     stars.push(x, y, z);
// }
//
// const starsGeometry = new THREE.BufferGeometry();
// // yuvarlak yıldız için texture
// const sprite = new THREE.TextureLoader().load('/star.png');
// sprite.colorSpace = THREE.SRGBColorSpace;
//
// starsGeometry.setAttribute(
//     "position", new THREE.Float32BufferAttribute(stars, 3)
// );
//
// // size veya sizeattentuation gerekli
// const starsMaterial = new THREE.PointsMaterial( { color: 0xffffff, map: sprite, transparent: true, size: 1, sizeAttenuation: true} );
// const spacebackground = new THREE.Points( starsGeometry, starsMaterial );
// //  scene.add(spacebackground);
//
//
// // render function
// function render() {
//     const tick = () =>{
//         stats.begin();
//
//         requestAnimationFrame(render); // re renders constantly on every frame
//
//         cube.rotation.x += 0.005;
//         cube.rotation.y += 0.005;
//         cube.rotation.z += 0.005;
//
//         dodecahedron.rotation.x += 0.01;
//         dodecahedron.rotation.y += 0.01;
//         dodecahedron.rotation.z += 0.01;
//
//         //cube.rotation.set(0.4, 0.2, 0); yönünü çeviriyo; statik
//
//         t += 0.01;
//
//         // controls.update(0.007);
//         // torus.scale.y = Math.abs(Math.sin(t));
//         // dodecahedron.position.y = -7 * Math.sin(t);
//         // mouse update
//         renderer.render( scene, camera );
//
//         stats.end();
//         }
//     tick();
// }
//
//
// // controls
// window.addEventListener('keydown', (event) =>{
//     switch (event.code){
//         case 'KeyA':
//             camera.position.x -= 5;
//             //cube.position.x -= 5;
//
//             break;
//         case 'KeyD':
//             camera.position.x += 5;
//             //cube.position.x += 5;
//             break;
//         case 'KeyW':
//             camera.position.z -= 5;
//             //cube.position.y += 5;was
//             break;
//         case 'KeyS':
//             camera.position.z += 5;
//             //cube.position.y -= 5;
//             break;
//         case 'KeyQ':
//             // mouse q ve e yi overrideliyor
//             camera.rotation.y += Math.PI / 60;
//             //cube.position.z += 5;
//             break;
//         case 'KeyE':
//             camera.rotation.y -= Math.PI / 60;
//             break;
//     }
// });
//
// render();
