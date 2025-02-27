import * as THREE from "three";
import Experience from "./utils/experience";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import * as dat from 'lil-gui';

import matcap2 from "/textures/red.png"
import matcap1 from "/textures/redd.png"
import matcap from "/textures/eyee.png"

export default class Model {
        constructor() {
                this.experience = new Experience();
                this.sizes = this.experience.sizes;
                this.scene = this.experience.scene;
                this.canvas = this.experience.canvas;
                this.camera = this.experience.camera;
                this.resources = this.experience.resources;
                this.time = this.experience.time; // Get the time instance
                // Initialize GUI
                this.gui = new dat.GUI();
                this.animationTime = 0;

                
                this.material = new THREE.ShaderMaterial({
                        uniforms:{
                                time: { value: 0},
                                mouse: { value: new THREE.Vector2(0,0) },
                                
                                
                                resolution: { value: new THREE.Vector4() },

                                

                                value11: { value: 1.0},
                                
                                rChannel: { value: 0.1},
                                gChannel: { value: 0.0},
                                bChannel: { value: 1.0},

                                rChannel2: { value: 1.0},
                                gChannel2: { value: 0.0},
                                bChannel2: { value: 1.0},

                                value1: { value: 1.0},
                                value2: { value: 1.0},
                                value3: { value: 1.0},
                        },
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader
                });

                const folder1 = this.gui.addFolder('Base Color');
folder1.add(this.material.uniforms.rChannel, 'value', 0, 1, 0.01)
    .name('rChannel')
    .onChange((value) => {
        this.material.uniforms.rChannel.value = value;
    });

folder1.add(this.material.uniforms.gChannel, 'value', 0, 1, 0.01)
    .name('gChannel')
    .onChange((value) => {
        this.material.uniforms.gChannel.value = value;
    });

folder1.add(this.material.uniforms.bChannel, 'value', 0, 1, 0.01)
    .name('bChannel')
    .onChange((value) => {
        this.material.uniforms.bChannel.value = value;
    });
    folder1.close();
// Create a folder for the second set of channels
const folder2 = this.gui.addFolder('Second Color');
folder2.add(this.material.uniforms.rChannel2, 'value', 0, 1, 0.01)
    .name('rChannel')
    .onChange((value) => {
        this.material.uniforms.rChannel2.value = value;
    });

folder2.add(this.material.uniforms.gChannel2, 'value', 0, 1, 0.01)
    .name('gChannel')
    .onChange((value) => {
        this.material.uniforms.gChannel2.value = value;
    });

folder2.add(this.material.uniforms.bChannel2, 'value', 0, 1, 0.01)
    .name('bChannel')
    .onChange((value) => {
        this.material.uniforms.bChannel2.value = value;
    });
                  
    folder2.close();
//     folder2.add(this.material.uniforms.value1, 'value', 0, 10, 0.01)
//     .name('value1')
//     .onChange((value) => {
//         this.material.uniforms.value1.value = value;
//     });

// folder2.add(this.material.uniforms.value2, 'value', 0, 10, 0.01)
//     .name('value2')
//     .onChange((value) => {
//         this.material.uniforms.value2.value = value;
//     });

// folder2.add(this.material.uniforms.value3, 'value', 0, 10, 0.01)
//     .name('value3')
//     .onChange((value) => {
//         this.material.uniforms.value3.value = value;
//     });
             

                   
    this.material.uniforms.value11.value =8.0;
        this.isHighValue = true;
        this.currentTween = null;

        const button = document.querySelector('button');
        button.addEventListener('click', () => {
            if (this.currentTween) {
                this.currentTween.kill();
            }
            
            const targetValue = this.isHighValue ? 1 : 8;
            this.isHighValue = !this.isHighValue;
            
            this.currentTween = gsap.to(this.material.uniforms.value11, {
                value: targetValue,
                duration: 5.2,  
                ease: "power2.inOut",  
                onUpdate: () => {
                    
                    this.material.uniforms.value11.needsUpdate = true;
                }
            });
        });
                    

                   
                this.imageAspect = 1;
                let a1; let a2;
                if (this.sizes.width > this.sizes.height) {
                        a1 =  (this.sizes.width/this.sizes.height) *this.imageAspect;
                        a2 = 1;
                } else {
                        a1 = 1;
                        a2 = (this.sizes.height/this.sizes.height) /this.imageAspect;
                }
                this.material.uniforms.resolution.value.x = this.sizes.width;
                this.material.uniforms.resolution.value.y = this.sizes.height;
                this.material.uniforms.resolution.value.z = a1;
                this.material.uniforms.resolution.value.w = a2;

                this.setModel();
                this.mouseEvents();
        }

        setModel() {  
                this.geometry = new THREE.PlaneGeometry(1, 1, 1,1); // Width, Height, Depth
                this.mesh = new THREE.Mesh(this.geometry, this.material); // Create the mesh
                this.scene.add(this.mesh);
        }

        mouseEvents() {
                this.mouse = new THREE.Vector2();
               document.addEventListener("mousemove", (e) => {
                this.mouse.x = e.clientX / this.sizes.width -0.5;
                this.mouse.y = -e.clientY / this.sizes.height + 0.5;
               });
        }

        resize() {
                this.imageAspect = 1;
                let a1; let a2;
                if (this.sizes.width > this.sizes.height) {
                        a1 =  (this.sizes.width/this.sizes.height) *this.imageAspect;
                        a2 = 1;
                } else {
                        a1 = 1;
                        a2 = (this.sizes.height/this.sizes.height) /this.imageAspect;
                }
                this.material.uniforms.resolution.value.x = this.sizes.width;
                this.material.uniforms.resolution.value.y = this.sizes.height;
                this.material.uniforms.resolution.value.z = a1;
                this.material.uniforms.resolution.value.w = a2;
        }

        update() {
            // Correct delta time calculation (0.001 instead of 0.0016)
            this.material.uniforms.time.value = this.time.elapsed * 0.001;
            
        }
}