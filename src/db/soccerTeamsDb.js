import Dexie from 'dexie';

var db = new Dexie("teamsDb");
db.version(1).stores({
    soccerTeams: 'team_id'
});

/**
 * Gets team ids previously favorited by the user from indexeddb.
 */
const getFavoriteSoccerTeamIds = async () => {
    let favoriteTeams = await db.soccerTeams.toArray();
    let favoriteTeamIds = favoriteTeams.map(t => t.team_id);
    return favoriteTeamIds;
}

/**
 * Update the 'favorited' of a team by id. Puts if favorited, deletes if unfavorited.
 * @param {Number} team_id 
 * @param {Boolean} favorited 
 */
const upsertSoccerTeamFavorite = async (team_id, favorited) => {
    if (favorited) {
        await db.soccerTeams.put({ team_id });
    }
    else {
        await db.soccerTeams.delete(team_id);
    }
}

export {
    upsertSoccerTeamFavorite,
    getFavoriteSoccerTeamIds
}