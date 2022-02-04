<script>
    import { previewImage } from '../stores.js'
    import { fade } from 'svelte/transition'
    import { onDestroy } from 'svelte'
    export let src = "";
    
    let fileInput;
	let files;

    function addPreview(){
        fileInput.click();
    }

    function onFileSelected(e){
        let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                 $previewImage = e.target.result
                 console.log("ASD")
            };
    }

</script>

<div class="preview-box border bg-secondary">
    <input type="file" class="hidden aria-hidden" style="display:none" bind:this={fileInput} on:change={(e)=>onFileSelected(e)}/>   
    <input type="image" {src} alt="" class="img-fluid btn" on:click={addPreview}>
</div>

<style>
    .preview-box{
        padding:10px;
        margin: 0 auto;
        min-height:500px;
        max-height:800px;
        width:100%;
    }

  
</style>