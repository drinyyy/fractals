import * as THREE from "three";
import Experience from "./utils/experience";
import GUI from 'lil-gui';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;

        // Lights setup
        this.lights();
       
       
        // this.setGUI();
    }

    lights() {
        // Ambient Light
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        // First Point Light
        this.pointlight = new THREE.PointLight(0xffffff, 1.27, 100);
        this.pointlight.position.set(0.18, 1.36, 1.07);
        this.pointlight.shadow.mapSize.width = 2048;
        this.pointlight.shadow.mapSize.height = 2048;
        this.pointlight.shadow.camera.near = 0.01;
        this.pointlight.shadow.camera.far = 100;
        this.pointlight.shadow.bias = -0.001;
        this.pointlight.castShadow = true;
        this.scene.add(this.pointlight);

        // Helper for First Point Light
        // const sphereSize = 0.1;
        // this.pointLightHelper = new THREE.PointLightHelper(this.pointlight, sphereSize);
        // this.scene.add(this.pointLightHelper);

        // Second Point Light
        // this.pointlight1 = new THREE.PointLight(0x039dfc, 1.67, 100);
        // this.pointlight1.position.set(-0.32, 1.36, -0.82);
        // this.pointlight1.shadow.mapSize.width = 2048;
        // this.pointlight1.shadow.mapSize.height = 2048;
        // this.pointlight1.shadow.camera.near = 0.01;
        // this.pointlight1.shadow.camera.far = 100;
        // this.pointlight1.shadow.bias = -0.001;
        // this.pointlight1.castShadow = true;
        // this.scene.add(this.pointlight1);

        
        // Helper for Second Point Light
        // this.pointLightHelper1 = new THREE.PointLightHelper(this.pointlight1, sphereSize);
        // this.scene.add(this.pointLightHelper1);
    }
  

    setGUI() {
        // Initialize GUI
        this.gui = new GUI();

        // Folder for the first point light
        const pointLightFolder = this.gui.addFolder('Lights#1');
        pointLightFolder.addColor(this.pointlight, 'color').name('Color');
        pointLightFolder.add(this.pointlight, 'intensity', 0, 100, 0.01).name('Intensity');
        pointLightFolder.add(this.pointlight.position, 'x', -10, 10, 0.01).name('Position X');
        pointLightFolder.add(this.pointlight.position, 'y', -10, 10, 0.01).name('Position Y');
        pointLightFolder.add(this.pointlight.position, 'z', -10, 10, 0.01).name('Position Z');
        pointLightFolder.open();

        // Folder for the second point light
        const pointLight1Folder = this.gui.addFolder('Lights#2');
        pointLight1Folder.addColor(this.pointlight1, 'color').name('Color');
        pointLight1Folder.add(this.pointlight1, 'intensity', 0, 100, 0.01).name('Intensity');
        pointLight1Folder.add(this.pointlight1.position, 'x', -10, 10, 0.01).name('Position X');
        pointLight1Folder.add(this.pointlight1.position, 'y', -10, 10, 0.01).name('Position Y');
        pointLight1Folder.add(this.pointlight1.position, 'z', -10, 10, 0.01).name('Position Z');
        pointLight1Folder.open();
    }

    update() {
        // Any dynamic updates needed for the lights can go here.
    }
}
