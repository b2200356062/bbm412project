import * as THREE from 'three';
import * as DAT from 'dat.gui';
import * as CANNON from 'cannon-es';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {Mesh, MeshBasicMaterial, TextureLoader} from "three";
import {PointerLockControls} from "three/addons/controls/PointerLockControls.js";
import Stats from "three/addons/libs/stats.module.js";
//import {World} from 'cannon-es'

// todo: add ui for speed and tuş atamaları
// todo: add oscillation animation for low speed turns and tedious movements

// 26.12.23: key bindings for speedUp/slowDown/up/down changed

// // fps counter
// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

const world = new CANNON.World({
    //gravity: new CANNON.Vec3(-0.05, -0.05, 0)
});
const timeStep = 1/60;

var urls = [
    'rsc/GLTF/Spaceship_FernandoTheFlamingo.gltf',
    'rsc/mikuGLTF/scene.gltf',
    'rsc/triangleGLTF/scene.gltf',
    'rsc/blueRock/scene.gltf',
    'rsc/maintRobot/scene.gltf',
]


// import ship files
const shipUrl = new URL(urls[2], import.meta.url);
const debris1Url = new URL(urls[3], import.meta.url);
const debris2Url = new URL(urls[4], import.meta.url);

const renderer = new THREE.WebGLRenderer();
const gui = new DAT.GUI();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,  // field of view
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near
    1000 // far
);
var cameraControls = new PointerLockControls(camera, renderer.domElement);

const assetLoader = new GLTFLoader();


var spaceship, spaceshipBox;
loadModel("spaceship", shipUrl.href, new THREE.Vector3(0, 5, 0), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, -1 * Math.PI, 0), 5, true, true);
var debris1, debris1Box;
loadModel("debris1", debris1Url.href, new THREE.Vector3(0, 5, -500), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, 0, 0), 20, true, true);

// spaceship controls
const controls = {
    speedUp: false,
    slowDown: false,
    left: false,
    right: false,
    up: false,
    down: false,
    pause: false,

    speed: 0.02,
    minSpeed: -15,
    maxSpeed: -300,
    minRotation: -45 * Math.PI / 180,
    maxRotation: 45 * Math.PI / 180,
    totalRotation: { x:0, y:0, z:0 },

    boost: false,
    boostCoolDown: 20, // minimum seconds between two carried out boost commands
    coolDownTime: 0, // calculated time after last carried out boost command
};

// add a grid to help us
const gridHelper = new THREE.GridHelper(300000, 10000);
scene.add(gridHelper);

// let there be light
const ambientLight = new THREE.AmbientLight(0xccffe6); // ambient light
scene.add(ambientLight);

const rightPLight = new THREE.PointLight(0xff3300, 10000*controls.speed);
scene.add(rightPLight);
const leftPLight = new THREE.PointLight(0xff3300, 10000*controls.speed);
scene.add(leftPLight);

// const rPLightHelper = new THREE.PointLightHelper(rightPLight, 1);
// const lPLightHelper = new THREE.PointLightHelper(leftPLight, 1);
// scene.add(rPLightHelper);
// scene.add(lPLightHelper);

rightPLight.position.set(-5,0,0);
leftPLight.position.set(5,0,0);

const options = {
    lightIntensity: 0.5,
};

gui.add(options, 'lightIntensity', 0.5, 2).onChange(function (e) {
    ambientLight.intensity = e;

});

renderer.setClearColor(0x060d13); // dark blue for space

