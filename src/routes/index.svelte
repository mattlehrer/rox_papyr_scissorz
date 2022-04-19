<script lang="ts">
	// TODO:
	// deal with cache issue
	// add distance calculation
	// add buttons
	// add check for game winner
	import { gameSize } from '$lib/stores';
	import { distanceFromOrigin } from '$lib/utils';
	import { onMount } from 'svelte';
	import * as SC from 'svelte-cubed';
	import { cubicOut } from 'svelte/easing';
	import { tweened, type Tweened } from 'svelte/motion';
	import * as THREE from 'three';

	let sizeInterval: NodeJS.Timer;

	let player1Color = 'blue';
	let player2Color = 'green';

	let sphereRadius = $gameSize;
	let camX = 0.6,
		camY = 1,
		camZ = 1.4;
	let fov = 130;
	let p1X = 0,
		p1Y = 0,
		p1Z = 0;
	let p2X = 0,
		p2Y = 0,
		p2Z = 0;

	let player1Position: Tweened<[number, number, number]> = tweened([p1X, p1Y, -p1Z], {
		duration: 1000,
		easing: cubicOut
	});
	let player2Position: Tweened<[number, number, number]> = tweened([p2X, p2Y, -p2Z], {
		duration: 1000,
		easing: cubicOut
	});

	$: player1Position.set([p1X, p1Y, -p1Z]);
	$: player2Position.set([p2X, p2Y, -p2Z]);

	let spin = 0;
	let size = 0.25;

	SC.onFrame(() => {
		spin += 0.01;
	});

	function resetPositions() {
		p1X = 0;
		p1Y = 0;
		p1Z = 0;
		p2X = 0;
		p2Y = 0;
		p2Z = 0;
	}

	// function resetCamera() {
	// 	camX = 3;
	// 	camY = 5;
	// 	camZ = 7;
	// 	fov = 130;
	// }

	onMount(async () => {
		sizeInterval = setInterval(updateSize, 5000);
		setInterval(updateState, 1000);
		await updateSize();
	});

	async function updateSize() {
		await fetch(`/api/size.json`, {
			headers: {
				'Cache-Control': 'no-store'
			}
		})
			.then((res) => res.json())
			.then((data: any) => {
				// console.log(JSON.stringify(data, null, 2));
				console.log({ data });

				try {
					// hasSize(data);
					if (data.size !== undefined && data.size !== $gameSize) clearInterval(sizeInterval);

					$gameSize = data.size || $gameSize;
				} catch (e) {
					console.error(e);
				}
			});
	}
	async function updateState() {
		await fetch(`/api/state.json`, {
			// await fetch(`/api/state.json?q=${Date.now()}`, {
			headers: {
				'Cache-Control': 'no-store'
			}
		})
			.then((res) => res.json())
			.then((data: any) => {
				console.log({ data });
				try {
					// hasState(data);
					p1X = Number(data.state.p1xcurrent) || 0;
					p1Y = Number(data.state.p1ycurrent) || 0;
					p1Z = Number(data.state.p1zcurrent) || 0;

					p2X = Number(data.state.p2xcurrent) || 0;
					p2Y = Number(data.state.p2ycurrent) || 0;
					p2Z = Number(data.state.p2zcurrent) || 0;
				} catch (e) {
					console.error(e);
				}
			});
	}
</script>

<svelte:head><title>roX papYr scissorZ</title></svelte:head>

<SC.Canvas
	antialias
	background={new THREE.Color('black')}
	fog={new THREE.FogExp2('papayawhip', 0.1)}
	shadows
