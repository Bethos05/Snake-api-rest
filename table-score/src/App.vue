<template> 
  <v-app>
    <v-main>
      <table-score/>
    </v-main>
  </v-app>
</template>

<script>

import TableScore from './components/TableScore.vue';

export default {
  name: 'App',

  components: {
    
    TableScore
  },

};
</script>
