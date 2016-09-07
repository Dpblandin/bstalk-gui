<template>
    <div class="flex-container">
        <input v-el:search-input @keyup="sendSearchEvent" v-model="search" class="shortcut-command" type="text">
    </div>
</template>

<script>
    export default {
        data() {
            return {
                search: null
            }
        },
        ready() {

        },
        methods: {
            sendSearchEvent() {
                this.$dispatch('repos-search', this.search)
            }
        },

        events: {
            'focus-command'() {
               this.$els.searchInput.focus();
            }
        }
    }
</script>