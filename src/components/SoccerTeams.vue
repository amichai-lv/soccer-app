<template>
  <div class="container">
    <h3 class="title">Soccer Teams</h3>
    <div class="row align-center justify-center">
      <div class="col-xl-6">
        <v-data-table
          :headers="headers"
          :items="teams"
          :loading="loading"
          @click:row="onRowClick"
          :footerProps="{ 'items-per-page-options': [5, 10] }"
        >
          <template v-slot:item.logo="{ item }">
            <v-img :src="item.logo" class="crest-image" />
          </template>
          <template v-slot:item.favorited="{ item }">
            <v-icon v-if="item.favorited" color="yellow">mdi-star</v-icon>
          </template>
        </v-data-table>
      </div>
    </div>
    <v-snackbar v-model="showSnackbar" timeout="1500">{{ snackBarMessage }}</v-snackbar>
  </div>
</template>

<script>
import { getSoccerTeams } from "../managers/soccerTeamsManager";
import {
  getFavoriteSoccerTeamIds,
  upsertSoccerTeamFavorite,
} from "../db/soccerTeamsDb";

export default {
  mounted() {
    this.getSoccerTeams();
  },
  data: () => ({
    teams: [],
    loading: true,
    snackBarMessage: "",
    showSnackbar: false,
    headers: [
      {
        text: "",
        value: "favorited",
        width: "3em",
        sortable: false,
      },
      {
        text: "Crest",
        value: "logo",

        sortable: false,
      },
      {
        text: "Name",
        value: "name",
        sortable: true,
      },
      {
        text: "Year Founded",
        value: "founded",
        sortable: true,
      },
    ],
  }),
  methods: {
    /**
     * Gets the Spain's soccer teams from the api-football and gets the previously favorited teams from indexeddb.
     * Attachs 'favorited' property to each team based on selections in indexded
     * Then sets them in the data in the component's data.
     */
    async getSoccerTeams() {
      let teams;
      try {
        this.loading = true;
        teams = await getSoccerTeams();
        let favoritedTeamsIds = await getFavoriteSoccerTeamIds();
        teams.forEach(
          (t) => (t.favorited = favoritedTeamsIds.includes(t.team_id))
        );
      } catch (ex) {
        console.error(ex);
        this.openSnackbar("Failed to fetch teams!");
      }

      this.loading = false;
      this.teams = teams || [];
    },

    /** Called on table row click to update faovirte team */
    async onRowClick(rowData) {
      rowData.favorited = !rowData.favorited;
      let favoriteText = rowData.favorited ? "Favorited" : "Unfavorited";
      let message = `${favoriteText} ${rowData.name}`;
      try {
        await upsertSoccerTeamFavorite(rowData.team_id, rowData.favorited);
      }
      catch (ex) {
        console.error(ex);
        message = `Failed to ${message}`
      }
      
      this.openSnackbar(message);
    },
    
    /** Shows snackbar with a message (box that pops from bottom of page) */
    openSnackbar(message) {
        this.snackBarMessage = message;
        this.showSnackbar = true;
    }
  },
};
</script>
<style>
.title {
  text-align: center;
}
.crest-image {
  width: 50px;
}

.v-data-table tr {
  cursor: pointer;
}

.table > tbody > tr > td.text-start:first-child  {
  padding-right: 0;
}
</style>