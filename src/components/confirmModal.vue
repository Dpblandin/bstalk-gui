<style>
    .modal .content .description p {
        color: rgba(0,0,0,.87)
    }
</style>
<template>
    <div v-modal="isVisible" class="ui modal">
        <div class="header">
            Confirm deployment for: {{ repository.name }}
        </div>
        <div class="content">
            <div class="description">
                <p>Deploy on: <a v-bind:class="'ui ' + environment.color_label + ' label'">{{ environment.name }} ?</a></p>
            </div>
        </div>
        <div class="actions">
            <button @click="cancelAction" class="ui red button">Cancel</button>
            <button @click="confirmAction" v-bind:disabled="releaseState !== '' && !releaseDone" class="ui primary button">Deploy</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props:['isVisible' ,'repository', 'environment', 'onConfirm', 'releaseState', 'releaseDone'],

        methods: {
            cancelAction() {
                this.$emit('toggle-modal')
            },
            confirmAction() {
                this.$emit('toggle-modal')
                this.onConfirm()
            }
        },

        directives: {
            modal: {
                bind(el) {
                    $(el).modal('refresh').modal('hide')
                },
                update(el, binding) {
                    if(!binding.value) {
                        $(el).modal('refresh').modal('hide')
                    } else {
                        $(el).modal('refresh').modal('show')
                    }
                }
            }
        }

    }
</script>