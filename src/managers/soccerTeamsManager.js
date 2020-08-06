import axios from "axios";

/** Returns Spain's soccer teams from the api-football
*/
const  getSoccerTeams = async () => {
    let { data = [] } = await axios.get('https://v2.api-football.com/teams/search/spain', { headers: {  'X-RapidAPI-Key': '2a6e52c3f683f91976c2ce411af2c19c' }});
    let { api : { teams } = {} } =  data;
    return teams;
}

export {
    getSoccerTeams
}