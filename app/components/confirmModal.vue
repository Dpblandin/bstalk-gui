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
        props:['isVisible' ,'repository', 'environment', 'onConfirm'],

        methods: {
            cancelAction() {
                this.isVisible = false
            },
            confirmAction() {
                this.isVisible = false
                console.log('called here')
                this.onConfirm()
            }
        },

        directives: {
            modal: {
                bind() {
                    $(this.el).modal('refresh').modal('hide')
                },
                update(newVal, oldVal) {
                    if(!newVal) {
                        $(this.el).modal('refresh').modal('hide')
                    } else {
                        $(this.el).modal('refresh').modal('show')
                    }
                }
            }
        }

    }
</script>