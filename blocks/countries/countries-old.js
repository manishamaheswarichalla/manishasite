import { fetchPlaceholders,getMetadata } from '../../scripts/aem.js';
let sheetdata = null;
let currentPage = 1;
const itemsPerPage = 20;

// Function to render pagination controls
function renderPaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination-controls');

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.innerText = 'Previous';
  prevBtn.disabled = currentPage === 1; // Disable if on the first page
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
    }
  });
  paginationContainer.append(prevBtn);

  // Page indicator
  const pageIndicator = document.createElement('span');
  pageIndicator.innerText = `Page ${currentPage} of ${totalPages}`;
  paginationContainer.append(pageIndicator);

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.innerText = 'Next';
  nextBtn.disabled = currentPage === totalPages; // Disable if on the last page
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateTable();
    }
  });
  paginationContainer.append(nextBtn);

  return paginationContainer;
}

// Function to update the table with pagination
async function updateTable() {
  const tableContainer = document.querySelector('.countries-block');
  // const tableContainer = document.getElementsByClassName('countries-block');
  console.log(tableContainer)
  tableContainer.innerHTML = ''; // Clear the current table and pagination

  // Recreate the table with sliced data
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = sheetdata.slice(start, end);

  // Create new table with paginated data
  const table = document.createElement('table');
  await createTableHeader(table); // Your existing createTableHeader function
  paginatedData.forEach((row, i) => {
    createTableRow(table, row, start + i + 1); // Your existing createTableRow function
  });
  
  // Append the table and pagination controls
  tableContainer.append(table);
  const paginationControls = renderPaginationControls(sheetdata.length);
  tableContainer.append(paginationControls);
}

// Initialization function that fetches the data and sets up the table
async function initTableWithPagination(jsonURL) {
  const resp = await fetch(jsonURL);
  const json = await resp.json();
  sheetdata = json.data;
  console.log(sheetdata)

  // Initially load the first page
  updateTable();
}

async function createTableHeader(table){
  let tr=document.createElement("tr");
  console.log(sheetdata)
  let tableHeadings = Object.keys(sheetdata[0]);
  console.log(tableHeadings)
  tableHeadings.map((ele,i) => {
    let eleName = document.createElement("th");
    eleName.appendChild(document.createTextNode(ele));
    tr.append(eleName)
  })
    table.append(tr);
}
async function createTableRow(table,row,i){
  console.log(table);
  console.log(row);
    let tr=document.createElement("tr");

    let sno=document.createElement("td");
    sno.appendChild(document.createTextNode(i));
    let conuntry=document.createElement("td");
    let abbr=document.createElement("td");
    let capital=document.createElement("td");
    let continent=document.createElement("td");
    conuntry.appendChild(document.createTextNode(row.Country));
    abbr.appendChild(document.createTextNode(row.Abbreviation));
    continent.appendChild(document.createTextNode(row.Continent));
    capital.appendChild(document.createTextNode(row["Capital City"]));
    tr.append(conuntry);
    tr.append(continent);
    tr.append(capital);
    tr.append(abbr);
    table.append(tr);
}

async function createTable(jsonURL,val) {

    // let  pathname = null;
    // if(val){
    //     pathname=jsonURL;
    // }else{
    //     pathname= new URL(jsonURL);
    // }
    
    const resp = await fetch(jsonURL);
    const json = await resp.json();
    console.log("=====JSON=====> {} ",json);
    sheetdata = json.data[0]
    
    const table = document.createElement('table');
    createTableHeader(table);
    json.data.forEach((row,i) => {
      createTableRow(table,row,(i+1));
    });

    return table;
}    

export default async function decorate(block) {
  console.log(block)
    const countries = block.querySelector('a[href$=".json"]');
    console.log(countries)
    const parientDiv=document.createElement('div');
    parientDiv.classList.add('countries-block');
    // console.log(document.querySelector('contries-block'));
    console.log(parientDiv);
    // console.log(countries.href)

    if (countries) {
      block.appendChild(parientDiv);
        // parientDiv.append(await createSelectMap(countries.href));
        // parientDiv.append(await createTable(countries.href,null));
        // countries.replaceWith(parientDiv);

        console.log(countries.href)
        await initTableWithPagination(countries.href);
        countries.replaceWith(parientDiv);
        
    }
  }