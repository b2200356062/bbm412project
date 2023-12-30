import spaceScene  from './spacescene.js';
import tableScene from './tablescene.js';

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
    // Start rendering
    render();
    modelsLoaded = true;
}).catch((error) => {
    console.error('An error occurred while loading the models:', error);
});

function switchScene(sceneName) {
    if (sceneName === 'space' && !modelsLoaded) {
        console.log('Models are not loaded yet');
        return;
    }
    currentScene = sceneName;
}

window.addEventListener('keydown', (event) => {
    if (event.key === '1') {
        switchScene('table');
        spaceRender.dispose();
    } else if (event.key === '2') {
        switchScene('space');
        tableRender.dispose();
    }
});

let then = 0;
let fpsInterval = 1000 / 144; // for 60 fps
function render(now) {
    const elapsed = now - then;
    
    if (elapsed < fpsInterval) {
        requestAnimationFrame(render);
        return;
    }
    then = now - (elapsed % fpsInterval);

    // Only call the update and render functions of the current scene
    if (updateFunctions[currentScene]) {
        updateFunctions[currentScene]();
    }
    if (renderFunctions[currentScene]) {
        renderFunctions[currentScene]();
    }

    requestAnimationFrame(render);
}