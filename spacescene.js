import * as THREE from 'three';
import * as DAT from 'dat.gui';
import * as CANNON from 'cannon';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {randFloatSpread} from "three/src/math/MathUtils";
import {clone} from "three/addons/utils/SkeletonUtils";
import{vertexShader, fragmentShader} from './shaders.js';
import {PointerLockControls} from "three/addons/controls/PointerLockControls.js";

export default function spaceScene(){
const world = new CANNON.World({
    //gravity: new CANNON.Vec3(-0.05, -0.05, 0)
});
const timeStep = 1/60;

var urls = [
    '',
    '',
    'triangleGLTF/scene.gltf',
    'blueRock/scene.gltf',
    'maintRobot/scene.gltf',
    'earth/scene.gltf',
    'sun/scene.gltf',
    'moon/scene.gltf',
    'lowPolyShip/scene.gltf',
    'lowPolyEarth/scene.gltf',
]

// UI
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
div.style.fontSize = '17px';
div.style.display = 'block';
var text = document.createTextNode('Welcome to Orbital Cleaning Program!');
var text1 = document.createTextNode('You are one of the lucky chosen destined to save humanity\'s future.');
var text2 = document.createTextNode('Collect all the junk you can, and be vary of rocks.');
var text3 = document.createTextNode('Use WASD keys to move in space and press E to collect an object when close to it.');
var text4 = document.createTextNode('Hold SPACE to speed up and LeftShift to slow down.');
var text5 = document.createTextNode('Press ESC to pause the game.');
var text7 = document.createTextNode('When you collect a rock, you can press R and switch to the table scene.');
var text6 = document.createTextNode('Press T to toggle between SPACE UI and TABLE UI.');

var junkCounter = 0;
var junkCounterTXT = document.createTextNode('Collected Junk: ' + junkCounter);
div.appendChild(junkCounterTXT);
var newline = document.createElement('div');
newline.style.height = '15px';
div.appendChild(newline);
var health = 100;
var healthText = document.createTextNode('Health: %' + health);
div.appendChild(healthText);
var newline = document.createElement('div');
newline.style.height = '20px';
div.appendChild(newline);
div.appendChild(text);
newline = document.createElement('div');
newline.style.height = '20px';
div.appendChild(newline);
div.appendChild(text1);
newline = document.createElement('div');
newline.style.height = '20px';
div.appendChild(newline);
div.appendChild(text2);
newline = document.createElement('div');
newline.style.height = '20px';
div.appendChild(newline);
div.appendChild(text3);
newline = document.createElement('div');
newline.style.height = '20px';
div.appendChild(newline);
div.appendChild(text4);
newline = document.createElement('div');
newline.style.height = '20px';
div.appendChild(newline);
div.appendChild(text5);
newline = document.createElement('div');
newline.style.height = '20px';
div.appendChild(newline);
div.appendChild(text6);
document.body.appendChild(div);
newline = document.createElement('div');
newline.style.height = '20px';
div.appendChild(newline);
div.appendChild(text7);

let hud = true;
document.body.appendChild(div);
window.addEventListener('keydown', (event) => {
    if(event.key === 't'){
        hud = !hud;
        if(!hud){
            div.style.display = 'none';
        }
        if(hud){
            div.style.display = 'block';
        }
    }
});

// import ship files
const shipUrl = new URL(urls[2], import.meta.url);
const debris1Url = new URL(urls[3], import.meta.url);
const debris2Url = new URL(urls[4], import.meta.url);
const earthUrl = new URL(urls[5], import.meta.url);
const moonUrl = new URL(urls[7], import.meta.url);
const sunUrl = new URL(urls[6], import.meta.url);

const canvas = document.querySelector('#canvas');
const context = canvas.getContext('webgl2', { alpha: false});

const renderer = new THREE.WebGLRenderer({canvas: canvas, powerPreference: "high-performance", context: context});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
const gui = new DAT.GUI();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,  // field of view
    window.innerWidth / window.innerHeight, // aspect
    0.01, // near
    3000 // far
);
var cameraControls = new PointerLockControls(camera, renderer.domElement);

