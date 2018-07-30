import * as THREE from "three";
import {Create3d} from "./create3d";
import {updateCurrentObj} from "../controller/updateCurrentObj";
import {mainHtml} from "../view/mainHtml";
import {updateCamera} from "../controller/updateCamera";
import {FirstPersonControls} from "../controller/FirstPersonControls";
import {ModelCamera} from "../model/modelCamera";
import {OrbitControls} from "../controller/OrbitControls";
import {HandleHelper} from "./handleHelper";

let app3d: any;
let render:Function;
let dataModel:any = {};

function main3d() {
    app3d = new Create3d("area3d");
    render = app3d.render;
    app3d.camera.position.set(0, 5, 20);
    // app3d.camera.lookAt(app3d.scene.position);

    let mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        })
    );
    app3d.scene.add(mesh);

    app3d.currentObj = mesh;

    dataModel.camera = new ModelCamera();
    dataModel.camera.spherical.setFromVector3(app3d.scene.position);

    // let personControls = new FirstPersonControls(app3d.camera, app3d.renderer.domElement);

    let orbitControls = new OrbitControls(app3d.camera, app3d.renderer.domElement);
    app3d.loopFn.push(function() {
        orbitControls.update();
        app3d.render();
    });


    let handleHelper = new HandleHelper();
    app3d.scene.add(handleHelper.object);

    let girdHelper = new THREE.GridHelper(50, 50);
    app3d.scene.add(girdHelper);

    mainHtml();
    updateCurrentObj();
    updateCamera();

    app3d.render();
}

export {main3d, app3d, dataModel};