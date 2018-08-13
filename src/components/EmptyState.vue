<template>
  <div class="d-flex flex-column justify-content-around align-items-center">
    <b-img src="/baseline-image_search-24px.svg"></b-img>
    <p>Start by selecting a country from the menu</p>
  </div>
</template>

<script>
export default {
  name: "EmptyState"
}
</script>

<style type="text/stylus" lang="stylus" scoped>
  div
    margin 2rem

    img
      padding 1rem 0 2rem 0
      opacity 0.4
      transform scale(5)
</style>