function animate(time) {
    if (!controls.pause) {
        world.step(timeStep);


        if (spaceship) {
            spaceshipMovement();
            spaceship.position.copy(spaceshipBox.position);
            spaceship.quaternion.copy(spaceshipBox.quaternion);
        }
        if (debris1) {
            debris1.position.copy(debris1Box.position);
            debris1.quaternion.copy(debris1Box.quaternion);
        }

    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

function spaceshipMovement() {

    rightPLight.position.set(spaceship.position.x -4, spaceship.position.y, spaceship.position.z+7);
    leftPLight.position.set(spaceship.position.x +4, spaceship.position.y, spaceship.position.z+7);

    camera.position.set(spaceship.position.x, spaceship.position.y + 30, spaceship.position.z + 100); // set the coords of camera

    // keeping speed between assigned values
    if (spaceshipBox.velocity.z > controls.minSpeed) { spaceshipBox.velocity.z = controls.minSpeed-1; }
    if (spaceshipBox.velocity.z < controls.maxSpeed) { spaceshipBox.velocity.z = controls.maxSpeed+1; }

    // animation + control panel
    if (controls.speedUp) {
        if (controls.speed >= controls.maxSpeed/2) {
            leftPLight.power += 0.1;
            rightPLight.power += 0.1;
            spaceshipBox.velocity.z -= 0.5;
        } else if (controls.speed < controls.maxSpeed/2 && controls.speed >= controls.maxSpeed) {
            leftPLight.power += 0.1;
            rightPLight.power += 0.1;
            spaceshipBox.velocity.z -= 0.25;
        }
    }
    if (controls.slowDown) {
        if (controls.speed > controls.minSpeed) {
            leftPLight.power -= 0.1;
            rightPLight.power -= 0.1;
            spaceshipBox.velocity.z += 0.5;
        }
    }

    let rotationSpeed = 0.01;
    let quaternion = new CANNON.Quaternion();
    if (controls.up && controls.totalRotation.x > controls.minRotation) {
        spaceshipBox.velocity.y += 0.5;
        quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -rotationSpeed);
        spaceshipBox.quaternion = spaceshipBox.quaternion.mult(quaternion);
        controls.totalRotation.x -= rotationSpeed;
    }
    if (controls.down && controls.totalRotation.x < controls.maxRotation) {
        spaceshipBox.velocity.y -= 0.5;
        quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), rotationSpeed);
        spaceshipBox.quaternion = spaceshipBox.quaternion.mult(quaternion);
        controls.totalRotation.x += rotationSpeed;
    }
    if (!controls.down && !controls.up && controls.totalRotation.x !== 0) {
        if (controls.totalRotation.x > 0) {
            quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -rotationSpeed);
            spaceshipBox.quaternion = spaceshipBox.quaternion.mult(quaternion);
            controls.totalRotation.x -= rotationSpeed;
        }
        if (controls.totalRotation.x < 0) {
            quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), rotationSpeed);
            spaceshipBox.quaternion = spaceshipBox.quaternion.mult(quaternion);
            controls.totalRotation.x += rotationSpeed;
        }
    }
    if (!controls.left && !controls.right && controls.totalRotation.z !== 0) {
        if (controls.totalRotation.z > 0) {
            quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1), -rotationSpeed);
            spaceshipBox.quaternion = spaceshipBox.quaternion.mult(quaternion);
            controls.totalRotation.z -= rotationSpeed;
        }
        if (controls.totalRotation.z < 0) {
            quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1), rotationSpeed);
            spaceshipBox.quaternion = spaceshipBox.quaternion.mult(quaternion);
            controls.totalRotation.z += rotationSpeed;
        }
    }

    if (controls.left && controls.totalRotation.z > controls.minRotation) {
        spaceshipBox.velocity.x -= 0.5;
        quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1), -rotationSpeed);
        spaceshipBox.quaternion = spaceshipBox.quaternion.mult(quaternion);
        controls.totalRotation.z -= rotationSpeed;
    }
    if (controls.right && controls.totalRotation.z < controls.maxRotation) {
        spaceshipBox.velocity.x += 0.5;
        quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1), rotationSpeed);
        spaceshipBox.quaternion = spaceshipBox.quaternion.mult(quaternion);
        controls.totalRotation.z += rotationSpeed;
    }
    spaceshipBox.quaternion.y = 1;

}

document.getElementById("Play").onclick = () => {
    cameraControls.lock();
}
// tracking mouse movements for camera controls
window.addEventListener('click', function () {
    controls.lock();
}, false);

// event listener for resizing the browser
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// event listener for character controls
window.addEventListener('keydown', function (e) {
    switch (e.code) {
        case "Space":
            controls.speedUp = true;
            break;
        case 'KeyA':
            controls.left = true;
            controls.right = false;
            break;
        case 'ShiftLeft':
            controls.slowDown = true;
            break;
        case 'KeyD':
            controls.right = true;
            controls.left = false;
            break;
        case 'KeyW':
            controls.up = true;
            break;
        case 'KeyS':
            controls.down = true;
            break;
        case 'Escape':
            controls.pause = !controls.pause;
            break;
    }
});
window.addEventListener('keyup', function (e) {
    switch (e.code) {
        case "Space":
            controls.speedUp = false;
            break;
        case 'KeyA':
            controls.left = false;
            break;
        case 'ShiftLeft':
            controls.slowDown = false;
            break;
        case 'KeyD':
            controls.right = false;
            break;
        case 'KeyW':
            controls.up = false;
            break;
        case 'KeyS':
            controls.down = false;
            break;
    }
});

// load obj
function loadModel(modelName, path, position, scale, rotation, mass, castShadow, receiveShadow) {
    let body, model;
    assetLoader.load(path, function (gltf) {
        model = gltf.scene;
        // model.traverse((node) => {
        //     if (node instanceof THREE.Mesh) {
        //         node.castShadow = castShadow;
        //         node.receiveShadow = receiveShadow;
        //     }
        // });
        model.scale.set(scale.x, scale.y, scale.z);
        model.position.copy(position);
        model.rotation.copy(rotation);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
        body = new CANNON.Body({ mass: mass });
        body.addShape(shape);
        body.position.copy(model.position);

        body.quaternion.setFromEuler(model.rotation.x, model.rotation.y, model.rotation.z);

        world.addBody(body);
        model.userData.physicsBody = body;
        scene.add(model);

        if (modelName == "spaceship") {
            spaceship = model;
            spaceshipBox = body;
            spaceshipBox.angularDamping = 1;
            spaceshipBox.velocity = new CANNON.Vec3(0, 0, -25);
        }
        else if (modelName == "debris1") {
            debris1 = model;
            debris1Box = body;
        }
    }, undefined, function (error) {
        console.error(error);
    });
}

