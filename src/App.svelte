<script>
	import { file } from '../stores'
	import { fade } from 'svelte/transition'
	import Preview from '../components/Preview.svelte'
	
	// $:promise = Promise.resolve([])
	// $:imageSource = DEFAULT;

	$:submit = false;
	$:isFile = '';
	$:$file && !submit ? isFile = '' : isFile = 'disabled'

	let submitButton = null;

	 function reset(){
		 file.update(n => n = null);
	// 	promise = Promise.resolve([])
	// 	imageSource = DEFAULT;
	}

	async function submitImage(){
		submit = true;

		// Get a presigned URL to upload to
		const response = await fetch('/api/get-url/upload-url')
		const url = await response.json();

		// Create FORM to send file through
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "image/*");

		// Upload the image file to the presigned upload URL
		fetch(url.url, {
			method: 'PUT',
			headers: myHeaders,
			body: $file,
			redirect: 'follow'
		})
		.then(async (response) => {
			const getImageUrl = await fetch(`/api/get-url/image-url`,{
				headers:{
					'Content-Type':'image/png'
				}
			})
			const json = await getImageUrl.json();
			console.log(json.url);

			// ?text=\"${json.url}\"&image=\"${json.url}\"&input=\"${json.url}\
			fetch("https://api.pushcut.io/qVMVMZOZQn_DpG6bmZrAv/notifications/Set-Wallpaper", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					title: 'WALLPAPER SUGGESTION',
					image:json.url,
					input:json.url
				})
			})

		})
  	.catch(error => console.log('error', error));
	}
	async function fetchImage(){
		
	}	
</script>


<div id="main" class="d-flex align-self-center justify-content-center">
	<div class="row mw-50 align-self-center justify-content-center preview-container">
		
		<Preview/>
		
		<button type="button" class="col text-center py-4 btn btn-info m-1 button-max"
		on:click={reset}>
			Refresh
		</button>

		<button type="button" class="col text-center py-4 btn btn-success m-1 button-max {isFile}"
		on:click={submitImage}>
			Submit
		</button>

   </div>
</div> 

<style>
	.preview-container{
		max-width:400px;
		max-height:800px;
		min-width:100px;
		margin: 0 auto;
		padding:10px;
	}

	.button-max{
		max-width:250px
	}

	.mw-50{
		width:60vw;
		max-width: 500px;
	}

	#main{
		background-color:rgb(34, 34, 34) !important;
		min-height: 100vh !important;
	}

</style>
