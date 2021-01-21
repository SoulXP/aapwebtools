<template>
  <div>
    Welcome to AAP Bad Lines
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
</style>
