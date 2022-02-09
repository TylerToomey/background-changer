<script>
	import { file } from '../stores'
	
	import { fade, fly } from 'svelte/transition'
	import { onMount } from 'svelte';

	import Preview from '../components/Preview.svelte'


	let transitionQueue = [] 
	let chattyQueue = {
		intro: {
			values: [
			"Hey",
			"Set my wallpaper for me",
			"Tap here to pick an image"
			]
		},
		chosen: {
			values: [
			"This will be my new wallpaper",
			"Are you sure this is what you want to choose?"
			]
		},
		submit: {
			values: [
			"Okay, sending it out",
			"Working on it"
			]
		},
		success: {
			values: [
				"Nice! This is my new wallpaper now. Thanks..?"
			]
		},
		reset: {
			values: [
				"Phew",
				"Okay, not that one"
			]
		}
	}

	// Add the next() function to all entries in the chattyQueue
	for(const [key, value] of Object.entries(chattyQueue)){
		value.next = (e) => {
			let index = value.values.indexOf(e)
			if(index === value.values.length-1){
				return value.values[index];
			}else {
				return value.values[++index]
			}
		}
	}

	console.log(chattyQueue)

	let state = "loading"

	let dots = null, dotsVisible = false;

	$:chatty = "Hey"
	$:submit = false;
	$:isFile = '';

	// If we have a file and we haven't submitted anything, allow submit button. Otherwise, disable the button.
	// (We don't want people submitting an image over and over)
	$:$file && !submit ? isFile = '' : isFile = 'disabled'

	 function reset(){
		 file.update(n => n = null);
		 submit = false;
	}

	async function submitImage(){
		submit = true;

		// Get a presigned URL to upload to
		const presignedPutUrlPromise = await fetch('/api/get-url/upload-url')
		const presignedPutUrl = await presignedPutUrlPromise.json();

		// Upload the image file to the presigned upload URL
		fetch(presignedPutUrl.url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'image/*'
			},
			body: $file,
			redirect: 'follow'
		})
		// If we succesfully post to the presigned URL, lets grab another presigned URL
		// from our endpoint for accessing the image to pass on to the phone client 
		.then(async () => {
			const presignedGetUrlPromise = await fetch(`/api/get-url/image-url`,{
				headers:{
					'Content-Type':'image/png'
				}
			})
			const presignedGetUrl = await presignedGetUrlPromise.json();
			fetch("https://api.pushcut.io/qVMVMZOZQn_DpG6bmZrAv/notifications/Set-Wallpaper", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					title: 'WALLPAPER SUGGESTION',
					image:presignedGetUrl.url,
					input:presignedGetUrl.url
				})
			})

		})
  	.catch(error => console.log('error', error));
	}

	onMount(() => { 
		state = "intro";
		console.log(state)
		const dotTimer = setInterval(() => {

		}, 400);

		introTransitionNext();
		const chattyTimer = setInterval(() => {
			chatty = chattyQueue?.[state].next(chatty);
		}, 5000);
	});

	function introTransitionNext(){
		transitionQueue = [...transitionQueue, true]
	}

</script>

<div class="app-container">
	{#if state != "loading"}
		<div>
			{#if transitionQueue[0]}
				<h1 class="chatty" in:fly="{{ y: 99.00, duration: 2000 }}"
				on:introend={introTransitionNext}>
					{chatty}
				</h1>
				<div bind:this={dots} transition:fade
				></div>
			{/if}

			{#if transitionQueue[1]}
				<div class="control" 
					transition:fade="{{duration: 1000}}"
					on:introend={introTransitionNext}>
				</div>
			{/if}

			<!-- <Preview on:click={test}/>
			<button type="button" class="button-max"
			in:fly="{{ y: 1-0, duration: 1000 }}" 
			out:fade
			on:click={reset}>
				Refresh
			</button>

			<button type="button" class="button-max {isFile}"
			in:fly="{{ y: 200, duration: 2600 }}" 
			out:fade
			on:click={submitImage}>
				Submit
			</button>	 -->
		</div>
		{/if}
</div>

<style>

	.chatty {
		color:white;
	}

	.control{
		margin:0 auto;
		background-color: ghostwhite;
		opacity:0.2;
		width:100%;
		height:100%;
		border-radius:6px;
		box-shadow: 10px 10px 10px black;
	}

	.app-container {
		background-color:rgb(247, 71, 129) !important;
		min-height: 100vh !important;

		display:flex;
		align-items: center;
		justify-content: center;
	}

	.app-container > div {
		width: 400px;
		padding-left:20px;
		padding-right:20px;

		height:calc(75vw*1.77);
		max-height:600px;
		min-height:550px;
		padding-top:5vh;
		/* background-color: blue;	 */
	}
	
	@media (min-width: 768px){
		.app-container div {
			width:100px;
			height:100px;
			background-color: brown;	
		}
	}

</style>
