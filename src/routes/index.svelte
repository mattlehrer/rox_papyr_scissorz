<script>
	import * as SC from 'svelte-cubed';
	import * as THREE from 'three';

	let width = 5;
	let height = 5;
	let depth = 5;
	let camX = 1,
		camY = 1,
		camZ = 3;
	let fov = 75;

	let spin = 0;

	SC.onFrame(() => {
		spin += 0.01;
	});
</script>

<SC.Canvas
	antialias
	background={new THREE.Color('black')}
	fog={new THREE.FogExp2('papayawhip', 0.1)}
	shadows
>
	<SC.Group position={[0, 0, 0]}>
		<SC.Mesh
			geometry={new THREE.PlaneGeometry(25, 25)}
			material={new THREE.MeshStandardMaterial({
				color: 'black',
				opacity: 0.1,
				transparent: true,
				wireframe: true
			})}
			rotation={[-Math.PI / 2, 0, 0]}
		/>

		<SC.Primitive
			object={new THREE.GridHelper(25, 25, 'papayawhip', 'papayawhip')}
			position={[0, 0.001, 0]}
		/>
	</SC.Group>

	<SC.Mesh
		geometry={new THREE.SphereGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: 'red',
			opacity: 0.5,
			transparent: true
		})}
		scale={[width, height, depth]}
		rotation={[0, spin, 0]}
	/>
	<SC.Mesh
		geometry={new THREE.SphereGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: 'blue',
			opacity: 1
		})}
		scale={[1, 1, 1]}
		rotation={[0, 0, 0]}
	/>

	<SC.PerspectiveCamera {fov} position={[camX, camY, camZ]} />
	<SC.OrbitControls enableZoom={false} maxPolarAngle={Math.PI * 0.51} />
	<SC.AmbientLight intensity={0.6} />
	<SC.DirectionalLight intensity={0.6} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
</SC.Canvas>

<div class="controls text-white">
	<!-- <label><input type="range" bind:value={width} min={0.1} max={3} step={0.1} /> width</label>
	<label><input type="range" bind:value={height} min={0.1} max={3} step={0.1} /> height</label>
	<label><input type="range" bind:value={depth} min={0.1} max={3} step={0.1} /> depth</label> -->
	<label><input type="range" bind:value={camX} min={0.1} max={10} step={0.1} /> camera X</label>
	<label><input type="range" bind:value={camY} min={0.1} max={10} step={0.1} /> camera Y</label>
	<label><input type="range" bind:value={camZ} min={0.1} max={10} step={0.1} /> camera Z</label>
	<label><input type="range" bind:value={fov} min={10} max={100} step={1} /> Fov</label>
</div>

<style>
	.controls {
		position: absolute;
		left: 1em;
		top: 1em;
	}

	label {
		display: flex;
		gap: 0.5em;
		align-items: center;
	}

	input {
		width: 80px;
		margin: 0;
	}
</style>
