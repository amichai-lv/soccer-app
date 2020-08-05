<template>
  <div class="container">
    <h3 class="title">Soccer Teams</h3>
    <div class="row align-center justify-center">
      <div class="col-xl-6">
        <v-data-table
          :headers="headers"
          :items="teams"
          :options.sync="pagingOptions"
          :server-items-length="totalItems"
          :loading="loading"
          @click:row="onRowClick"
          :footerProps="{ 'items-per-page-options': [5, 10] }"
        >
          <template v-slot:item.logo="{ item }">
            <img :src="item.logo" class="crest-image" />
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
  data: () => ({
    teams: [],
    loading: true,
    totalItems: null,
    snackBarMessage: "",
    showSnackbar: false,
    headers: [
      {
        text: "",
        value: "favorited",
        width: "30px",
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
    pagingInfo: {}  
  }),
  computed: {
    /** computed prop with get & set  for v-data-table options.
     *  It's set every time user change page, number of rows or sort by a column
     *  The get part is for the v-data-table to sync its UI.
     */
    pagingOptions: {
      get() {
        return this.pagingInfo;
      },
      set(pagingInfo) {
        this.pagingInfo = pagingInfo;
        let [orderBy = null] = pagingInfo.sortBy;
        let [isDesc = false] = pagingInfo.sortDesc;
        
        this.getSoccerTeams({ ...pagingInfo, orderBy, isDesc });
      },
    },
  },

  methods: {
    /**
     * Gets the soccer team from the "server" and gets the previously favorited teams from indexeddb.
     * Attachs 'favorited' property to each team based on selections in indexded
     * Then sets them in the data in the component's data.
     */
    async getSoccerTeams(pagingInfo) {
      let teams;
      let totalItems = null;
      try {
        this.loading = true;
        let teamsRes = await getSoccerTeams(pagingInfo);
        teams = teamsRes.items;
        totalItems = teamsRes.totalItems;
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
      this.totalItems = totalItems;
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
</style>