const assetLoader = new GLTFLoader();
var spaceship, spaceshipBox;
loadModel("spaceship", shipUrl.href, new THREE.Vector3(0, 5, 0), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, -1 * Math.PI, 0), 100, true, true);
var debris1, debris1Box;
loadModel("debris1", debris1Url.href, new THREE.Vector3(0, 5, -500), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, 0, 0), 20, true, true, true);
var debris2, debris2Box;
loadModel("debris2", debris1Url.href, new THREE.Vector3(-25, 30, -750), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, 0, 0), 20, true, true, true);
var debris3, debris3Box;
loadModel("debris3", debris1Url.href, new THREE.Vector3(25, -50, -1000), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, 0, 0), 20, true, true, false);
var earth, earthBox;
loadModel("earth", earthUrl.href, new THREE.Vector3(3400, 2, -750), new THREE.Vector3(20, 20, 20), new THREE.Euler(0, 0, 0), 100000, true, true);
var sun, sunBox;
loadModel("sun", sunUrl.href, new THREE.Vector3(-1000, 200, -1500), new THREE.Vector3(1, 1, 1), new THREE.Euler(0, 0, 0), 1, true, true);
var moon, moonBox;
loadModel("moon", moonUrl.href, new THREE.Vector3(0, -200, 900), new THREE.Vector3(400, 400, 400), new THREE.Euler(0, 0, 0), 100000, true, true);

// star background
const stars = new Array(0);
for ( let i = 0; i < 5000; i ++ ) {
    let x = THREE.MathUtils.randFloatSpread( 2000 );
    let y = THREE.MathUtils.randFloatSpread( 2000 );
    let z = THREE.MathUtils.randFloatSpread( 2000 );
    // near stars are not created
    if (x*x + y*y + z*z > 750000) {
        stars.push(x, y, z);
    }
}

const starsGeometry = new THREE.BufferGeometry();
const sprite = new THREE.TextureLoader().load('star.png');
sprite.colorSpace = THREE.SRGBColorSpace;

starsGeometry.setAttribute(
    "position", new THREE.Float32BufferAttribute(stars, 3)
);

const starsMaterial = new THREE.PointsMaterial( { color: 0xffffff, map: sprite, transparent: true, size: 1, sizeAttenuation: true} );
const spacebackground = new THREE.Points( starsGeometry, starsMaterial );
scene.add(spacebackground);

let maxJunkCount = 70;
let currentJunkCount = 0;
let junkArray = [];

let isRandom = false;

generateSpaceJunk();

// spaceship controls
const controls = {
    collectableRadius: 150,
    speedUp: false,
    slowDown: false,
    left: false,
    right: false,
    up: false,
    down: false,
    pause: false,

    speed: 1,
    minSpeed: -15,
    maxSpeed: -300,
    minRotation: -45 * Math.PI / 180,
    maxRotation: 45 * Math.PI / 180,
    totalRotation: { x:0, y:0, z:0 },

    // boost: false,
    // boostCoolDown: 20, // minimum seconds between two carried out boost commands
    // coolDownTime: 0, // calculated time after last carried out boost command
};

// // add a grid to help us
// const gridHelper = new THREE.GridHelper(300000, 10000);
// scene.add(gridHelper);

// let there be light
const ambientLight = new THREE.AmbientLight(0x000409); // ambient light
scene.add(ambientLight);

const rightPLight = new THREE.PointLight(0xff3300, 40);
scene.add(rightPLight);
const leftPLight = new THREE.PointLight(0xff3300, 40);
scene.add(leftPLight);

const options = {
    lightIntensity: 0.5,
};

gui.add(options, 'lightIntensity', 0.5, 2).onChange(function (e) {
    ambientLight.intensity = e;

});

renderer.setClearColor(0x060d13); // dark blue for space

function render(time) {
    if (!controls.pause) {
        world.step(timeStep);

        if (spaceship) {
            spaceshipMovement();
            spaceship.position.copy(spaceshipBox.position);
        }
        if (debris1 && debris2 && debris3) {
            debris1.position.copy(debris1Box.position);
            debris1.quaternion.copy(debris1Box.quaternion);
        }

    }
    //stats.update();
    renderer.render(scene, camera);
}

