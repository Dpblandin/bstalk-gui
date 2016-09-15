<style>

</style>

<template>
    <div>
        <div class="ui active inverted dimmer">
            <div class="ui massive text loader">Loading repositories and environments</div>
        </div>
        <p></p>
        <p></p>
        <p></p>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                required: false,
                default: 'progress'
            }
        }
    }
</script>