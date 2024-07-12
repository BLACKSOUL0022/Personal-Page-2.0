import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FakeGlowMaterial } from '.FakeGlowMaterial.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setPixelRatio(window.devicePixelRatio); // Ajustar el pixel ratio según el dispositivo
renderer.setSize(window.innerWidth, window.innerHeight);
//scene.background = new THREE.Color(none);
document.body.appendChild(renderer.domElement);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// Ajustes de la cámara
camera.position.set(0, 0, 20); // Posición de la cámara (x, y, z)
camera.lookAt(0, 0, 0); // Dirección en la que mira la cámara (x, y, z)
camera.fov = 60; // Campo de visión en grados
camera.updateProjectionMatrix(); // Actualizar la matriz de proyección

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
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	renderer.render( scene, camera );
    renderer.setClearColor(0x000000, 0); // Color negro y transparencia
}