import spaceScene  from './script.js';
import tableScene from './tablescene.js';
import Stats from "three/addons/libs/stats.module.js";
import * as THREE from 'three';

// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

let renderer = new THREE.WebGLRenderer();
let modelsLoaded = false;
let currentScene = 'space'; // Set the initial scene

let { render: tableRender, update: tableUpdate, scene: tableSceneObj, camera: tableCamera, gui: tableGui } = tableScene(renderer);
let { render: spaceRender, update: spaceUpdate, scene: spaceSceneObj, camera: spaceCamera, gui: spaceGui, switchscene} = spaceScene(renderer);

let scenes = {
    'table': { render: tableRender, update: tableUpdate, scene: tableSceneObj, camera: tableCamera, gui: tableGui},
    'space': { render: spaceRender, update: spaceUpdate, scene: spaceSceneObj, camera: spaceCamera, gui: spaceGui, switchscene: switchscene}
};

if(switchScene){

}
// Promise.all([earthloader, sunloader]).then(() => {

//     modelsLoaded = true;
// }).catch((error) => {
//     console.error('An error occurred while loading the models:', error);
// });

render();

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

    } else if (event.key === '2') {
        switchScene('space');

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
    if (currentScene === 'space') {
        scenes['space'].update();
        scenes['space'].render();
        tableGui.hide();
        spaceGui.show();

    } else if (currentScene === 'table') {
        scenes['table'].update();
        scenes['table'].render();
        tableGui.show();
        spaceGui.hide();
    }
    requestAnimationFrame(render);
}