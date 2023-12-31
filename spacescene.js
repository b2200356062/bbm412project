// three js lib
import * as THREE from 'three'
// kamera kontrolleri
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// sliderlar için gui
import {GUI} from 'dat.gui'
// 3d model loader
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
// fps counter

//spaceScene();

export default function spaceScene(){

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    const canvas = document.querySelector('#canvas');
    
    const scene2 = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 50, WIDTH / HEIGHT, 0.001, 2000 );
    const renderer = new THREE.WebGLRenderer({canvas: canvas, powerPreference: "high-performance"});
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    
    camera.position.z = 50;
    
    let mixer;
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000, 1); // arkaplan rengi
    document.body.appendChild( renderer.domElement );
    
    const loader = new GLTFLoader();

    let earth;

    let earthLoaded = new Promise((resolve, reject) => {
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
    
    let sunLoaded = new Promise((resolve, reject) => {
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
    
    function update(){
        controls.update(); // mouse update

        if(mixer){
            mixer.update(0.01);
        }
        if(earth){
            earth.rotation.y += 0.002;
        }
    }

    // render function
    function render() {

        update();
           
        if (earthLoaded && sunLoaded) {
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
        }
    });
    
    //render();
    
    // function animate() {
    
    //     requestAnimationFrame(animate);
    
    //     var delta = clock.getDelta();
    
    //     if (mixer) mixer.update(delta);
    
    //     renderer.render();
    
    //     stats.update();
    // }

    return { scene2 , camera, earthLoaded, sunLoaded, render, update};
}