>
	<SC.Group position={[0, 0, 0]}>
		<SC.Mesh
			geometry={new THREE.PlaneGeometry(4 * sphereRadius, 4 * sphereRadius)}
			material={new THREE.MeshStandardMaterial({
				color: 'black',
				opacity: 0.1,
				transparent: true,
				wireframe: true
			})}
			rotation={[0, 0, 0]}
		/>

		<SC.Primitive
			object={new THREE.GridHelper(4 * sphereRadius, 4 * sphereRadius, 'red', 'white')}
			position={[0, 0.001, 0]}
		/>
	</SC.Group>

	<SC.Mesh
		geometry={new THREE.SphereGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: 'papayawhip',
			opacity: 0.3,
			transparent: true
		})}
		scale={[sphereRadius, sphereRadius, sphereRadius]}
		rotation={[0, 0, 0]}
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
		geometry={new THREE.ConeGeometry((size * 2) / 3, size * 2, 32)}
		material={new THREE.MeshStandardMaterial({
			color: player1Color,
			opacity: 0.1
		})}
		position={$player1Position}
		rotation={[spin, 0, -spin]}
	/>

	<!-- Player 2 -->
	<SC.Mesh
		geometry={new THREE.BoxGeometry()}
		material={new THREE.MeshStandardMaterial({
			color: player2Color,
			opacity: 1
		})}
		position={$player2Position}
		scale={[size * 1.5, size * 1.5, size * 1.5]}
		rotation={[0, spin, spin]}
	/>

	<SC.PerspectiveCamera
		{fov}
		position={[camX * sphereRadius, (camY * sphereRadius) / 2, camZ * sphereRadius]}
	/>
	<SC.OrbitControls enableZoom={true} />
	<SC.AmbientLight intensity={0.6} />
	<SC.DirectionalLight intensity={0.6} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
</SC.Canvas>

<div class="absolute top-16 sm:top-4 left-4 text-white">
	<div class={distanceFromOrigin(p1X, p1Y, p1Z) > 10 ? 'text-green-400' : 'text-white'}>
		Player 1: {distanceFromOrigin(p1X, p1Y, p1Z).toPrecision(4)} from the origin
	</div>
	<label class="mt-2"
		><input
			class="w-20 sm:w-32"
			type="range"
			bind:value={p1X}
			min={-2 * sphereRadius}
			max={2 * sphereRadius}
			step={1}
		/>
		P1 roX ({p1X})</label
	>
	<label
		><input
			class="w-20 sm:w-32"
			type="range"
			bind:value={p1Y}
			min={-2 * sphereRadius}
			max={2 * sphereRadius}
			step={1}
		/>
		P1 papYr ({p1Y})</label
	>
	<label
		><input
			class="w-20 sm:w-32"
			type="range"
			bind:value={p1Z}
			min={-2 * sphereRadius}
			max={2 * sphereRadius}
			step={1}
		/>
		P1 scissorZ ({p1Z})</label
	>
	<div class={`mt-6 ${distanceFromOrigin(p2X, p2Y, p2Z) > 10 ? 'text-green-400' : 'text-white'}`}>
		Player 2: {distanceFromOrigin(p2X, p2Y, p2Z).toPrecision(4)} from the origin
	</div>

	<label class="mt-2"
		><input
			class="w-20 sm:w-32"
			type="range"
			bind:value={p2X}
			min={-2 * sphereRadius}
			max={2 * sphereRadius}
			step={1}
		/>
		P2 roX ({p2X})</label
	>
	<label
		><input
			class="w-20 sm:w-32"
			type="range"
			bind:value={p2Y}
			min={-2 * sphereRadius}
			max={2 * sphereRadius}
			step={1}
		/>
		P2 papYr ({p2Y})</label
	>
	<label
		><input
			class="w-20 sm:w-32"
			type="range"
			bind:value={p2Z}
			min={-2 * sphereRadius}
			max={2 * sphereRadius}
			step={1}
		/>
		P2 scissorZ ({p2Z})</label
	>
	<button
		on:click={resetPositions}
		class="mt-3 border border-red-400 py-1 px-2 rounded bg-gray-800 bg-opacity-50">New Game</button
	>
</div>
<div class="absolute top-4 left-4 sm:left-auto sm:right-4 text-white">
	<label
		><input class="w-20" type="range" bind:value={sphereRadius} min={3} max={30} step={1} /> Game
		Size ({sphereRadius})</label
	>
	<!-- <label><input type="range" bind:value={camX} min={0.1} max={20} step={0.1} /> camera X</label>
	<label><input type="range" bind:value={camY} min={0.1} max={20} step={0.1} /> camera Y</label>
	<label><input type="range" bind:value={camZ} min={0.1} max={20} step={0.1} /> camera Z</label>
	<label><input type="range" bind:value={fov} min={10} max={200} step={1} /> FOV</label> -->
	<!-- <button on:click={resetCamera} class="mt-3 border border-red-400 py-1 px-2 rounded"
		>Reset Camera</button
	> -->
</div>

<style>
	label {
		display: flex;
		gap: 0.5em;
		align-items: center;
	}
</style>
