<template>
  <div ref="sidebar" class="ui sidebar inverted vertical menu">
    <a class="item">
      1
    </a>
    <a class="item">
      2
    </a>
    <a class="item">
      3
    </a>
  </div>
</template>
<script type="text/babel">
  export default{
    data() {
      return {
        msg: 'hello vue'
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.$refs.sidebar.sidebar('toggle');
      })
    }
  }
</script>
