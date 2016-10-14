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
                <p>Deploy on: <a class="ui {{ environment.color_label }} label">{{ environment.name }} ?</a></p>
            </div>
        </div>
        <div class="actions">
            <button @click="cancelAction" disabled="{{ confirmed }}" class="ui red button">Cancel</button>
            <button @click="confirmAction" disabled="{{ confirmed }}" class="ui primary button">Deploy</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props:['isVisible' ,'repository', 'environment', 'onConfirm', 'releaseState'],

        data() {
            return {
                confirmed: false
            }
        },

        methods: {
            cancelAction() {
                this.isVisible = false
            },
            confirmAction() {
                this.isVisible = false
                this.confirmed = true
                setTimeout(() => {
                    this.confirmed = false
                }, 1500)
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