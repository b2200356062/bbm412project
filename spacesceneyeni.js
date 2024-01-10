// three js lib
import * as THREE from 'three'
// kamera kontrolleri
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// sliderlar için gui
import {GUI} from 'dat.gui'
// 3d model loader
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {randFloatSpread} from "three/src/math/MathUtils";
import math from "dat.gui/src/dat/color/math";
import {clone} from "three/addons/utils/SkeletonUtils";
import {TGALoader} from "three/addons";
// fps counter

//spaceScene();

export default function spaceScene(){

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    const canvas = document.querySelector('#canvas');
    
    const scene2 = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 50, WIDTH / HEIGHT, 0.001, 30000 );
    const renderer = new THREE.WebGLRenderer({canvas: canvas, powerPreference: "high-performance"});
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    
    camera.position.z = 50;
    
    let mixer;
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000, 1); // arkaplan rengi
    document.body.appendChild( renderer.domElement );
    
    const loader = new GLTFLoader();

    // space skybox
    /*
    const tgaloader = new TGALoader();

    const ft = 'galaxy/galaxy+Z.tga';
    const bk = 'galaxy/galaxy-Z.tga';
    const up = 'skybox/2.png';
    const dn = 'skybox/5.png';
    const rt = 'skybox/3.png';
    const lf = 'skybox/6.png';


    const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const skyboxImagePaths = [ft, bk, up, dn, rt, lf];
    const materialArray = skyboxImagePaths.map(image => {
        //const texture = new THREE.TextureLoader().load(image);
        const texture = tgaloader.load(image);


        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide});
    })

    const skybox = new THREE.Mesh(skyboxGeometry, materialArray);
    scene2.add(skybox);

     */

    let earth;

    let earthloader = new Promise((resolve, reject) => {
        loader.load('earth2/scene.gltf', function (gltf) {
            earth = gltf.scene;
            earth.scale.set(0.1, 0.1, 0.1);
            earth.position.set(0, 0, 0);
            scene2.add(gltf.scene)
            resolve();
        }, undefined, function (error) {
            console.error(error);
            reject(error);
        });
    });

    let sun;
    
    let sunloader= new Promise((resolve, reject) => {
        loader.load('sun/scene.gltf', function (gltf) {
            sun = gltf.scene;
            sun.position.set(1000, 0, 0);
            sun.scale.set(5, 5, 5);
            scene2.add(sun);
            resolve();
        }, undefined, function (error) {
            console.error(error);
            reject(error);
        });
    });

    let moon;

    let moonTheta = 0;      // for orbit around earth

    let moonloader = new Promise((resolve, reject) => {
        loader.load('moon/scene.gltf', function(gltf) {
            moon = gltf.scene;
            moon.position.set(15, 0, 0);
            moon.scale.set(9, 9, 9);
            scene2.add(moon);
            resolve();
        }, undefined, function (error) {
            console.error(error);
            reject(error);
        });
    });


    
    // directional light
    const dlight = new THREE.DirectionalLight(0xffffff, 2);
    dlight.position.set(1,0,0);
    scene2.add(dlight);
    
    // ambient light
    const alight = new THREE.AmbientLight(0x242424);
    scene2.add(alight);
    
    // mouse controls
    const controls = new OrbitControls(camera, renderer.domElement);

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
    const sprite = new THREE.TextureLoader().load('/star.png');
    sprite.colorSpace = THREE.SRGBColorSpace;
    
    starsGeometry.setAttribute(
        "position", new THREE.Float32BufferAttribute(stars, 3)
    );
    
    const starsMaterial = new THREE.PointsMaterial( { color: 0xffffff, map: sprite, transparent: true, size: 1, sizeAttenuation: true} );
    const spacebackground = new THREE.Points( starsGeometry, starsMaterial );
    scene2.add(spacebackground);


    // space junk

    let maxJunkCount = 70;
    let currentJunkCount = 0;
    let junkArray = [];

    let isRandom = false;

    generateSpaceJunk();

    // generates a random set of space junk with the given count
    function generateSpaceJunk() {
        removeSpaceJunk();

        const junkPositions = new Array(0);

        if (isRandom) {
            while (currentJunkCount <= maxJunkCount) {
                let x = THREE.MathUtils.randFloatSpread( 50 );
                let y = THREE.MathUtils.randFloatSpread( 2.5 );
                let z = THREE.MathUtils.randFloatSpread( 50 );
                if (x*x + z*z > 121 && x*x + z*z < 625) {
                    junkPositions.push([x, y, z]);
                    currentJunkCount += 1;
                }
            }
        }
        else {
            // initially generate a five times larger random sample set
            while (currentJunkCount <= 5 * maxJunkCount) {
                let x = THREE.MathUtils.randFloatSpread( 50 );
                let y = THREE.MathUtils.randFloatSpread( 2.5 );
                let z = THREE.MathUtils.randFloatSpread( 50 );
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
                console.log(currentJunkCount);
            }
        }


        const junkloader = new Promise((resolve, reject) => {
            loader.load('greenrock/scene.gltf', function(gltf) {
                const greenrock = gltf.scene;
                for (let i = 0; i < maxJunkCount/3; i++) {
                    const junk = clone(greenrock);
                    junk.position.set(...junkPositions[i]);
                    junk.rotation.set(randFloatSpread((2 * Math.PI)), randFloatSpread((2 * Math.PI)), randFloatSpread((2 * Math.PI)));
                    junk.scale.set(0.1, 0.1, 0.1);
                    junk.userData.velocityx = randFloatSpread(0.001);
                    junk.userData.velocityy = randFloatSpread(0.001);
                    junk.userData.velocityz = randFloatSpread(0.001);
                    junk.userData.rotationx = randFloatSpread(0.002);
                    junk.userData.rotationy = randFloatSpread(0.002);
                    junk.userData.rotationz = randFloatSpread(0.002);
                    junk.name = "junk";
                    scene2.add(junk);
                    junkArray.push(junk);
                }
                resolve();
            }, loader.load('purplerock/scene.gltf', function(gltf) {
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
                    scene2.add(junk);
                    junkArray.push(junk);
                }
                resolve();
            }, loader.load('bluerock/scene.gltf', function(gltf) {
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
                    scene2.add(junk);
                    junkArray.push(junk);
                }
                resolve();
            }, undefined, function (error) {
                console.error(error);
                reject(error);
            })));
        });

    }

    function removeSpaceJunk() {
        for (let i = 0; i < currentJunkCount; i++) {
            scene2.remove(scene2.getObjectByName("junk"));
        }
        junkArray = [];
        currentJunkCount = 0;
    }



    
    function update(){
        controls.update(); // mouse update

        if(mixer){
            mixer.update(0.01);
        }
        if(earth){
            earth.rotation.y += 0.002;
        }

        if (moon){
            moon.rotation.y += 0.002;
            moonTheta += 0.001;
            const s = Math.sin(moonTheta);
            const c = Math.cos(moonTheta);
            moon.position.x = 20 * (c - s);
            moon.position.z = 20 * (s + c);
        }


        for (let i = 0; i < currentJunkCount; i++) {
            let junk = junkArray[i];
            if (junk) {
                junk.position.x += junk.userData.velocityx;
                junk.position.y += junk.userData.velocityy;
                junk.position.z += junk.userData.velocityz;
                junk.rotation.x += junk.userData.rotationx;
                junk.rotation.y += junk.userData.rotationy;
                junk.rotation.z += junk.userData.rotationz;
            }
        }
    }

    // render function
    function render() {
        update();
        if (earthloader && sunloader && moonloader) {
            renderer.render(scene2, camera);
        }
    }
    
    
    // controls
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
                camera.rotation.y += Math.PI / 60;
                break;
            case 'KeyE':
                camera.rotation.y -= Math.PI / 60;
                break;
            case 'KeyR':
                generateSpaceJunk();
                break;
            case 'KeyT':
                removeSpaceJunk();
                break;
            case 'KeyY':
                isRandom = !isRandom;
                if (isRandom) {
                    console.log("random");
                }
                else {
                    console.log("poisson");
                }
                break;
        }
    });

    const gui2 = new GUI();

    gui2.add({name: "Junk Count", value: maxJunkCount}, 'value', 10, 300)
        .name( "Junk Count" )
        .onChange( function (value) {
            maxJunkCount = value;
        });
    
    //render();
    
    // function animate() {
    
    //     requestAnimationFrame(animate);
    
    //     var delta = clock.getDelta();
    
    //     if (mixer) mixer.update(delta);
    
    //     renderer.render();
    
    //     stats.update();
    // }

    return { scene2 , camera, earthloader, sunloader, render, update};
}



