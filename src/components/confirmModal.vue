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
            <div v-show="!confirmed" class="description">
                <p>Deploy on: <a class="ui {{ environment.color_label }} label">{{ environment.name }} ?</a></p>
            </div>
            <div v-show="confirmed" class="description">
                <div v-if="!releaseDone" class="ui active inline loader"></div>
                <span v-if="!releaseDone"> {{ releaseState }}</span>
                <div v-if="releaseDone">
                    <a class="ui {{ releaseDoneUi.class }} label">{{ releaseDoneUi.message }}</a>
                    {{ deployLabel }}
                </div>

            </div>
        </div>
        <div class="actions">
            <div v-if="!confirmed" @click="cancelAction" class="ui red button">Cancel</div>
            <div v-if="!confirmed" @click="confirmAction" class="ui primary button">Deploy</div>
            <div v-if="releaseDone" @click="cancelAction" class="ui primary button">Ok</div>
        </div>
    </div>
</template>

<script type="es6">
    export default {
        props:['isVisible' ,'repository', 'environment', 'onConfirm', 'releaseState', 'release'],

        data() {
            return {
                confirmed: false
            }
        },

        computed: {
            releaseDone() {
                return this.releaseState === 'skipped'
                || this.releaseState === 'failed'
                || this.releaseState === 'success'
            },

            releaseDoneUi() {
                if(this.releaseState === 'skipped') {
                    return {
                        class: '',
                        message: 'Bypassed'
                    }
                }
                if(this.releaseState === 'failed') {
                    return {
                        class: 'red',
                        message: 'Failed deployment'
                    }
                }
                if(this.releaseState === 'success') {
                    return {
                        class: 'green',
                        message: 'Successfully deployed!'
                    }
                }
            },

            deployLabel() {
                return `${this.release.environment_revision.substring(0, 8)}: ${this.release.comment}`

            }
        },

        methods: {
            cancelAction() {
                this.isVisible = false
                setTimeout(() => {
                    this.confirmed = false
                    this.release = {}
                }, 1000)
            },
            confirmAction() {
                this.confirmed = true
                this.isVisible = false
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