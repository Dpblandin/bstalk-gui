<template>
    <td>
        <i v-bind:class="fileIcon + ' icon'"></i>{{ fileName }}
        <file-diff :file="file"></file-diff>
    </td>
</template>

<script>
    import * as diffTypes from '../../../constants/diffTypes'
    import FileDiff from './fileDiff.vue'

    export default{
        props: ['file'],
        components: { FileDiff },

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
        }
    }
</script>