<template>
<div id="navigation-main">
  <div id="navigation-main-content">
    <h1 id="navigation-section-left">AAP</h1>
      <div id="navigation-section-center" class="aap-gray">
        <h3>Home</h3>
        <h3>About</h3>
        <h3>Contact</h3>
      </div>
    <h1 id="navigation-section-right">Text</h1>
  </div>
</div>
</template>

<script>
export default {
    name: 'Navigation'
}
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: none;
  }

  h1 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.1em;
  }

  #navigation-main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 4.5em;
    left: 0;
    top: 0;
    background-color: #303030;
  }

  #navigation-main-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 85vw;
    width: 100%;
  }

  #navigation-section-center {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 2em;
  }

  .aap-gray {
    color: #AAAAAA;
  }
</style>
