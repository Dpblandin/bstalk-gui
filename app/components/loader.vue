<style>
    .mdl-progress {
        display: flex;
        align-items: center;
    }
</style>

<template>
    <div v-show="type === 'progress'" id="p2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
    <div v-show="type === 'circular'" class="mdl-spinner mdl-js-spinner is-active"></div>
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