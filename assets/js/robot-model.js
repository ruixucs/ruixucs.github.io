import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function init() {
  const container = document.getElementById("robot-container");
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

  // 4. Add Lights
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

  let modelRoot = null;
  let headNode = null;

  // Responsive scale
  const vw = window.innerWidth;
  const scaleFactor = Math.max(0.8, Math.min(2, vw / 960));
  const modelScale = scaleFactor * 2;
  const modelPosX = scaleFactor * 1;

  // 5. GLTFLoader
  const loader = new GLTFLoader();
  loader.load(
    "/assets/models/robot.glb",
    function (gltf) {
      const model = gltf.scene;

      model.scale.set(modelScale, modelScale, modelScale);
      model.position.set(modelPosX, 0, 0);

      scene.add(model);
      modelRoot = model;

      // Print full node hierarchy for debugging
      console.log("[Robot] Model hierarchy:");
      model.traverse(function (child) {
        const depth = getDepth(child, model);
        const prefix = "  ".repeat(depth);
        console.log(`${prefix}${child.name || "(unnamed)"} [${child.type}]`);
      });

      // Search for head node by name (case-insensitive)
      const headNames = ["head", "kopf", "tete", "cranium"];
      model.traverse(function (child) {
        if (!headNode && child.name) {
          const lower = child.name.toLowerCase();
          for (const keyword of headNames) {
            if (lower.includes(keyword)) {
              headNode = child;
              console.log(`[Robot] Found head node: "${child.name}" [${child.type}]`);
              return;
            }
          }
        }
      });

      if (!headNode) {
        console.log("[Robot] No head node found, falling back to whole model rotation.");
      }
    },
    undefined,
    function (error) {
      console.error("[Robot] Load error:", error);
    }
  );

  function getDepth(obj, root) {
    let depth = 0;
    let current = obj;
    while (current.parent && current !== root) {
      depth++;
      current = current.parent;
    }
    return depth;
  }

  // 6. Pointer Tracking
  const mouse = new THREE.Vector2();
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  function onDocumentMouseMove(event) {
    mouse.x = event.clientX - windowHalfX;
    mouse.y = event.clientY - windowHalfY;
  }

  function onDocumentTouch(event) {
    if (event.touches.length >= 1) {
      mouse.x = event.touches[0].clientX - windowHalfX;
      mouse.y = event.touches[0].clientY - windowHalfY;
    }
  }

  document.addEventListener("mousemove", onDocumentMouseMove, false);
  document.addEventListener("touchstart", onDocumentTouch, { passive: true });
  document.addEventListener("touchmove", onDocumentTouch, { passive: true });

  // 7. Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    const rotTarget = headNode || modelRoot;
    if (rotTarget) {
      const sensitivity = headNode ? 0.003 : 0.002;
      const lerp = headNode ? 0.15 : 0.12;
      const maxAngle = headNode ? 0.4 : 0.6;

      const targetRotationX = THREE.MathUtils.clamp(mouse.y * sensitivity, -maxAngle, maxAngle);
      const targetRotationY = THREE.MathUtils.clamp(mouse.x * sensitivity, -maxAngle, maxAngle);

      rotTarget.rotation.x += lerp * (targetRotationX - rotTarget.rotation.x);
      rotTarget.rotation.y += lerp * (targetRotationY - rotTarget.rotation.y);
    }

    renderer.render(scene, camera);
  }

  animate();

  // 8. Handle Window Resize
  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);

    if (modelRoot) {
      const newVw = window.innerWidth;
      const newScale = Math.max(0.8, Math.min(2, newVw / 960)) * 2;
      const newPosX = Math.max(0.8, Math.min(2, newVw / 960)) * 1;
      modelRoot.scale.set(newScale, newScale, newScale);
      modelRoot.position.x = newPosX;
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
