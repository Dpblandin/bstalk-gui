<template>
    <div v-modal="isVisible" class="ui modal">
        <div class="header">
            Confirm deployment for: {{ repository.name }}
        </div>
        <div class="content">
            <div class="description">
                Deploy on:  {{ environment.name }} ?
            </div>
        </div>
        <div class="action">
            <div @click="cancelAction" class="ui red button">Cancel</div>
            <div @click="confirmAction" class="ui primary button">Deploy</div>
        </div>
    </div>
</template>

<script>
    export default {
        props:['repository', 'environment', 'onConfirm'],

        data() {
            return {
                isVisible: true
            }
        },

        methods: {
            cancelAction() {
                this.isVisible = false
            },
            confirmAction() {
                this.isVisible = false
                //this.onConfirm()
            }
        },

        directives: {
            modal: {
                bind() {
                    $(this.el).modal('show').refresh()
                },
                update(newVal, oldVal) {
                    console.log(newVal)
                    if(!newVal) {
                        $(this.el).modal('hide')
                    }
                }
            }
        }

    }
</script>