import * as THREE from 'three';
import * as DAT from 'dat.gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {Mesh, MeshBasicMaterial, TextureLoader} from "three";
import {PointerLockControls} from "three/addons/controls/PointerLockControls.js";
//import {World} from 'cannon-es'

// todo: add ui for speed and tuş atamaları
// todo: add oscillation animation for low speed turns and tedious movements

// 26.12.23: key bindings for speedUp/slowDown/up/down changed

// // fps counter
// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

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

// adding spaceship
var spaceship;
var boundingBox;
//const texture = new TextureLoader().load('rsc/triangleGLTF/textures');
assetLoader.load(shipUrl.href, function (gltf) {
    const model = gltf.scene;
    model.castShadow = true;
    model.receiveShadow = true;
    // model.traverse((obj) => {
    //     if(obj instanceof Mesh) {
    //         obj.material = new MeshBasicMaterial({map: texture})
    //         obj.receiveShadow = true;
    //         obj.castShadow = true;
    //     }
    // })
    scene.add(model);
    model.position.set(0, 5, 0);
    //model.scale.setScalar(2); // try 50 for miku
    model.rotation.y = -1 * Math.PI;
    spaceship = model;
    //camera.lookAt(spaceship.position.x, spaceship.position.y, spaceship.position.z - 50);

    // var bottomVec = new THREE.Vector3(spaceship.position.x -5, spaceship.position.y, -6);
    // var topVec = new THREE.Vector3(spaceship.position.x +5, spaceship.position.y + 3, 6);
    // boundingBox = new THREE.Box3(bottomVec, topVec);
    // var size = new THREE.Vector3();
    // var center = new THREE.Vector3();
    // boundingBox.getSize(size);
    // boundingBox.getCenter(center);
    // console.log(size);
    // console.log(center);
    // console.log(spaceship.position.y);
    //
    // boundingBox.setFromObject(spaceship);
    //
    // var boundBoxHelper = new THREE.Box3Helper(boundingBox);
    // scene.add(boundingBox);
    // scene.add(boundBoxHelper);


}, undefined, function (error) {
    console.error(error);
});

// spy ship (taking inspiration from fromsoft >:))
var spyShip;
var spaceshipBox;
assetLoader.load(shipUrl.href, function (gltf) {
    spyShip = gltf.scene;
    scene.add(spyShip);
    spyShip.position.set(0, 5, 0);
    spyShip.scale.setScalar(0.5); // try 50 for miku
    spyShip.rotation.y = -1 * Math.PI;

    var bottomVec = new THREE.Vector3(spaceship.position.x -5, spaceship.position.y, -6);
    var topVec = new THREE.Vector3(spaceship.position.x +5, spaceship.position.y + 3, 6);
    spaceshipBox = new THREE.Box3(bottomVec, topVec);
    spaceshipBox.setFromObject(spyShip);

    var boundBoxHelper = new THREE.Box3Helper(spaceshipBox);
    scene.add(spaceshipBox);
    //kascene.add(boundBoxHelper);

});



// adding first debris: a rock!
var debris1;
var debris1Box;
assetLoader.load(debris1Url.href, function (gltf) {
    debris1 = gltf.scene;
    debris1.castShadow = true;
    debris1.receiveShadow = true;
    scene.add(debris1);
    //debris1.scale.set(0.5);
    debris1.position.set(0, 5, -500);

    // bounding box for debris
    debris1Box = new THREE.Box3().setFromObject(debris1);
    var boundBoxHelper = new THREE.Box3Helper(debris1Box);
    scene.add(debris1Box);
    //scene.add(boundBoxHelper);
})
// var spyDebris;
//
// assetLoader.load(debris1Url.href, function (gltf) {
//     spyDebris = gltf.scene;
//     spyDebris.castShadow = true;
//     spyDebris.receiveShadow = true;
//     scene.add(spyDebris);
//     //debris1.scale.set(0.5);
//     spyDebris.position.set(0, 5, -500);
//
//     // bounding box for debris
//     var bottomVec = new THREE.Vector3(spaceship.position.x -5, spaceship.position.y, -6);
//     var topVec = new THREE.Vector3(spaceship.position.x +5, spaceship.position.y + 3, 6);
//     debris1Box = new THREE.Box3(bottomVec, topVec);
//     debris1Box.setFromObject(spyDebris);
//
//     var boundBoxHelper = new THREE.Box3Helper(debris1Box);
//     scene.add(debris1Box);
//     scene.add(boundBoxHelper);
// })


// spaceship controls
const controls = {
    speedUp: false,
    slowDown: false,
    left: false,
    right: false,
    up: false,
    down: false,

    speed: 0.02,
    minSpeed: 0.02,
    maxSpeed: 15,

    boost: false,
    boostCoolDown: 20, // minimum seconds between two carried out boost commands
    coolDownTime: 0, // calculated time after last carried out boost command
};

