<template>
  <v-card>
     
    <v-card-title>
      Snake Score
      <v-spacer></v-spacer>
      <v-btn class="mx-2" fab dark small color="pink" @click="getPlayers">
          <v-icon dark>mdi-refresh</v-icon>
      </v-btn>
      <v-text-field 
        v-model="search"
        append-icon="mdi-magnify"
        label="Search: "
        single-line
        hide-details
      ></v-text-field>
      
    </v-card-title>
    <v-data-table class="data-table"
      :headers="headers"
      :items="players"
      :search="search"
    ></v-data-table>
  </v-card>
</template>


<script>
//Import axios for http request
import axios from "axios";

export default {
  //Data component vue
  data() {
    return {
      search: "",
      headers: [
        { text: 'Nick Name', value: 'nickname', sortable: false,},
        { text: 'Score', value: 'score' },
      ],
      players: [],
    };
  },
  //get player when componet is mounted
  mounted() {
    this.getPlayers();
  },
  methods: {
    //http request to obtain the players and their scores
    getPlayers() {
      axios
        .get("http://localhost:8000/api/players/")
        .then((response) => {
            console.log(response)
          this.players = response.data.players;
        })
        
    },
  },
};
</script>

<style>
    .v-card__title {
      background: rgb(71,251,255);
      color:rgb(6, 1, 27);
    } 

    /* label.v-label.theme--light {
      color:antiquewhite
    }  */

    span{
      font-size: large;
      color:rgb(6, 1, 27);
    }

  .theme--light.v-input input, .theme--light.v-input textarea {
    color:antiquewhite
  }
</style>