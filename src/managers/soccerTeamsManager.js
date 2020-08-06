import axios from "axios";

/** Returns Spain's soccer teams from the api-football
*/
const  getSoccerTeams = async () => {
    let { data = [] } = await axios.get('https://v2.api-football.com/teams/search/spain', { headers: {  'X-RapidAPI-Key': 'ea360369afdafbbceb798290968a671e' }});
    let { api : { teams } = {} } =  data;
    return teams;
}

export {
    getSoccerTeams
}