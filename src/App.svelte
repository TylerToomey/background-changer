<script>
	import { previewImage } from '../stores'
	import { fade } from 'svelte/transition'
	import Preview from '../components/Preview.svelte'
	const ENV = DEV;

	console.log(ENV);
	const DEFAULT = "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";
	
	$:promise = Promise.resolve([])
	$:imageSource = DEFAULT;

	function reset(){
		promise = Promise.resolve([])
		imageSource = DEFAULT;
	}

	async function submitImage(){
		try{
			promise = await fetchImage().then((res)=>{
				imageSource = res.url;

				fetch("https://api.pushcut.io/qVMVMZOZQn_DpG6bmZrAv/notifications/Set-Wallpaper",
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ 
						title: 'hey',
						image:imageSource,
						input:imageSource
					})
				})
			})
		} catch(e){
			console.error(e);
		}
	}
	async function fetchImage(){
		const response = await fetch(`${ENV}/api/hello`)
		console.log(`${ENV}/api/hello`)
    	return await response.json();
	}
</script>


<div id="main" class="d-flex align-self-center justify-content-center">
	<div class="row mw-50 align-self-center justify-content-center preview-container">
		<Preview src={imageSource}/>
		<button type="button" class="col text-center py-4 btn btn-info m-1 button-max"
		on:click={reset}>
			Refresh
		</button>
		<button type="button" class="col text-center py-4 btn btn-success m-1 button-max"
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
