<template>
    <td><i v-bind:class="fileIcon + ' icon'"></i>{{ fileName }}</td>
</template>

<script>
    import * as diffTypes from '../../../constants/diffTypes'
    export default{
        props: ['file'],

        computed: {
            fileName() {
                return this.file[0]
            },

            changeType() {
                return this.file[1]
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