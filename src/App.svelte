<script>
	import { fade } from 'svelte/transition'
	import Preview from '../components/Preview.svelte'
	// The package that'll help us resize our images
	import Resizer from "react-image-file-resizer"; 

	// To post the resized images to your upload endpoint
	import axios from "axios"; 
	// We'll call this function later to resize images
	const resize = Resizer.imageFileResizer; 
	// The uncompressed version of the uploaded images, they are bound to the form input element below
	let rawImgs; 
  

	let files = [];
	$:file = files[0];


	let onSubmit = () => {
    // We'll append the resized images to the form data, then send them to the upload endpoint
    let formData = new FormData(); 
    // We'll post the resized images to your upload endpoint here
    axios
      .post("https://your-endpoint/upload", formData)
      .then((res) => {
        console.log(res.data);
      }).catch(err => {
        console.log(err.message);
      });
  };
</script>


<h1>Fill this form!</h1>

<!-- This would work just as well with single inputs -->
<input type="file" bind:files={rawImgs} multiple />
<br/>
<button on:click={onSubmit}>Submit</button>


<style>
	.img-max {
  		max-width: 500px;
  		width:100%;
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