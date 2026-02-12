import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function init() {
    const container = document.getElementById('robot-container');
    if (!container) return;

    // Detect mobile
    const isMobile = window.innerWidth <= 768;

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

    // Variable to store the object we want to rotate
    let targetObject = null;

    // Responsive scale: smaller on mobile
    const modelScale = isMobile ? 1.2 : 2;
    const modelPosX = isMobile ? 0.5 : 1;

    // 5. GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
        '/assets/models/robot.glb',
        function (gltf) {
            const model = gltf.scene;
            
            model.scale.set(modelScale, modelScale, modelScale);
            model.position.set(modelPosX, 0, 0);
            
            scene.add(model);
            targetObject = model;
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    // 6. Pointer Tracking Logic (mouse + touch)
    const mouse = new THREE.Vector2();
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    // Mouse tracking (desktop)
    function onDocumentMouseMove(event) {
        mouse.x = (event.clientX - windowHalfX) / 2;
        mouse.y = (event.clientY - windowHalfY) / 2;
    }

    // Touch tracking (mobile) - touch where you want the robot to look
    function onDocumentTouch(event) {
        if (event.touches.length >= 1) {
            mouse.x = (event.touches[0].clientX - windowHalfX) / 2;
            mouse.y = (event.touches[0].clientY - windowHalfY) / 2;
        }
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouch, { passive: true });
    document.addEventListener('touchmove', onDocumentTouch, { passive: true });

    // 7. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        if (targetObject) {
            const targetRotationX = mouse.y * 0.001;
            const targetRotationY = mouse.x * 0.001;

            targetObject.rotation.x += 0.05 * (targetRotationX - targetObject.rotation.x);
            targetObject.rotation.y += 0.05 * (targetRotationY - targetObject.rotation.y);
        }

        renderer.render(scene, camera);
    }

    animate();

    // 8. Handle Window Resize
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
