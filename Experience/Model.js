import * as THREE from "three";
import Experience from "./utils/experience";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import matcap from "/textures/blue2.jpg"
import matcap1 from "/textures/purple.png"

console.log(matcap)
export default class Model {
        constructor() {
                this.experience = new Experience();
                this.sizes = this.experience.sizes;
                this.scene = this.experience.scene;
                this.canvas = this.experience.canvas;
                this.camera = this.experience.camera;
                this.resources = this.experience.resources;

               
                this.material = new THREE.ShaderMaterial({

                        uniforms:{
                                time: { value: 0},
                                mouse: { value: new THREE.Vector2(0,0) },
                                matcap: { value: new THREE.TextureLoader().load(matcap) },
                                matcap1: { value: new THREE.TextureLoader().load(matcap1) },
                                resolution: { value: new THREE.Vector4() },
                                
                        },
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader
                        
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
                
                this.material.uniforms.time.value += 0.002;
                this.material.uniforms.mouse.value = this.mouse;
               
        }
}