import axios from "axios";

/** Returns soccer teams from the "server" - basically a json file.
 *  The method also mocks the action of paging and sorting (what should be in the server side)
*/
const  getSoccerTeams = async ({ page, itemsPerPage, orderBy, isDesc = false }) => {
    let { data = [] } = await axios.get('data/teams.json');
    let pagedResponse = mockServerSidePaging(data, page, itemsPerPage, orderBy, isDesc);


    return pagedResponse;
}

/**
 * Applies paging logic and sorting on given items, what normally happens in server side database.
 */
const mockServerSidePaging = (items, page, itemsPerPage, orderBy, isDesc) => {
    let startRowIndex = (page - 1) * itemsPerPage;
    let sortMultiplier = isDesc ? -1 : 1;
    let sortedItems = orderBy ? items.sort((item, nextItem) =>  {
        let value = item[orderBy];
        let nextValue = nextItem[orderBy];
        let res = value < nextValue ? -1 : value > nextValue ? 1 : 0;
        return res * sortMultiplier;
    }) : items;
    let pagedItems = sortedItems.slice(startRowIndex, startRowIndex + itemsPerPage);
    let res = { items: pagedItems, totalItems: items.length  }
    return res;
}

export {
    getSoccerTeams
}