// add a grid to help us
const gridHelper = new THREE.GridHelper(300000, 10000); // it's arguments are not necessary
scene.add(gridHelper);

// let there be light
const ambientLight = new THREE.AmbientLight(0xccffe6); // ambient light
// try 0xccffe6 if this one doesn't work
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight();
// scene.add(directionalLight);
// directionalLight.castShadow = true;
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
// scene.add(dLightHelper);

const rightPLight = new THREE.PointLight(0xff3300, 10000*controls.speed);
scene.add(rightPLight);
const leftPLight = new THREE.PointLight(0xff3300, 10000*controls.speed);
scene.add(leftPLight);

const rPLightHelper = new THREE.PointLightHelper(rightPLight, 1);
const lPLightHelper = new THREE.PointLightHelper(leftPLight, 1);
scene.add(rPLightHelper);
scene.add(lPLightHelper);

rightPLight.position.set(-5,0,0);
leftPLight.position.set(5,0,0);

const options = {
    lightIntensity: 0.5,
};

gui.add(options, 'lightIntensity', 0.5, 2).onChange(function (e) {
    ambientLight.intensity = e;

});

// var rightplightCoord = {
//     x: 0,
//     y: 0,
//     z: 0,
// }
// var leftplightCoord = {
//     x: 0,
//     y: 0,
//     z: 0,
// }
// gui.add(rightplightCoord, 'x', -50, 50).onChange(function (e) {
//     rightPLight.position.z = spaceship.position.z + e;
// });

//orbit.target = new THREE.Vector3(spaceship.position.x, spaceship.position.y, spaceship.position.z - 50);
renderer.setClearColor(0x060d13); // dark blue for space

function animate(time) {
    if (spaceship) {
        spaceshipMovement();
        if (spyShip) {
            spaceshipBox.setFromObject(spyShip);
            //spaceshipBox.expandByScalar(5);
        }
        //console.log(spaceship.rotation.z);
    }

    if(spyShip && debris1) {
        if (spaceshipBox.intersectsBox(debris1Box)) {
            console.log("INTERSECTION!!!!");
        }
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

function spaceshipMovement() {
    if (spyShip) {
        spyShip.position.set(spaceship.position.x, spaceship.position.y, spaceship.position.z);
        spyShip.rotation.set(spaceship.rotation.x, spaceship.rotation.y, spaceship.rotation.z);
    }

    rightPLight.position.set(spaceship.position.x -4, spaceship.position.y, spaceship.position.z+7);
    leftPLight.position.set(spaceship.position.x +4, spaceship.position.y, spaceship.position.z+7);

    camera.position.set(spaceship.position.x, spaceship.position.y + 30, spaceship.position.z + 100); // set the coords of camera
    //camera.rotation.x = cameraControls.getDirection(new THREE.Vector3()).x * rotationSpeed;
    //camera.rotation.y = cameraControls.getDirection(new THREE.Vector3()).y * rotationSpeed;
    //camera.rotation.z = 0;

    spaceship.position.z -= controls.speed;

    // keeping speed between assigned values
    if (controls.speed > controls.maxSpeed) { controls.speed = controls.maxSpeed; }
    if (controls.speed < controls.minSpeed) { controls.speed = controls.minSpeed; }

    // animation + control panel
    if (controls.speedUp) {
        // todo: add motor animation
        if (controls.speed <= controls.maxSpeed/2) {
            controls.speed += 0.02;
        } else if (controls.speed > controls.maxSpeed/2 && controls.speed <= controls.maxSpeed) {
            controls.speed += 0.01;
        }
    }
    if (controls.slowDown) {
        // todo: add motor animation
        if (controls.speed > controls.minSpeed) {
            controls.speed -= 0.01;
        }
    }
    if (controls.right) {
        if (spaceship.rotation.y > -4) {
            spaceship.position.x += 1;
            spaceship.rotation.z += Math.PI/450*controls.speed + 0.01;
        }
        else {
            controls.right = false;
        }
    }
    if (controls.left) {
        if (spaceship.rotation.y < -2.3) {
            spaceship.position.x -= 1;
            spaceship.rotation.z -= Math.PI/450*controls.speed + 0.01;
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
            spaceship.rotation.z -= Math.PI/450*controls.speed + 0.01;
        }
        if (spaceship.rotation.z < 0) {
            spaceship.rotation.z += Math.PI/450*controls.speed + 0.01;
        }
    }

}

document.getElementById("Play").onclick = () => {
    cameraControls.lock();
}
// tracking mouse movements for camera controls
 var rotationSpeed = 0.02;
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