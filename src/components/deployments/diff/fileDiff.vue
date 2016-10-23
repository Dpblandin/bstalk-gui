<template>
    <div>
        <table class="ui sortable celled table">
            <thead>
            <tr>
                <th @click="sortByName">Name</th>
            </tr>
            </thead>
            <tbody>
            <tr v-bind:class="rowClass(file)" v-for="file in files">
               <file :file="file"></file>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script type="text/ecmascript-6">
    import File from './file.vue'
    import * as diffTypes from '../../../constants/diffTypes'
    export default {
        props: ['files'],
        components: { File },
        methods: {
            changeType(file) {
                return file[1]
            },

            rowClass(file) {
                if(this.changeType(file) === diffTypes.EDIT) {
                    return 'warning'
                }

                if(this.changeType(file) === diffTypes.DELETE) {
                    return 'negative'
                }

                if(this.changeType(file) === diffTypes.ADD) {
                    return 'positive'
                }
            },

            sortByName() {

            },

            sortByAction() {

            }
        }
    }
</script>