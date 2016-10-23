<template>
    <div class="file-diff">
        <h4 class="ui-header">Changed files: {{ filesCount }}</h4>
        <table class="ui sortable celled table">
            <thead>
            <tr>
                <th @click="sortByName">Name</th>
                <th @click="sortByAction">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-bind:class="rowClass(file)" v-for="file in files">
                <td>{{ fileName(file) }}</td>
                <td>{{ changeType(file) }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<style>
    .file-diff {
        margin-top: 30px;
    }
</style>
<script type="text/ecmascript-6">
    import * as diffTypes from '../../../constants/diffTypes'
    export default{
        props: ['files'],

        computed: {
            filesCount() {
                return this.files.length
            }
        },

        methods: {
            fileName(file) {
                return file[0]
            },

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