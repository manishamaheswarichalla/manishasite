import { fetchPlaceholders,getMetadata } from '../../scripts/aem.js';
let sheetdata = null;

async function createTableHeader(table){
  let tr=document.createElement("tr");
  let tableHeadings = Object.keys(sheetdata);
  console.log(tableHeadings)
  tableHeadings.map((ele,i) => {
    let eleName = document.createElement("th");
    eleName.appendChild(document.createTextNode(ele));
    tr.append(eleName)
  })
    // let conuntry=document.createElement("th");
    // conuntry.appendChild(document.createTextNode(country));
    // let continenth=document.createElement("th");
    // continenth.appendChild(document.createTextNode(continent));
    // let capitalh=document.createElement("th");
    // capitalh.appendChild(document.createTextNode(capital));
    // let abbr=document.createElement("th");
    // abbr.appendChild(document.createTextNode(abbreviation));
    // tr.append(sno);
    // tr.append(conuntry);
    // tr.append(capitalh);
    // tr.append(continenth);
    // tr.append(abbr);
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

// async function createSelectMap(jsonURL){
//     const optionsMap=new Map();
//     const { pathname } = new URL(jsonURL);

//     const resp = await fetch(pathname);
//     optionsMap.set("all",allCountries);optionsMap.set("asia",asia);optionsMap.set("europe",europe);optionsMap.set("africa",africa);optionsMap.set("america",america);optionsMap.set("australia",australia);
//     const select=document.createElement('select');
//     select.id = "region";
//     select.name="region";
//     optionsMap.forEach((val,key) => {
//         const option = document.createElement('option');
//         option.textContent = val;
//         option.value = key;
//         select.append(option);
//       });
     
//      const div=document.createElement('div'); 
//      div.classList.add("region-select");
//      div.append(select);
//     return div;
// }
async function createTable(jsonURL,val) {

    let  pathname = null;
    if(val){
        pathname=jsonURL;
    }else{
        pathname= new URL(jsonURL);
    }
    
    const resp = await fetch(pathname);
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
    parientDiv.classList.add('contries-block');
    // console.log(countries.href)

    if (countries) {
        // parientDiv.append(await createSelectMap(countries.href));
        parientDiv.append(await createTable(countries.href,null));
        countries.replaceWith(parientDiv);
        
    }
    // const dropdown=document.getElementById('region');
    //   dropdown.addEventListener('change', () => {
    //     let url=countries.href;
    //     if(dropdown.value!='all'){
    //         url=countries.href+"?sheet="+dropdown.value;
    //     }
    //     const tableE=parientDiv.querySelector(":scope > table");
    //     let promise = Promise.resolve(createTable(url,dropdown.value));
    //     promise.then(function (val) {
    //         tableE.replaceWith(val);
    //     });
    //   });
  }