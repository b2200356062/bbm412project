import spaceScene  from './spacescene.js';
import tableScene from './tablescene.js';
import Stats from "three/addons/libs/stats.module.js";

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

let { render: tableRender, update: tableUpdate } = tableScene();
let { render: spaceRender, earthLoaded: earthloader, sunLoaded: sunloader } = spaceScene();

let currentScene = 'table';
let modelsLoaded = false;

let renderFunctions = {
    'table': tableRender,
    'space': spaceRender
};

let updateFunctions = {
    'table': tableUpdate,
    'space': function() {
        // update logic for space scene
    }
};

Promise.all([earthloader, sunloader]).then(() => {
    render();
    modelsLoaded = true;
}).catch((error) => {
    console.error('An error occurred while loading the models:', error);
});

function switchScene(sceneName) {
    // Check if the scene exists
    if (renderFunctions[sceneName] && updateFunctions[sceneName]) {
        // Switch to the new scene
        currentScene = sceneName;
    } else {
        console.error('Scene not found:', sceneName);
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === '1') {
        switchScene('table');

    } else if (event.key === '2') {
        console.log("heheh");
        switchScene('space');
    }
});

let then = 0;
let fpsInterval = 1000 / 60; // for 60 fps

function render(now) {
    const elapsed = now - then;
    
    if (elapsed < fpsInterval) {
        requestAnimationFrame(render);
        return;
    }
    then = now - (elapsed % fpsInterval);
    
    if (updateFunctions[currentScene]) {
        updateFunctions[currentScene]();
    }
    if (renderFunctions[currentScene]) {
        renderFunctions[currentScene]();
    }

    stats.update();
    requestAnimationFrame(render);
}