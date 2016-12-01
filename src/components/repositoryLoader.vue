<template>
        <div v-progress="{current, total}" class="ui indicating progress" :data-value="current" :data-total="total">
            <div class="bar">
                <div class="progress"></div>
            </div>
            <div class="label">Fetching {{ current }} of {{ total }} repositories...</div>
        </div>
</template>

<style>
    .ui.progress {
        position: absolute;
        top: 60%;
        width: 100%;
        z-index:9999;
    }
</style>

<script type="text/ecmascript-6">

    export default {
        props: ['total', 'current'],

        directives : {
            progress: {
                update(el, binding) {
                    if(binding.oldValue.total !== binding.value.total) {
                        $(el).progress('set total', binding.value.total)
                    }
                    if(binding.oldValue.current !== binding.value.current) {
                        $(el).progress('set progress', binding.value.current)
                    }

                }
            }
        }

    }
</script>