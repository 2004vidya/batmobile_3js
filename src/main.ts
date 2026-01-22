import gsap from 'gsap';
import '/src/style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';


const scene  = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(44,window.innerWidth/window.innerHeight,0.1,100);
camera.position.z = 18 ;
camera.position.y = 2 ;
camera.position.x = 0;

let model: THREE.Object3D | null = null;

const loader = new GLTFLoader();
loader.load('/batmobil_car.glb',(gltf)=>{
  scene.add(gltf.scene);
   gltf.scene.rotation.y = Math.PI /4;                
   gltf.scene.position.x=0;
   model= gltf.scene;
   updateModelScale();
},undefined,(error)=>{
  console.error(error);
});

function updateModelScale() {
  if (model) {
    const baseScale = 1.5; // Adjust this base scale as needed
    const scaleFactor = Math.min(window.innerWidth / 1920, 0.8); // Scale down for widths < 1920px, cap at 1
    model.scale.setScalar(baseScale * scaleFactor);
  }
}
const exrLoader = new EXRLoader();
exrLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/rogland_clear_night_1k.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  // scene.background = texture;
}, undefined, (error) => {
  console.error(error);
});



const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  antialias: true,
  alpha:true

});

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();










window.addEventListener("mousemove",(e)=>{
  if(model){
    const rotationX = (e.clientX/window.innerWidth - 0.5) * Math.PI*0.7; // Rotate around Y-axis
    const rotationY = (e.clientY/window.innerHeight - 0.5) * Math.PI*0.7; // Rotate around X-axis
    gsap.to(model.rotation,{
      x:rotationY,
      y:rotationX,
      duration:0.5,
      ease:"power2.out"
    })
  }


})

window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  updateModelScale();
})

function animate(){
  window.requestAnimationFrame(animate);
  // mesh.rotation.x+=0.1;
  renderer.render(scene,camera);

    // composer.render();

}

animate();

