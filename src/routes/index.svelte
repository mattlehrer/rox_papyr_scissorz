<script lang="ts">
	// TODO:
	import { gameSize } from '$lib/stores';
	import { distanceFromOrigin } from '$lib/utils';
	import * as SC from 'svelte-cubed';
	import { quintInOut } from 'svelte/easing';
	import { tweened, type Tweened } from 'svelte/motion';
	import * as THREE from 'three';

	let sizeInterval: NodeJS.Timer;
	let stateInterval: NodeJS.Timer;

	let isVoiceControlled = false;

	let player1Color = 'blue';
	let player2Color = 'red';

	let ambientLightIntensity = 0.6;
	let directionalLightIntensity = 0.6;

	let sphereRadius = $gameSize;
	let camX = -0.4,
		camY = 1.6,
		camZ = 0.7;
	let fov = 130;
	let p1X = 0,
		p1Y = 0,
		p1Z = 0;
	let p2X = 0,
		p2Y = 0,
		p2Z = 0;

	let player1Position: Tweened<[number, number, number]> = tweened([p1X, p1Y, -p1Z], {
		duration: 2500,
		easing: quintInOut
	});
	let player2Position: Tweened<[number, number, number]> = tweened([p2X, p2Y, -p2Z], {
		duration: 2500,
		easing: quintInOut
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

	$: if (isVoiceControlled) {
		sizeInterval = sizeInterval ?? setInterval(updateSize, 10000);
		stateInterval = stateInterval ?? setInterval(updateState, 3000);
		updateSize();
		updateState();
	} else {
		clearInterval(sizeInterval);
		clearInterval(stateInterval);
		sizeInterval = undefined;
		stateInterval = undefined;
	}

	async function updateSize() {
		await fetch(`/api/size.json`)
			.then((res) => res.json())
			.then((data: any) => {
				// console.log(JSON.stringify(data, null, 2));
				console.log({ data });

				$gameSize = data.size || $gameSize;
			})
			.catch((e) => {
				console.error(e);
			});
	}
	async function updateState() {
		await fetch(`/api/state.json`)
			.then((res) => res.json())
			.then((data: any) => {
				console.log({ positions: data.state });
				if (data.state.p1?.length === 3) [p1X, p1Y, p1Z] = data.state.p1;

				if (data.state.p2?.length === 3) [p2X, p2Y, p2Z] = data.state.p2;
			})
			.catch((e) => {
				console.error(e);
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
			object={new THREE.GridHelper(4 * sphereRadius, 4 * sphereRadius, 'green', 'white')}
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
		position={[2 * sphereRadius, 0, 0]}
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
		position={[0, 1.25 * sphereRadius, 0]}
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
		position={[0, 0, -2 * sphereRadius]}
		scale={[0.2, 0.2, 0.2]}
		rotation={[0, 0, 0]}
	/>
	<SC.Primitive
		object={new THREE.AxesHelper(sphereRadius).setColors(
			new THREE.Color(0x00bb00),
			new THREE.Color(0x00bb00),
			new THREE.Color(0x00bb00)
		)}
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
	<SC.Primitive
		object={new THREE.ArrowHelper(
			new THREE.Vector3($player1Position[0], $player1Position[1], $player1Position[2]).normalize(),
			new THREE.Vector3(0, 0, 0),
			distanceFromOrigin(...$player1Position),
			0x000088,
			0.1 * sphereRadius
		)}
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
	<SC.Primitive
		object={new THREE.ArrowHelper(
			new THREE.Vector3($player2Position[0], $player2Position[1], $player2Position[2]).normalize(),
			new THREE.Vector3(0, 0, 0),
			distanceFromOrigin(...$player2Position),
			0x880000,
			0.1 * sphereRadius
		)}
	/>

	<SC.PerspectiveCamera
		{fov}
		position={[camX * sphereRadius, (camY * sphereRadius) / 2, camZ * sphereRadius]}
	/>
	<SC.OrbitControls enableZoom={true} />
	<SC.AmbientLight intensity={ambientLightIntensity} />
	<SC.DirectionalLight
		intensity={directionalLightIntensity}
		position={[-5, 2, 7]}
		shadow={{ mapSize: [2048, 2048] }}
	/>
</SC.Canvas>

<div class="absolute top-16 sm:top-4 left-4 text-white">
	<!-- Voice mode toggle -->
	<div class="flex items-center">
		<!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
		<button
			type="button"
			class={`${
				isVoiceControlled ? 'bg-blue-600' : 'bg-gray-200 border-blue-600'
			} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 `}
			role="switch"
			aria-checked={isVoiceControlled}
			on:click={() => (isVoiceControlled = !isVoiceControlled)}
		>
			<span class="sr-only">Use voice mode</span>
			<!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
			<span
				class={`${
					isVoiceControlled ? 'translate-x-5' : 'translate-x-0'
				} pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
			>
				<!-- Enabled: "opacity-0 ease-out duration-100", Not Enabled: "opacity-100 ease-in duration-200" -->
				<span
					class={`${
						isVoiceControlled
							? 'opacity-0 ease-out duration-100'
							: 'opacity-100 ease-in duration-200'
					} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
					aria-hidden="true"
				>
					<svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
						<path
							d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<!-- Enabled: "opacity-100 ease-in duration-200", Not Enabled: "opacity-0 ease-out duration-100" -->
				<span
					class={`${
						isVoiceControlled
							? 'opacity-100 ease-in duration-200'
							: 'opacity-0 ease-out duration-100'
					} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
					aria-hidden="true"
				>
					<svg class="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
						<path
							d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
						/>
					</svg>
				</span>
			</span>
		</button>
		<span class="ml-3" id="annual-billing-label">
			<span class="text-sm font-medium text-gray-100">Use Voice Controls </span>
		</span>
	</div>
	<div class={`mt-3 ${distanceFromOrigin(p1X, p1Y, p1Z) > 10 ? 'text-green-400' : 'text-white'}`}>
		Player 1 is {distanceFromOrigin(p1X, p1Y, p1Z).toPrecision(4)} from the origin
	</div>
	<label class="mt-2"
		><input
			class:hidden={isVoiceControlled}
			class="w-20 sm:w-32 bg-blue-400 appearance-none rounded-lg h-2"
			type="range"
			bind:value={p1X}
			min={-1.2 * sphereRadius}
			max={1.2 * sphereRadius}
			step={1}
		/>
		<div class="inline-block w-[5.75rem]">P1 roX:</div>
		<div class="tabular-nums w-4 text-right inline-block">{p1X}</div></label
	>
	<label
		><input
			class:hidden={isVoiceControlled}
			class="w-20 sm:w-32 bg-blue-400 appearance-none rounded-lg h-2"
			type="range"
			bind:value={p1Y}
			min={-1.2 * sphereRadius}
			max={1.2 * sphereRadius}
			step={1}
		/>
		<div class="inline-block w-[5.75rem]">P1 papYr:</div>
		<div class="tabular-nums w-4 text-right inline-block">{p1Y}</div></label
	>
	<label
		><input
			class:hidden={isVoiceControlled}
			class="w-20 sm:w-32 bg-blue-400 appearance-none rounded-lg h-2"
			type="range"
			bind:value={p1Z}
			min={-1.2 * sphereRadius}
			max={1.2 * sphereRadius}
			step={1}
		/>
		<div class="inline-block w-[5.75rem]">P1 scissorZ:</div>
		<div class="tabular-nums w-4 text-right inline-block">{p1Z}</div>
	</label>
	<div class={`mt-6 ${distanceFromOrigin(p2X, p2Y, p2Z) > 10 ? 'text-green-400' : 'text-white'}`}>
		Player 2 is {distanceFromOrigin(p2X, p2Y, p2Z).toPrecision(4)} from the origin
	</div>

	<label class="mt-2"
		><input
			class:hidden={isVoiceControlled}
			class="w-20 sm:w-32 bg-red-400 appearance-none rounded-lg h-2"
			type="range"
			bind:value={p2X}
			min={-1.2 * sphereRadius}
			max={1.2 * sphereRadius}
			step={1}
		/>
		<div class="inline-block w-[5.75rem]">P2 roX:</div>
		<div class="tabular-nums w-4 text-right inline-block">{p2X}</div>
	</label>
	<label
		><input
			class:hidden={isVoiceControlled}
			class="w-20 sm:w-32 bg-red-400 appearance-none rounded-lg h-2"
			type="range"
			bind:value={p2Y}
			min={-1.2 * sphereRadius}
			max={1.2 * sphereRadius}
			step={1}
		/>
		<div class="inline-block w-[5.75rem]">P2 papYr:</div>
		<div class="tabular-nums w-4 text-right inline-block">{p2Y}</div></label
	>
	<label
		><input
			class:hidden={isVoiceControlled}
			class="w-20 sm:w-32 bg-red-400 appearance-none rounded-lg h-2"
			type="range"
			bind:value={p2Z}
			min={-1.2 * sphereRadius}
			max={1.2 * sphereRadius}
			step={1}
		/>
		<div class="inline-block w-[5.75rem]">P2 scissorZ:</div>
		<div class="tabular-nums w-4 text-right inline-block">{p2Z}</div></label
	>
	<button
		on:click={resetPositions}
		class:hidden={isVoiceControlled}
		class="mt-3 border border-red-400 py-1 px-2 rounded bg-gray-800 bg-opacity-50">New Game</button
	>
</div>
<div class="absolute top-4 left-4 sm:left-auto sm:right-4 text-white">
	<label
		><input
			class:hidden={isVoiceControlled}
			class="w-20"
			type="range"
			bind:value={sphereRadius}
			min={3}
			max={30}
			step={1}
		/>
		<div class="inline-block w-[5.75rem]">Radius:</div>
		<div class="tabular-nums w-4 text-right inline-block">{sphereRadius}</div></label
	>
	<!-- <label
		><input
			class="w-20"
			type="range"
			bind:value={ambientLightIntensity}
			min={0}
			max={5}
			step={0.1}
		/>
		Ambient Light ({ambientLightIntensity.toPrecision(2)})</label
	> -->
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
