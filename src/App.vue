<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
    >
    <v-toolbar-title>Soccer App</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <SoccerTeams/>
    </v-main>
  </v-app>
</template>

<script>
import SoccerTeams from './components/SoccerTeams';

export default {
  name: 'App',

  components: {
    SoccerTeams,
  },

  data: () => ({
    //
  }),
};
</script>
