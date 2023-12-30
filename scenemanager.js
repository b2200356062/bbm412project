export default class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
    }

    addScene(key, scene) {
        this.scenes[key] = scene;
    }

    switchScene(key) {
        this.currentScene = this.scenes[key];
    }

    render() {
        if (this.currentScene) {
            this.currentScene.render();
        }
    }
}