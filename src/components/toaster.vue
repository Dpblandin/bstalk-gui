<template>
    <div class="toaster">
        <div class="toast ui floating message"
             v-for="toast in toasts"
             transition="expand"
             v-bind:class="classes(toast)"
        >
            <i class="close icon" @click="close(toast)"></i>
            <i class="icon" v-if="toast.icon" v-bind:class="toast.icon"></i>
            <div class="content">
                <div class="ui active inline small loader"></div>
                <span v-html="toast.message"></span>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        props: {
            toasts: {
                default() {
                    return []
                },
                type: Array
            }
        },
        methods: {
            classes(toast) {
                let classes = [];
                if(!Array.isArray(toast.classes) && toast.classes){
                    classes = [toast.classes]
                } else {
                    classes = toast.classes;
                }
                if(toast.icon){
                    classes.push('icon');
                }
                return classes;
            },
            close(toast) {
                this.toasts.splice(this.toasts.findIndex(i => i.id == toast.id), 1);
            }
        }
    }
</script>
<style>
    .toaster {
        top: 10px;
        right: 10px;
        position: fixed;
        z-index:999;
    }
    .toaster .toast {
        padding: 2.5em 1.5em;
        width: 100%;
    }
    /* always present */
    .expand-transition {
        transition: all .5s ease;
        overflow: hidden;
    }
    /* .expand-enter defines the starting state for entering */
    /* .expand-leave defines the ending state for leaving */
    .expand-enter, .expand-leave {
        height: 0;
        padding: 0 10px;
        opacity: 0;
    }
</style>