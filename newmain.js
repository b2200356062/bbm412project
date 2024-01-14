import spaceScene  from './spacescene.js';
import tableScene from './tablescene.js';
import Stats from "three/addons/libs/stats.module.js";
import * as THREE from 'three';

// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

let renderer = new THREE.WebGLRenderer();
let modelsLoaded = false;
let currentScene = 'table'; // Set the initial scene

let { render: tableRender, update: tableUpdate, scene: tableSceneObj, camera: tableCamera, gui } = tableScene(renderer);
//let { render: spaceRender, update: spaceUpdate, scene: spaceSceneObj, camera: spaceCamera, earthloader, sunloader } = spaceScene(renderer);

let scenes = {
    'table': { render: tableRender, update: tableUpdate, scene: tableSceneObj, camera: tableCamera },
    //'space': { render: spaceRender, update: spaceUpdate, scene: spaceSceneObj, camera: spaceCamera}
};


// Promise.all([earthloader, sunloader]).then(() => {
    
//     modelsLoaded = true;
// }).catch((error) => {
//     console.error('An error occurred while loading the models:', error);
// });

requestAnimationFrame(render);

function switchScene(sceneName) {
    // Check if the scene exists
    if (!scenes[sceneName]) {
        console.error('The scene does not exist:', sceneName);
        return;
    }
    // Switch to the new scene
    currentScene = sceneName;
}

window.addEventListener('keydown', (event) => {
    if (event.key === '1') {
        switchScene('table');
        gui.show();
    } else if (event.key === '2') {
        switchScene('space');
        gui.hide();
    }
});

// resize function
window.addEventListener('resize', function () {

    // Update the camera's aspect ratio and projection matrix
    scenes[currentScene].camera.aspect = window.innerWidth / window.innerHeight;
    scenes[currentScene].camera.updateProjectionMatrix();

    // Update the renderer's size
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function render() {
    scenes[currentScene].update();
    scenes[currentScene].render();

    requestAnimationFrame(render);
}