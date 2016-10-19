<template>
    <base-deployment :state="'Failed deployment'"
                     :label-color="'red'"
                     :deployment="deployment">

    </base-deployment>
</template>
<script>
    import baseDeployment from './base.vue'
    export default{
        props: ['deployment'],
        components: { baseDeployment }
    }
</script>