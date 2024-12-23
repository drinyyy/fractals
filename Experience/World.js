import * as THREE from "three";
import Experience from "./utils/experience.js";
import Environment from "./Environment.js";

import Model from "./Model.js";

import { EventEmitter } from "events";

export default class World extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
    
      
        this.resources.on("ready", () => {
            this.environment = new Environment();
            this.model = new Model();
            
           
            this.emit("worldready");
        });
    }
    
    

    

   

    
    
    
    
    resize() {
        this.model.resize();
    }

    update() {
        if (this.model) {
            this.model.update();
        }
       
        if (this.environment) {
            this.environment.update();
        }
    }
}
