import * as THREE from "three";
import "../lib/PostProcessing";
import "../lib/FXAAShader";
import "../lib/OutlinePass";
import "../lib/SSAARenderPass";

class Create3d {
    public camera: THREE.Camera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public rect: any;
    public wrapDom: any;
    public controls: any;
    public composer: THREE.EffectComposer;
    public outlinePass: THREE.OutlinePass;
    public clock: THREE.Clock;
    public enableComposer:boolean;
    private clearColor: number;
    private clearAlpha: number;

    constructor(params:any) {
        let domId = params.domId !== undefined ? params.domId : "area3d";
        this.clearColor = params.bgColor !== undefined ? params.bgColor : 0x000000;
        this.clearAlpha = params.bgAlpha !== undefined ? params.bgAlpha : 1;

        this.wrapDom = document.getElementById(domId);
        this.enableComposer = true;

        this.getRect();
        this.initCamera();
        this.initScene();
        this.initRenderer();
        this.initClock();
        this.initComposer();
        // this.initControls();

    }

    private getRect = () => {
        this.rect = this.wrapDom.getBoundingClientRect();
    }


    private initCamera = () => {
        let width = this.rect.width;
        let height = this.rect.height;
        this.camera = new THREE.PerspectiveCamera(60, width/height,1, 1000);
        this.camera.position.set(0, 0, 10);
    }
    private initScene = () => {
        this.scene = new THREE.Scene();
    }
    private initRenderer = () => {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(this.clearColor, this.clearAlpha);
        this.renderer.setSize(this.rect.width, this.rect.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.wrapDom.appendChild(this.renderer.domElement);
    }
    private initComposer = () => {
        this.composer = new THREE.EffectComposer(this.renderer);

        var ssaaRenderPass = new THREE.SSAARenderPass(this.scene, this.camera);
        ssaaRenderPass.unbiased = false;
        ssaaRenderPass.sampleLevel = 2;
        ssaaRenderPass.clearColor = this.clearColor;
        ssaaRenderPass.clearAlpha = this.clearAlpha;
        this.composer.addPass(ssaaRenderPass);

        this.outlinePass = new THREE.OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera
        );
        this.outlinePass.visibleEdgeColor.set(0xffff00);
        this.outlinePass.hiddenEdgeColor.set(0xffff00);
        this.outlinePass.edgeThickness = 3;
        this.outlinePass.edgeStrength = 10;
        this.outlinePass.pulsePeriod = 0;
        this.composer.addPass(this.outlinePass);

        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;
        this.composer.addPass(effectCopy);

    }
    public addOutlineObject = (obj:THREE.Object3D) => {
        this.outlinePass.selectedObjects = [];
        this.outlinePass.selectedObjects.push(obj);
    }
    public clearOutline = () => {
        this.outlinePass.selectedObjects = [];
    }
    private initClock = () => {
        this.clock = new THREE.Clock();
    }
    // private initControls() {
    //     this.controls = new OrbitControls(this.camera, this.wrapDom);
    // }
    public render = () => {
        this.renderer.render(this.scene, this.camera);
    }
    public composerRender = () => {
        this.composer.render(this.clock.getDelta());
    }
    public activeRender = () => {
        if(this.enableComposer) {
            this.composerRender();
        } else {
            this.render();
        }
    }
}

export {Create3d};