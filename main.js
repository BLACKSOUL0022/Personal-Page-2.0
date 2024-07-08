import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio); // Ajustar el pixel ratio según el dispositivo
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajustes de la cámara
camera.position.set(0, 0, 80); // Posición de la cámara (x, y, z)
camera.lookAt(-12, -29.5, 0); // Dirección en la que mira la cámara (x, y, z)
camera.fov = 60; // Campo de visión en grados
camera.updateProjectionMatrix(); // Actualizar la matriz de proyección

// Configurar EffectComposer y UnrealBloomPass
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1,  // Strength
    0.1,  // Radius
    0  // Threshold
);
bloomPass.renderToScreen = true;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const loader = new GLTFLoader();
loader.load(
    'fox.gltf',
    function (gltf) {
        const model = gltf.scene; // Obtener el modelo cargado
        scene.add(model);

        // Acceder a las animaciones del modelo
        const animations = gltf.animations;
        if (animations && animations.length) {
            // Imprimir información de las animaciones disponibles
            console.log(`Número de animaciones: ${animations.length}`);
            animations.forEach((clip, index) => {
                console.log(`Animación ${index}: ${clip.name}`);
            });

            // Reproducir la primera animación por defecto
            const mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(animations[1]); // Selección de la primera animación
            action.play(); // Reproducir la animación

            // Función de animación del mixer
            function animate() {
                requestAnimationFrame(animate);
                mixer.update(0.0035); // Actualizar el mixer con un pequeño delta de tiempo
                composer.render(); // Usar el compositor en lugar de renderer
            }
            const light = new THREE.DirectionalLight(0xFEDF72, 0x05);
            light.position.set(0, 1, 1);
            scene.add(light);
            animate();
        }

        // Asignar color a todos los materiales del modelo
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF, // Color del modelo
                    emissive: 0xFEEF9F, // Color de la emisión
                    emissiveIntensity: 0.2 // Intensidad de la emisión
                });
            }
        });
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);

function animate() {
    requestAnimationFrame(animate);
    composer.render(); // Usar el compositor en lugar de renderer
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); // Ajustar el tamaño del compositor
});
