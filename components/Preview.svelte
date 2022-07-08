<script>
    import { file, state } from '../stores.js'
    import { fly } from 'svelte/transition'
    import { fade } from 'svelte/transition'
    import { onDestroy } from 'svelte'

    
    const DEFAULT = ""//https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";
   
    let uploadButton, previewImage;

    $:src = DEFAULT;
    $:if(!$file) src = DEFAULT;
    $:if($state=="reset") {
        src = DEFAULT;
        file.set(null)
    }

    // Helper function to click the actual file button which is hidden
    function clickUploadButton(){
        uploadButton.click();
    }

    // on:change of file selector, invoke this
    function onFileSelected(e){
        $state = "chosen"
        console.log("A")
        file.set(uploadButton.files[0]);
    }


    // if we have a file, show it and set the src of img to the filereader render
    $:if ($file) {
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            src = reader.result;
        });
        reader.readAsDataURL($file);
    }
    

</script>
<input type="file" class="hidden aria-hidden" style="display:none" bind:this={uploadButton} on:change={(e)=>onFileSelected(e)} accept="image/*"/>   
<input type="image" class="preview-image" {src} alt="" on:click={clickUploadButton}>


<style>
    .preview-image{
        object-fit: cover;
        aspect-ratio:9/16;
        width:100%;
        margin-bottom:1rem;
        background-color: rgba(255,255,255,0.1);
        user-select:none;
        border-style:none;
        outline-width:0;
        outline:none;

    }
</style>