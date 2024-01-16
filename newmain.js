import spaceScene  from './spacescene.js';
import tableScene from './tablescene.js';
import * as THREE from 'three';


let renderer = new THREE.WebGLRenderer({powerPreference: "high-performance"});
let modelsLoaded = false;
let currentScene = 'space'; // Set the initial scene

let { render: tableRender, update: tableUpdate, scene: tableSceneObj, camera: tableCamera, gui: tableGui, hud: tableHUD} = tableScene(renderer);
let { render: spaceRender, update: spaceUpdate, scene: spaceSceneObj, camera: spaceCamera, gui: spaceGui, hud: spaceHUD, switchscene} = spaceScene(renderer);

let scenes = {
    'table': { render: tableRender, update: tableUpdate, scene: tableSceneObj, camera: tableCamera, gui: tableGui, hud: tableHUD},
    'space': { render: spaceRender, update: spaceUpdate, scene: spaceSceneObj, camera: spaceCamera, gui: spaceGui, hud: spaceHUD, switchscene: switchscene}
};



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
    if(event.key === 'r' || event.key === 'R'){
        if(switchscene){
            switchScene('table');
        }
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

render();