function spaceshipMovement() {

    rightPLight.position.set(spaceship.position.x -4, spaceship.position.y, spaceship.position.z+7);
    leftPLight.position.set(spaceship.position.x +4, spaceship.position.y, spaceship.position.z+7);

    camera.position.set(spaceship.position.x, spaceship.position.y + 20, spaceship.position.z + 50); // set the coords of camera

    // keeping speed between assigned values
    if (spaceshipBox.velocity.z > controls.minSpeed) { spaceshipBox.velocity.z = controls.minSpeed-1; }
    if (spaceshipBox.velocity.z < controls.maxSpeed) { spaceshipBox.velocity.z = controls.maxSpeed+1; }

    // animation + control panel
    if (controls.speedUp) {
        spaceshipBox.velocity.y = 0;
        spaceshipBox.velocity.x = 0;
        if (controls.speed >= controls.maxSpeed/2) {
            leftPLight.power += 1;
            rightPLight.power += 1;
            spaceshipBox.velocity.z -= 1;
        } else if (controls.speed < controls.maxSpeed/2 && controls.speed >= controls.maxSpeed) {
            leftPLight.power += 1;
            rightPLight.power += 1;
            spaceshipBox.velocity.z -= 0.5;
        }
    }
    if (controls.slowDown) {
        spaceshipBox.velocity.y = 0;
        spaceshipBox.velocity.x = 0;
        if (controls.speed > controls.minSpeed) {
            leftPLight.power -= 1;
            rightPLight.power -= 1;
            spaceshipBox.velocity.z += 1;
        }
    }

    if (controls.up && controls.totalRotation.x > -30) {
        spaceshipBox.velocity.y -= 0.02 * spaceshipBox.velocity.z;
        spaceship.rotation.x += Math.PI/180;
        spaceshipBox.quaternion.copy(spaceship.quaternion);
        spaceship.quaternion.copy(spaceshipBox.quaternion);
        controls.totalRotation.x -= 1;
    }
    if (controls.down && controls.totalRotation.x < 30) {
        spaceshipBox.velocity.y += 0.02 * spaceshipBox.velocity.z;
        spaceship.rotation.x -= Math.PI/180;
        spaceshipBox.quaternion.copy(spaceship.quaternion);
        spaceship.quaternion.copy(spaceshipBox.quaternion);
        controls.totalRotation.x += 1;
    }
    if (!controls.down && !controls.up && controls.totalRotation.x !== 0) {
        //spaceshipBox.velocity.y = 0;
        if (controls.totalRotation.x > 0) {
            spaceship.rotation.x += Math.PI/180;
            spaceshipBox.quaternion.copy(spaceship.quaternion);
            spaceship.quaternion.copy(spaceshipBox.quaternion);
            controls.totalRotation.x -= 1;
        }
        if (controls.totalRotation.x < 0) {
            spaceship.rotation.x -= Math.PI/180;
            spaceshipBox.quaternion.copy(spaceship.quaternion);
            spaceship.quaternion.copy(spaceshipBox.quaternion);
            controls.totalRotation.x += 1;
        }
    }

    if (!controls.left && !controls.right && controls.totalRotation.z !== 0) {
        //spaceshipBox.velocity.x = 0;
        if (controls.totalRotation.z > 0) {
            spaceship.rotation.z -= Math.PI/450 + 0.01;
            spaceshipBox.quaternion.copy(spaceship.quaternion);
            spaceship.quaternion.copy(spaceshipBox.quaternion);
            controls.totalRotation.z -= 1;
        }
        if (controls.totalRotation.z < 0) {
            spaceship.rotation.z += Math.PI/450 + 0.01;
            spaceshipBox.quaternion.copy(spaceship.quaternion);
            spaceship.quaternion.copy(spaceshipBox.quaternion);
            controls.totalRotation.z += 1;
        }
    }

    if (controls.left && controls.totalRotation.z > -30) {
        spaceshipBox.velocity.x += 0.02 * spaceshipBox.velocity.z;
        spaceship.rotation.z -= Math.PI/450 + 0.01;
        spaceshipBox.quaternion.copy(spaceship.quaternion);
        spaceship.quaternion.copy(spaceshipBox.quaternion);
        controls.totalRotation.z -= 1;
    }
    if (controls.right && controls.totalRotation.z < 30) {
        spaceshipBox.velocity.x -= 0.02 * spaceshipBox.velocity.z;
        spaceship.rotation.z += Math.PI/450 + 0.01;
        spaceshipBox.quaternion.copy(spaceship.quaternion);
        spaceship.quaternion.copy(spaceshipBox.quaternion);
        controls.totalRotation.z += 1;
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

function selectObjects() {
    let d = 0;
    for (let i = 0; i < collectableItems.length; i++) {
        d = distance(spaceship, collectableItems[i].model);
        if (d <= controls.collectableRadius) {
            junkCounter += 1;
            junkCounterTXT.nodeValue = 'Collected Junk: ' + junkCounter;
            scene.remove(collectableItems[i].model);
            world.removeBody(collectableItems[i].body);
            scene.remove(collectableItems[i].body);
            collectableItems.splice(i, 1);
        }
    }
}

function distance (obj1, obj2) {
    let dx = obj1.position.x - obj2.position.x;
    let dy = obj1.position.y - obj2.position.y;
    let dz = obj1.position.z - obj2.position.z;

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2) );
}

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
        case  'KeyE':
            if (spaceship) {
                selectObjects();
            }
            break;
        case  'KeyQ':
            if (spaceship) {
                spaceshipBox.velocity.z = 0;
            }
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

