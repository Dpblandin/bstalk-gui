<template>
    <form class="ui form">
        <div class="field">
            <label>Account</label>
            <input v-model="account" type="text" name="account" placeholder="Beanstalk account">
        </div>
        <div class="field">
            <label>Username</label>
            <input v-model="username" type="text" name="username" placeholder="Beanstalk username">
        </div>
        <div class="field">
            <label>Token</label>
            <input v-model="token" type="text" name="token" placeholder="Beanstalk token">
        </div>
        <button @click="saveConfig" class="ui button" type="submit">Save and close</button>
    </form>
</template>

<script>
    import {ipcRenderer} from 'electron'

    export default {
        props: ['account', 'username', 'token'],

        methods: {
            saveConfig() {
                const config = {
                    account: this.account,
                    username: this.username,
                    token: this.token
                }
                ipcRenderer.send('config-file-changed', config)
                this.$dispatch('config-file-changed')
            }
        }
    }
</script>