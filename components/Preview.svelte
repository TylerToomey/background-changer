<script>
    import { file } from '../stores.js'
    import { fade } from 'svelte/transition'
    import { onDestroy } from 'svelte'

    
    const DEFAULT = "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";
   
    let uploadButton, previewImage;
    let showImage;

    $:src = DEFAULT;
    $:if(!$file) src = DEFAULT;

    //$:files[0] ? src = files[0] : src = DEFAULT;

    function addPreview(){
        uploadButton.click();
    }

    function onFileSelected(e){
        file.update(n => uploadButton.files[0]);
        if ($file) {
            showImage = true;
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            src = reader.result;
        });
        reader.readAsDataURL($file);
                return;
        } 
        showImage = false; 
    }
    

</script>

<div class="preview-box border bg-secondary">
    <input type="file" class="hidden aria-hidden" style="display:none" bind:this={uploadButton} on:change={(e)=>onFileSelected(e)} accept="image/*"/>   
    <input type="image" {src} alt="" class="img-fluid btn" bind:this={previewImage} on:click={addPreview}>
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