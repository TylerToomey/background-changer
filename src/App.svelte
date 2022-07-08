<script>
	import { file, state } from '../stores'
	
	import { fade, fly, slide} from 'svelte/transition'
	import { onMount } from 'svelte';

	import Preview from '../components/Preview.svelte'


	let transitionQueue = [] 
	let chattyQueue = {
		loading: {
			values:[
				""
			]
		},
		intro: {
			values: [
				"Hey",
				"Click on the empty box and choose a picture",
				"Click on the empty box and choose a picture",
				"The picture you choose will become my iPhone's wallpaper",
				"The picture you choose will become my iPhone's wallpaper"
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
				"Success!",
				"Nice — This is my new wallpaper now. Thanks..?"
			]
		},
		reset: {
			values: [
				"Okay, not that one",
				"Phew",
				"Click on the empty box and choose a picture"
			]
		},
		startOver: {
			values:[
				"Let's try this again",
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

	$:chatty = ""
	$:submit = false;

	$:disableSubmit = '';
	let disableReset = '';

	$: console.log($state, $file, disableReset);
	// If we have a file and we haven't submitted anything, allow submit button. Otherwise, disable the button.
	// (We don't want people submitting an image over and over)

	$:($file && !submit) && $state != 'success' ? disableSubmit = '' : disableSubmit = 'disabled'
	$:$file && ($state != "intro" || $state != "loading") ? disableReset = '' : disableReset = 'disabled';

	 function reset(){
		location.reload()
		 file.set(null)
		 if($state == "success"){
			 $state = "intro";
		 }else $state = "intro"
		 submit = false;
	}

	async function submitImage(){
		submit = true;
		$state = "submit";
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
			}).then(()=>{
				$state = "success"
				submit = false;
			})

		})
  	.catch();
	}

	onMount(() => { 
		$state = "intro";
		const dotTimer = setInterval(() => {

		}, 400);

		introTransitionNext();
		const chattyTimer = setInterval(() => {
			chatty = chattyQueue?.[$state].next(chatty);
		}, 5000);
	});

	$:$state, chatty = chattyQueue?.[$state].next(chatty);

	function introTransitionNext(){
		transitionQueue = [...transitionQueue, true]
	}

</script>
{#key chatty}
	<div class="chatty"
	transition:fade={{duration:300}}>
		{chatty}
	</div>
{/key}
<div class="app-container">
	{#if state != "loading"}
		<div>
			

				<div class="control container-fluid"
				transition:fade={{duration:2000}}>
					<div class="row d-flex justify-content-center">
						<div class="col d-flex justify-content-center pt-3" in:fly="{{ y: 200, duration: 2000 }}" 
						out:fade 					
						on:introend={introTransitionNext}>	
							<Preview />
						</div>
					</div>
					
					<div class="col d-flex justify-content-center">
						<button type="button" class="btn button btn-block btn-warning {disableReset}"
						transition:fade
						on:introend={introTransitionNext}
						on:click={reset}>
							Refresh
						</button>
					</div>
			
					<div class="col d-flex justify-content-center">
						<button type="button" class="btn button btn-block btn-success {disableSubmit}"
						transition:fade
						on:introend={introTransitionNext}
						on:click={submitImage}>
							Submit
						</button>
					</div>

					
					
				</div>
			
		</div>
		{/if}
		<footer>
			<div>
				Made by Tyler Toomey
			</div>
		</footer>
</div>



<style>
	footer {
		position: fixed;
		padding: 10px 10px 0px 10px;
		bottom: 0;
		right:0;
		width: 200px;
		/* Height of the footer*/ 
		height: 40px;
		background: white;
		vertical-align: top;
		text-align:center;
		border-radius:10px;
    }
	.chatty {
		color:white;
		vertical-align: bottom;
		display: table-cell;
		height:800px;
		width:10rem;
		top:10vh;
		font-size: 500px;
		font-weight:700;
		font-family:Arial, Helvetica, sans-serif; 
		position:absolute;
		user-select:none;

	}
	.button{
		width:100%;
		margin-bottom:1rem
	}

	.control{	
		background-color:rgba(255,255,255,0.5);
		aspect-ratio:9/16;
		width:100%;
		max-height:500px;
		border-radius:6px;
		box-shadow: 10px 10px 10px rgba(0,0,0,0.5);
		place-items:center;
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
		max-width:400px;
		padding-left:20px;
		padding-right:20px;

		
		/* background-color: blue;	 */
	}
	
	@media (min-width: 768px){
		.chatty {
			color:white;
			max-width: 260px;
			height:80px;
			top:14vh;
			right:65vw;
			font-size: 1.5rem;
			text-align:end;
			position:absolute;
			user-select:none;

	}
	} 

</style>
