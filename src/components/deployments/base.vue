<template>
    <div class="inline">
        <a v-bind:class="'ui ' + labelColor + ' label'">{{ state }}</a>
        <strong>{{ deployment.repository.name }}</strong> on:
        <a v-bind:class="'ui '+ deployment.environment.color_label + ' label'">{{ deployment.environment.name }}</a>
        <strong>{{ deployment.release.environment_revision.substring(0, 8) }}</strong>: {{ deployment.release.comment }}
    </div>
</template>
<script>
    export default{
        props: {
            state: {
                type: String,
                required: true
            },

            deployment: {
                type: Object,
                required: true
            },

            labelColor: {
                type: String,
                required: false,
                default() {
                    return ''
                }
            }
        }
    }
</script>