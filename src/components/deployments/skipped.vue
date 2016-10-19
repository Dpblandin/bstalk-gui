<template>
    <base-deployment :state="'Bypassed'" :deployment="deployment"></base-deployment>
</template>
<script>
    import baseDeployment from './base.vue'
    export default{
        props: ['deployment'],
        components: { baseDeployment }
    }
</script>