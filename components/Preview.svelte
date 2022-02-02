<script>
    import { previewImage } from '../stores.js'
    import { fade } from 'svelte/transition'
</script>

<div class="preview-box border bg-primary">
    <img src="" alt="">
    <slot></slot>
</div>

<style>
    .preview-box{
        
        padding:10px;
        margin: 0 auto;
        min-height:500px;
        min-width:100px;
        max-height:800px;
        width:100%;
        aspect-ratio: 19.5/9;

    }

  
</style>