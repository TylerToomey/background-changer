<script>
    import { file } from '../stores.js'
    import { fly } from 'svelte/transition'
    import { fade } from 'svelte/transition'
    import { onDestroy } from 'svelte'

    
    const DEFAULT = "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";
   
    let uploadButton, previewImage;
    let showImage;

    $:src = DEFAULT;
    $:if(!$file) src = DEFAULT;

    // Helper function to click the actual file button which is hidden
    function clickUploadButton(){
        uploadButton.click();
    }

    // on:change of file selector, invoke this
    function onFileSelected(e){
        file.update(n => uploadButton.files[0]);
    }

    // if we have a file, show it and set the src of img to the filereader render
    $:if ($file) {
        showImage = true;
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            src = reader.result;
        });
        reader.readAsDataURL($file);
    }
    

</script>
<div in:fly="{{ y: 200, duration: 2000 }}" out:fade>
    <input type="file" class="hidden aria-hidden" style="display:none" bind:this={uploadButton} on:change={(e)=>onFileSelected(e)} accept="image/*"/>   
    <input type="image" class="preview-image" {src} alt="" bind:this={previewImage} on:click={clickUploadButton}>
</div>


<style>
    .preview-image{
        object-fit:scale-down;
    }
</style>