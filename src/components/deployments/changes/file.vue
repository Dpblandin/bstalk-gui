<template>
    <td @click="toggleDiff" class="file-row">
        <i v-bind:class="fileIcon + ' icon'"></i>{{ fileName }}
        <file-diff v-show="showDiff" :file="file"></file-diff>
    </td>
</template>

<style>
    .file-row {
        cursor: pointer;
    }
</style>

<script>
    import * as diffTypes from '../../../constants/diffTypes'
    import FileDiff from './fileDiff.vue'

    export default{
        props: ['file'],
        components: { FileDiff },

        data() {
            return {
                showDiff: false
            }
        },

        computed: {
            fileName() {
                return this.file.path
            },

            changeType() {
                return this.file.status
            },

            fileIcon() {
                if (this.changeType === diffTypes.ADD) {
                    return 'plus'
                }
                if (this.changeType === diffTypes.EDIT) {
                    return 'pencil'
                }
                if (this.changeType === diffTypes.DELETE) {
                    return 'trash'
                }
            }
        },

        methods: {
            toggleDiff() {
                this.showDiff = !this.showDiff
            }
        }
    }
</script>