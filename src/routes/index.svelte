<script lang="ts">
	import * as SC from 'svelte-cubed';
	import * as THREE from 'three';

	let player1Color = 'blue';
	let player2Color = 'green';

	let width = 7;
	let height = 7;
	let depth = 7;
	let camX = 3,
		camY = 5,
		camZ = 7;
	let fov = 130;
	let p1X = 0,
		p1Y = 0,
		p1Z = 0;
	let p2X = 0,
		p2Y = 0,
		p2Z = 0;
	let player1Position: [number, number, number];
	let player2Position: [number, number, number];

	$: player1Position = [p1X, p1Y, -p1Z];
	$: player2Position = [p2X, p2Y, -p2Z];

	let spin = 0;
	let size = 0.25;

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
			rotation={[0, 0, 0]}
		/>

		<SC.Primitive object={new THREE.GridHelper(20, 20, 'red', 'white')} position={[0, 0.001, 0]} />
	</SC.Group>

	<SC.Mesh
		geometry={new THREE.SphereGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: 'papayawhip',
			opacity: 0.3,
			transparent: true
		})}
		scale={[width, height, depth]}
		rotation={[0, spin, 0]}
	/>

	<!-- X marker -->
	<SC.Mesh
		geometry={new THREE.BoxGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: 'red',
			opacity: 1,
			transparent: true
		})}
		position={[10, 0, 0]}
		scale={[0.2, 0.2, 0.2]}
		rotation={[0, 0, 0]}
	/>
	<!-- Y marker -->
	<SC.Mesh
		geometry={new THREE.BoxGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: 'purple',
			opacity: 1,
			transparent: true
		})}
		position={[0, 8, 0]}
		scale={[0.2, 0.2, 0.2]}
		rotation={[0, 0, 0]}
	/>
	<!-- Z marker -->
	<SC.Mesh
		geometry={new THREE.BoxGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: 'orange',
			opacity: 1,
			transparent: true
		})}
		position={[0, 0, -9]}
		scale={[0.2, 0.2, 0.2]}
		rotation={[0, 0, 0]}
	/>

	<!-- Player 1 -->
	<SC.Mesh
		geometry={new THREE.SphereGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: player1Color,
			opacity: 0.1
		})}
		position={player1Position}
		scale={[size, size, size]}
		rotation={[0, 0, 0]}
	/>

	<!-- Player 2 -->
	<SC.Mesh
		geometry={new THREE.BoxGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: player2Color,
			opacity: 1
		})}
		position={player2Position}
		scale={[size * 1.5, size * 1.5, size * 1.5]}
		rotation={[0, 0, 0]}
	/>

	<SC.PerspectiveCamera {fov} position={[camX, camY, camZ]} />
	<SC.OrbitControls enableZoom={true} />
	<SC.AmbientLight intensity={0.6} />
	<SC.DirectionalLight intensity={0.6} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
</SC.Canvas>

<div class="controls text-white">
	<!-- <label><input type="range" bind:value={width} min={0.1} max={3} step={0.1} /> width</label>
	<label><input type="range" bind:value={height} min={0.1} max={3} step={0.1} /> height</label>
	<label><input type="range" bind:value={depth} min={0.1} max={3} step={0.1} /> depth</label> -->
	<label><input type="range" bind:value={camX} min={0.1} max={20} step={0.1} /> camera X</label>
	<label><input type="range" bind:value={camY} min={0.1} max={20} step={0.1} /> camera Y</label>
	<label><input type="range" bind:value={camZ} min={0.1} max={20} step={0.1} /> camera Z</label>
	<label><input type="range" bind:value={fov} min={10} max={200} step={1} /> Fov</label>
	<label><input type="range" bind:value={p1X} min={-10} max={10} step={1} /> Player 1 roX</label>
	<label><input type="range" bind:value={p1Y} min={-10} max={10} step={1} /> Player 1 papYr</label>
	<label
		><input type="range" bind:value={p1Z} min={-10} max={10} step={1} /> Player 1 scissorZ</label
	>
	<label><input type="range" bind:value={p2X} min={-10} max={10} step={1} /> Player 2 roX</label>
	<label><input type="range" bind:value={p2Y} min={-10} max={10} step={1} /> Player 2 papYr</label>
	<label
		><input type="range" bind:value={p2Z} min={-10} max={10} step={1} /> Player 2 scissorZ</label
	>
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
