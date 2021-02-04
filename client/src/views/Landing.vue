<template>
  <div id="main">
    <h3>Welcome to AAP Bad Lines</h3>
    <div v-if="userLoggedIn">
      <BadLineForm/>
    </div>
    <UserDataForm v-else/>
  </div>
</template>

<script>
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

  #main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
