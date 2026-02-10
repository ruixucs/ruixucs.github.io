import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function init() {
    const container = document.getElementById('robot-container');
    if (!container) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    
    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.0;
    container.appendChild(renderer.domElement);

    // 4. Add Lights (very bright setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 2);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const bottomLight = new THREE.DirectionalLight(0xffffff, 1);
    bottomLight.position.set(0, -3, 5);
    scene.add(bottomLight);

    // 5. Create Placeholder (Cube) - REMOVED
    // const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    
    // Variable to store the object we want to rotate (cube or loaded model)
    let targetObject = null;

    // 6. GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
        '/assets/models/robot.glb',
        function (gltf) {
            const model = gltf.scene;
            
            // Adjust scale and position - keep centered to avoid clipping
            model.scale.set(2, 2, 2);
            model.position.set(1, 0, 0);
            
            scene.add(model);
            targetObject = model; // Update target object for rotation
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    // 7. Mouse Tracking Logic
    const mouse = new THREE.Vector2();
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function onDocumentMouseMove(event) {
        mouse.x = (event.clientX - windowHalfX) / 2;
        mouse.y = (event.clientY - windowHalfY) / 2;
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // 8. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        if (targetObject) {
            // Simple rotation to face the mouse position
            // We map mouse position to rotation angles
            // You might need to adjust the sensitivity (divisors) based on your preference
            
            const targetRotationX = mouse.y * 0.001;
            const targetRotationY = mouse.x * 0.001;

            targetObject.rotation.x += 0.05 * (targetRotationX - targetObject.rotation.x);
            targetObject.rotation.y += 0.05 * (targetRotationY - targetObject.rotation.y);
        }

        renderer.render(scene, camera);
    }

    animate();

    // 9. Handle Window Resize
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        // Update camera aspect ratio
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        // Update renderer size
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
