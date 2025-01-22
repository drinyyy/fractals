import * as THREE from 'three';
import Experience from "./experience";
import { gsap } from 'gsap';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
       
        
        
       this.frustum = 1
        
        this.createPerspectiveCamera();
        // this.createOrbitControls();
    }

    createPerspectiveCamera() {
       
        
        this.orthographicCamera = new THREE.OrthographicCamera(
            this.frustum / -2, this.frustum /2, this.frustum/2, this.frustum/-2, -100, 100
        );
        // this.lookAtTarget.set(0, 1.3, 0); // Initial lookAt target

        
        
        
        this.scene.add(this.orthographicCamera);
       
        
    }

    createOrbitControls() {
        
        this.controls = new OrbitControls(this.orthographicCamera, this.canvas);
        this.controls.enableDamping = true; // Enable damping for smooth camera movements
        this.controls.dampingFactor = 0.05;
         // Set the target for OrbitControls to the same as lookAt
    }

    resize() {
      
        
       

        this.orthographicCamera.left =
            this.frustum / -2;
        this.orthographicCamera.right =
            this.frustum / 2;
        this.orthographicCamera.top = this.frustum / 2;
        this.orthographicCamera.bottom = this.frustum / -2;
        this.orthographicCamera.updateProjectionMatrix();
        
    }
    

    update() {
        
    }
}
