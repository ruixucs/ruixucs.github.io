---
layout: page
is_project: true
title: 3D segmentation within root system architecture
description: Root systems are fundamental to the growth and health of nearly all plant species. Phenotyping these systems has been a long-lasting bottleneck in plant breeding due to their complex nature and the indispensable morphological information they contain. This project seeks to advance the precision of root system analysis by segmenting the primary root and all first-order lateral roots. Through this approach, we aim to achieve more accurate measurements of their essential traits, including root length, angles, diameters, and surface areas, thereby improving the efficiency and effectiveness of breeding programs.
img: assets/gif/root_system_demo.gif
importance: 2
category: work
related_publications: false
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/gif/root_input.gif" title="root_input" class="img-fluid rounded z-depth-1" %}
        <div class="caption">
            Input root system point cloud.
        </div>
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/gif/root_primary_removed.gif" title="primary_root" class="img-fluid rounded z-depth-1" %}
        <div class="caption">
            Primary root segmentation.
        </div>
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/gif/root_secondary.gif" title="secondary_root" class="img-fluid rounded z-depth-1" %}
        <div class="caption">
            Lateral roots.
        </div>
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/gif/individual_segmented.gif" title="secondary_root" class="img-fluid rounded z-depth-1" %}
        <div class="caption">
            Lateral roots.
        </div>
    </div>
</div>


<!-- Include three.js and PLYLoader via CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/PLYLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

<div class="row mt-4">
    <!-- Left Column: 3D Viewer (1/2 of the row) -->
    <div class="col-md-5">
        <!-- Container for the 3D Viewer -->
        <div id="threejs-container" style="width: 100%; height: 400px; margin-bottom: 2rem;"></div>
    </div>
    <!-- Right Column: Description Text (1/2 of the row) -->
    <div class="col-md-7">
        <h5>Interactive Arabidopsis root system segmentation</h5>
        <p>
            Explore the intricacies of the Arabidopsis root system through our interactive viewer. Zoom in, zoom out, and rotate the segmented model on the left to discover more details. Have fun!
        </p>
        <p>
            In this project, we utilized 3D segmentation models, including the <a href="https://github.com/Pointcept/Pointcept">Point Transformer</a>, to segment the primary root. After isolating and removing the primary root from the root system architecture, we applied the HDBSCAN algorithm, which demonstrated robust performance in segmenting lateral roots. This segmentation pipeline has proven effective for simpler root system architectures like that of Arabidopsis. However, it has limitations when tackling the complexity of more intricate systems such as those of soybeans and maize.
        </p>
        <p>
            We have improved our lateral root segmentation algorithms to better address the complexities of diverse root systems, as demonstrated in the examples below. This work is ongoing, and we invite you to stay updated by following our future works.
        </p>
    </div>
</div>

<!-- JavaScript to Initialize Three.js and Load PLY File -->
<script>
document.addEventListener("DOMContentLoaded", function() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const container = document.getElementById('threejs-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, -1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);

    const loader = new THREE.PLYLoader();
    loader.load(
        '{{ "/assets/ply/arabidopsis_root_demo.ply" | relative_url }}',
        function (geometry) {
            geometry.computeVertexNormals();
            geometry.center();

            const material = new THREE.PointsMaterial({
                size: 0.001,
                color: 0xffffff,
                vertexColors: THREE.VertexColors, // Enable vertex colors
                transparent: true,
                opacity: 0.8
            });

            const points = new THREE.Points(geometry, material);
            scene.add(points);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened while loading the PLY file:', error);
        }
    );

    window.addEventListener('resize', function() {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});
</script>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/gif/root_system_demo_origin.gif" title="strawberry counting" class="img-fluid rounded z-depth-1" %}
        <div class="caption">
            Input soybean root system.
        </div>
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/gif/root_system_demo.gif" title="tomato counting" class="img-fluid rounded z-depth-1" %}
        <div class="caption">
            Individual root segmentation.
        </div>
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/gif/root_system_demo_path_zoom.gif" title="tomato counting" class="img-fluid rounded z-depth-1" %}
        <div class="caption">
            Zoom-in.
        </div>
    </div>
</div>

## Cite our works
If you find this work helpful for your research, we kindly request that you cite the following papers:

```
@inproceedings{zhou20243d,
  title={3D segmentation within the root system architecture using Point Transformer},
  author={Zhou, Xuehai and Bai, Leshang and Xu, Rui and Kang, Rui and Torkamaneh, Davoud and Sun, Shangpeng},
  booktitle={2024 ASABE Annual International Meeting},
  pages={1},
  year={2024},
  organization={American Society of Agricultural and Biological Engineers}
}
```
