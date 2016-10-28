<template>
    <div>
        <table class="ui sortable celled table">
            <thead>
            <tr>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            <tr v-bind:class="rowClass(file)" v-for="file in paginatedFiles">
               <file :file="file"></file>
            </tr>
            </tbody>
            <tfoot v-if="needPagination">
                <tr>
                    <th colspan="3">
                        <div class="ui right floated pagination menu">
                            <a v-show="currentPage > 1"
                               @click="prev"
                               class="icon item">
                                <i class="left chevron icon"></i>
                            </a>
                            <a v-for="n in totalPages"
                               @click="goTo(n)"
                               v-bind:class="itemClass(n)">
                                {{ n }}
                            </a>
                            <a v-show="currentPage < totalPages"
                               @click="next"
                               class="icon item">
                                <i class="right chevron icon"></i>
                            </a>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
<script type="text/ecmascript-6">
    import File from './file.vue'
    import * as diffTypes from '../../../constants/diffTypes'
    export default {
        props: ['files', 'filesCount'],
        components: { File },
        data() {
            return {
                currentPage: 1,
                perPage: 10
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.filesCount / this.perPage)
            },

            needPagination() {
                return this.totalPages > 1
            },

            paginatedFiles() {
                return this.files.slice((this.currentPage - 1) * this.perPage, this.perPage * this.currentPage)
            }
        },
        methods: {
            goTo(page) {
                this.currentPage = page
            },

            prev() {
                if (this.currentPage > 1) {
                    this.goTo(this.currentPage - 1)
                }
            },

            next() {
                if (this.currentPage < this.totalPages) {
                    this.goTo(this.currentPage + 1)
                }
            },

            itemClass(index) {
                return (index === this.currentPage) ? 'item active' : 'item'
            },

            changeType(file) {
                return file.status
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
            }
        }
    }
</script>