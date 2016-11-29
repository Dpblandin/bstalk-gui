<template>
    <div class="toaster">
        <div class="toast ui floating message"
             v-for="deployment in deployments"
             transition="expand"
             v-bind:class="classes(deployment)"
        >
            <i class="close icon" @click="close(deployment)"></i>
            <i class="icon" v-if="deployment.icon" v-bind:class="deployment.icon"></i>
            <div class="content">
                <loading-deployment v-if="isLoading(deployment)" :deployment="deployment"></loading-deployment>
                <!--<skipped-deployment v-if="deployment.release.state === deploymentTypes.SKIPPED" :deployment="deployment"></skipped-deployment>-->
                <success-deployment v-if="deployment.release.state === deploymentTypes.SUCCESS || deployment.release.state === deploymentTypes.SKIPPED" :deployment="deployment"></success-deployment>
                <failed-deployment v-if="deployment.release.state === deploymentTypes.FAILED" :deployment="deployment"></failed-deployment>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    import skippedDeployment from './skipped.vue'
    import loadingDeployment from './loading.vue'
    import successDeployment from './success.vue'
    import failedDeployment from './failed.vue'
    import * as deploymentTypes from '../../constants/deploymentTypes'
    export default {
        components: { loadingDeployment, skippedDeployment, successDeployment, failedDeployment },
        props: {
            deployments: {
                default() {
                    return []
                },
                type: Array
            }
        },
        data() {
            return {
                deploymentTypes
            }
        },
        methods: {
            isLoading(deployment) {
                return deployment.release.state === deploymentTypes.PENDING
                        || deployment.release.state === deploymentTypes.WAITING
                        || deployment.release.state === ''
            },
            classes(deployments) {
                let classes = [];
                if(!Array.isArray(deployments.classes) && deployments.classes){
                    classes = [deployments.classes]
                } else {
                    classes = deployments.classes;
                }
                if(deployments.icon){
                    classes.push('icon');
                }
                return classes;
            },
            close(deployment) {
                this.deployments.splice(this.deployments.findIndex(i => i.id == deployment.id), 1);
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
    .expand-enter-active, .expand-leave-active {
        transition: all .5s ease;
        overflow: hidden;
    }

    .expand-enter, .expand-leave {
        height: 0;
        padding: 0 10px;
        opacity: 0;
    }
</style>