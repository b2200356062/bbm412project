import * as THREE from 'three';
import * as DAT from 'dat.gui';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";
import {or} from "three/nodes";



// // fps counter
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

var urls = [
    'rsc/GLTF/Spaceship_FernandoTheFlamingo.gltf',
    'rsc/mikuGLTF/scene.gltf',
    'rsc/triangleGLTF/scene.gltf',
]

// import ship files
const shipUrl = new URL(urls[2], import.meta.url);

const renderer = new THREE.WebGLRenderer();
const gui = new DAT.GUI();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    35,  // field of view
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near
    1000 // far
);

// camera with orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);

orbit.enablePan = false; // camera won't change position when pressed into r-mouse
orbit.enableDamping = true; // damps the movement a bit
orbit.enableZoom = false;

// orbit.dampingFactor(0.2); // change the amount of damping
//camera.position.set(0, 20, 100);
orbit.update();


// // adding a plane to just see stuff
// const planeGeometry = new THREE.PlaneGeometry(30,30);
// const planeMaterial = new THREE.MeshStandardMaterial({
//     color: 0xFFFFFF, // color
//     side: THREE.DoubleSide // makes it visible from both sides
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);
// plane.rotation.x = -0.5 * Math.PI; // it was a wall before this code
// plane.receiveShadow = true; // let plane receive shadows


// adding spaceship
var spaceship;
const assetLoader = new GLTFLoader();
assetLoader.load(shipUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 5, 0);
    //model.scale.setScalar(2); // try 50 for miku
    model.rotation.y = -1 * Math.PI;
    //console.log(model);
    //model.getObjectByName("Spaceship_FernandoTheFlamingo").material.color.setHex(0xff3300);
    spaceship = model;
    orbit.target = new THREE.Vector3(spaceship.position.x, spaceship.position.y, spaceship.position.z - 50);
}, undefined, function (error) {
    console.error(error);
});

// spaceship controls
const controls = {
    speedUp: false,
    slowDown: false,
    left: false,
    right: false,
    up: false,
    down: false,
    speed: 0.01,
};

// add a grid to help us
const gridHelper = new THREE.GridHelper(30000, 1000); // it's arguments are not necessary
scene.add(gridHelper);

// temporary light to see stuff
// let there be light
const ambientLight = new THREE.AmbientLight(0xccffe6); // ambient light
// try 0xccffe6 if this one doesn't work
scene.add(ambientLight);
//ambientLight.castShadow = true; // nothing changed?

// // // // directional light and it's helper
// const directionalLight = new THREE.DirectionalLight(0xff3300, 1);
// scene.add(directionalLight);
// directionalLight.castShadow = true;
// directionalLight.position.set(-30, 50, 0);
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);
//
// // d-light's shadow has its own camera
// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);
// // we see from helper that we need to resize our d-light camera
// directionalLight.shadow.camera.top = 12;

const options = {
    lightIntensity: 0.5,
};

gui.add(options, 'lightIntensity', 0.5, 2).onChange(function (e) {
    ambientLight.intensity = e;
});

//orbit.target = new THREE.Vector3(spaceship.position.x, spaceship.position.y, spaceship.position.z - 50);
renderer.setClearColor(0x060d13); // dark blue for space

function animate(time) {
    if (spaceship) {
        spaceshipMovement();
        console.log(spaceship.rotation.z);
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

function spaceshipMovement() {
    camera.position.set(spaceship.position.x, spaceship.position.y + 30, spaceship.position.z + 100); // set the coords of camera
    orbit.target = new THREE.Vector3(spaceship.position.x, spaceship.position.y, spaceship.position.z - 50);
    orbit.update(); // call this function anytime camera pos changes

    spaceship.position.z -= controls.speed;

    if (controls.speedUp) {
        // todo: add motor animation
        if (controls.speed <= 5) {
            controls.speed += 0.02;
        } else if (controls.speed > 5 && controls.speed <= 10) {
            controls.speed += 0.01;
        }
    }
    if (controls.slowDown) {
        // todo: add motor animation
        if (controls.speed > 0.01) {
            controls.speed -= 0.01;
        }
    }
    if (controls.right) {
        if (spaceship.rotation.y > -4) {
            spaceship.position.x += 1;
            //spaceship.rotation.y -= Math.PI/180;
            spaceship.rotation.z += Math.PI/900*controls.speed;
        }
        else {
            controls.right = false;
        }
    }
    if (controls.left) {
        if (spaceship.rotation.y < -2.3) {
            spaceship.position.x -= 1;
            //spaceship.rotation.y += Math.PI/180;
            spaceship.rotation.z -= Math.PI/900*controls.speed;
        }
        else {
            controls.left = false;
        }
    }
    if (controls.up) {
        if (spaceship.rotation.x < 0.5) {
            spaceship.position.y += 1;
            spaceship.rotation.x += Math.PI/180;
        }
    } else {
        if (spaceship.rotation.x > 0) {
            spaceship.rotation.x -= Math.PI/180;
        }
    }
    if (controls.down) {
        if (spaceship.rotation.x > -0.35) {
            spaceship.position.y -= 1;
            spaceship.rotation.x -= Math.PI/180;
        }
    } else {
        if (spaceship.rotation.x < 0) {
            spaceship.rotation.x += Math.PI/180;
        }
    }
    if (!controls.left && !controls.right) {
        if (spaceship.rotation.z > 0) {
            spaceship.rotation.z -= Math.PI/450*controls.speed;
        }
        if (spaceship.rotation.z < 0) {
            spaceship.rotation.z += Math.PI/450*controls.speed;
        }
    }

}

// tracking mouse movements for camera controls
// window.addEventListener('mousemove', function (e) {
//     orbit.target.y = -THREE.MathUtils.lerp(orbit.target.x, ((e.y - window.innerHeight/2) * Math.PI) /10, 0.1);
//     orbit.target.x = THREE.MathUtils.lerp(orbit.target.y, ((e.x - window.innerWidth/2) * Math.PI) /10, 0.1);
//     orbit.target.z = spaceship.position.z - 50;
//     orbit.update();
//     console.log(orbit.target);
// })

// event listener for resizing the browser
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// event listener for character controls
window.addEventListener('keydown', function (e) {
    switch (e.code) {
        case "KeyW":
            controls.speedUp = true;
            break;
        case 'KeyA':
            controls.left = true;
            break;
        case 'KeyS':
            controls.slowDown = true;
            break;
        case 'KeyD':
            controls.right = true;
            break;
        case 'Space':
            controls.up = true;
            break;
        case 'ShiftLeft':
            controls.down = true;
            break;
    }
});
window.addEventListener('keyup', function (e) {
    switch (e.code) {
        case "KeyW":
            controls.speedUp = false;
            break;
        case 'KeyA':
            controls.left = false;
            break;
        case 'KeyS':
            controls.slowDown = false;
            break;
        case 'KeyD':
            controls.right = false;
            break;
        case 'Space':
            controls.up = false;
            break;
        case 'ShiftLeft':
            controls.down = false;
            break;
    }
});