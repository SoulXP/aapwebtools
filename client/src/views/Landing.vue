<template>
<!-- <Navigation class="navigation-main"/> -->
<div id="badlines-container">
  <div id="badlines-main">
    <h1 class="aap-wt-semibold"><span class="aap-red aap-wt-light">AFRICA</span> Audio Post.</h1>
    <h3 class="badlines-title">Bad Lines</h3>
    <div v-if="userLoggedIn">
      <BadLineForm/>
    </div>
    <UserDataForm v-else/>
  </div>
</div>
</template>

<script>
// import Navigation from '@/compnents/Navigation.vue';
import UserDataForm from '@/components/UserDataForm.vue';
import BadLineForm from '@/components/BadLineForm.vue';

export default {
  name: 'Landing',
  data () {
    return {
      userLoggedIn: true
    }
  },
  components: {
    // Navigation,
    UserDataForm,
    BadLineForm
  }
}
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  h1 {
    font-size: 3em;
  }

  #badlines-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }

  #badlines-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .badlines-title {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .aap-red {
    color: #C70E00;
    font-weight: normal;
  }

  .aap-wt-light {
    font-weight: normal;
  }

  .aap-wt-semibold {
    font-weight: 600;
  }

</style>