// load obj, takes these parameters and id there is a variable with modelname and modelnameBox assigns object and collision box to them

let diffusePath = "/triangleGLTF/textures/Material.003_baseColor.jpeg"
let specularPath = "/triangleGLTF/textures/Spaceship10_Material_specularGlossiness.png"

var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        ambientLightColor: { value: new THREE.Color(0x333333) },
        directionalLightColor: { value: new THREE.Color(0xffffff) },
        directionalLightDirection: { value: new THREE.Vector3(-1000, 200, 1500).normalize() },
        diffuseMap: { value: new THREE.TextureLoader().load(diffusePath) }, // Specify your diffuse texture path
        specularMap: { value: null }, // Specify your specular texture path
        shininess: { value: 32.0 }, // Adjust the shininess value
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});

var collectableItems = [];
function loadModel(modelName, path, position, scale, rotation, mass, castShadow, receiveShadow, isCollectable=false) {
    let body, model;
    assetLoader.load(path, function (gltf) {
        model = gltf.scene;
        model.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                node.castShadow = castShadow;
                node.receiveShadow = receiveShadow;
            }
        });
        model.scale.set(scale.x, scale.y, scale.z);
        model.position.copy(position);
        model.rotation.copy(rotation);


        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const shape = new CANNON.Box(new CANNON.Vec3(size.x/2 , size.y/2 , size.z/2 ));
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
            //spaceship.tag = "spaceship";
            spaceshipBox.angularDamping = 1;
            //spaceshipBox.linearDamping = 0.5;
            spaceshipBox.velocity = new CANNON.Vec3(0, 0, -25);

            model.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    node.material = shaderMaterial;
                }
            });
        }

        else if (modelName == "sun") {
            sun = model;
            sunBox = body;
            //sun.tag = "sun";
            const dlight = new THREE.DirectionalLight(0xffffff, 15);
            dlight.position.set(model.position.x,model.position.y,model.position.z);
            scene.add(dlight);
        }
        else if (modelName == "earth") {
            earth = model;
            earthBox = body;
        }
        else if (modelName == "moon") {
            moon = model;
            moonBox = body;
        }

        else {
            if (window[modelName]) {
                window[modelName] = model;
                //window[modelName].tag = name;
            }
            if (window[modelName + "Box"]) {
                window[modelName + "Box"] = body;
            }
        }
        if (isCollectable) {
            collectableItems.push({
                model: model,
                body: body
            });
        }
    }, undefined, function (error) {
        console.error(error);
    });
}

