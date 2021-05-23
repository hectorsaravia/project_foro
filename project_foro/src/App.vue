<template>
<div>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess" :onFailure="onFailure"/>
</div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import GoogleLogin from 'vue-google-login';

export default {
  name: 'App',
  data() {
    return {
    // client_id is the only required property but you can add several more params, full list down bellow on the Auth api section
    params: {
      client_id: "xxxxxx"
    },
    // only needed if you want to render the button with the google ui
    renderParams: {
      width: 250,
      height: 50,
      longtitle: true
      }
    }
  },
  components: {
    HelloWorld,
    GoogleLogin,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
