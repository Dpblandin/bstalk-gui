<template>
    <confirm-modal :is-visible.sync="showModal"
                   :environment="environment"
                   :repository="repository"
                   :on-confirm="pushToEnv">

    </confirm-modal>
    <button @click="displayModal"
            class="ui labeled icon {{ environment.color_label }} button">
        <i class="upload icon"></i>
        {{ environment.name }}
    </button>
</template>

<script>
    import beanstalk from '../lib/api'
    import ConfirmModal from './confirmModal.vue'

    export default {
        components: {ConfirmModal},
        props: ['repository' ,'environment'],

        data() {
            return {
                showModal: false
            }
        },

        methods: {
            displayModal() {
                this.showModal = true
            },
            pushToEnv() {
              /*  beanstalk.deployToEnv(this.repository.id, this.environment.id, (message) => {
                    console.log(message)
                })*/
            }
        }
    }
</script>