function generateSpaceJunk() {
    removeSpaceJunk();
    const junkPositions = new Array(0);

    if (isRandom) {
        while (currentJunkCount <= maxJunkCount) {
            let {x, y, z} = generateRandPos(50, 2.5, 50);
            if (x*x + z*z > 121 && x*x + z*z < 625) {
                junkPositions.push([x, y, z]);
                currentJunkCount += 1;
            }
        }
    }
    else {
        // initially generate a five times larger random sample set
        while (currentJunkCount <= 5 * maxJunkCount) {
            let {x, y, z} = generateRandPos(50, 2.5, 50);
            if (x*x + z*z > 121 && x*x + z*z < 625) {
                junkPositions.push([x, y, z]);
                currentJunkCount += 1;
            }
        }

        // eliminates the samples with the most weight until the desired number of samples are met
        while (currentJunkCount > maxJunkCount) {
            let largestWeight = 0;
            let index;
            for (let i = 0; i < currentJunkCount; i++) {
                let weight = 0;
                const sample = junkPositions[i];
                for (let j = 0; j < currentJunkCount; j++) {
                    const comparison = junkPositions[j];
                    if ((sample[0] - comparison[0]) * (sample[0] - comparison[0]) + (sample[2] - comparison[2]) * (sample[2] - comparison[2]) < 9) {
                        weight += 1;
                    }
                }

                if (weight > largestWeight) {
                    largestWeight = weight;
                    index = i;
                }
            }

            junkPositions.splice(index, 1);
            currentJunkCount -= 1;
            //console.log(currentJunkCount);
        }
    }

    const junkloader = new Promise((resolve, reject) => {
        assetLoader.load('greenrock/scene.gltf', function(gltf) {
            const greenrock = gltf.scene;
            for (let i = 0; i < maxJunkCount/3; i++) {
                const junk = clone(greenrock);
                junk.position.set(...junkPositions[i]);
                junk.rotation.set(randFloatSpread((2 * Math.PI)), randFloatSpread((2 * Math.PI)), randFloatSpread((2 * Math.PI)));
                junk.scale.set(1, 1, 1);
                junk.userData.velocityx = randFloatSpread(0.001);
                junk.userData.velocityy = randFloatSpread(0.001);
                junk.userData.velocityz = randFloatSpread(0.001);
                junk.userData.rotationx = randFloatSpread(0.002);
                junk.userData.rotationy = randFloatSpread(0.002);
                junk.userData.rotationz = randFloatSpread(0.002);
                junk.name = "junk";
                scene.add(junk);
                junkArray.push(junk);
            }
            resolve();
        }, assetLoader.load('purplerock/scene.gltf', function(gltf) {
            const purplerock = gltf.scene;
            for (let i = 0; i < maxJunkCount/3; i++) {
                const junk = clone(purplerock);
                junk.position.set(...junkPositions[i + Math.floor((maxJunkCount / 3))]);
                junk.rotation.set(randFloatSpread((2 * Math.PI)), randFloatSpread((2 * Math.PI)), randFloatSpread((2 * Math.PI)));
                junk.scale.set(0.2, 0.2, 0.2);
                junk.userData.velocityx = randFloatSpread(0.001);
                junk.userData.velocityy = randFloatSpread(0.001);
                junk.userData.velocityz = randFloatSpread(0.001);
                junk.userData.rotationx = randFloatSpread(0.002);
                junk.userData.rotationy = randFloatSpread(0.002);
                junk.userData.rotationz = randFloatSpread(0.002);
                junk.name = "junk";
                scene.add(junk);
                junkArray.push(junk);
            }
            resolve();
        }, assetLoader.load('blueRock/scene.gltf', function(gltf) {
            const bluerock = gltf.scene;
            for (let i = 0; i < maxJunkCount/3; i++) {
                const junk = clone(bluerock);
                junk.position.set(...junkPositions[i + Math.floor((2 * maxJunkCount / 3))]);
                junk.rotation.set(randFloatSpread((2 * Math.PI)), randFloatSpread((2 * Math.PI)), randFloatSpread((2 * Math.PI)));
                junk.scale.set(0.005, 0.005, 0.005);
                junk.userData.velocityx = randFloatSpread(0.001);
                junk.userData.velocityy = randFloatSpread(0.001);
                junk.userData.velocityz = randFloatSpread(0.001);
                junk.userData.rotationx = randFloatSpread(0.002);
                junk.userData.rotationy = randFloatSpread(0.002);
                junk.userData.rotationz = randFloatSpread(0.002);
                junk.name = "junk";
                scene.add(junk);
                junkArray.push(junk);
            }
            resolve();
        }, undefined, function (error) {
            console.error(error);
            reject(error);
        })));
    });
}

let mixer;
let moonTheta = 0;
function update() {
    //controls.update(); // mouse update

    if (mixer) {
        mixer.update(0.01);
    }
    if (earth) {
        earthBox.angularVelocity.set(0, 0.02, 0);
        earth.quaternion.copy(earthBox.quaternion);
    }

    if (moon && earth) {
        moonBox.angularVelocity.set(0, 0.02, 0)
        moonTheta += 0.001;
        const s = Math.sin(moonTheta);
        const c = Math.cos(moonTheta);
        moonBox.position.set(40 * (c - s) - earth.position.x/2, -600, 30 * (s + c) - earth.position.z/2 );
        moon.position.copy(moonBox.position);

        moon.quaternion.copy(moonBox.quaternion);

    }
}
function generateRandPos(rangeX, rangeY, rangeZ) {
    let x = THREE.MathUtils.randFloatSpread( rangeX );
    let y = THREE.MathUtils.randFloatSpread( rangeY );
    let z = THREE.MathUtils.randFloatSpread( rangeZ );
    return {x, y, z};
}

function removeSpaceJunk() {
    for (let i = 0; i < currentJunkCount; i++) {
        scene.remove(scene.getObjectByName("junk"));
    }
    junkArray = [];
    currentJunkCount = 0;
}
    let switchscene = false;

    if( currentJunkCount > 0){
        switchscene = true;
    }
    return{ scene, camera, render, update, gui, hud , switchscene};
}