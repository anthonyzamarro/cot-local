const btn = document.getElementById('search-button');
// const list = document.getElementById('list');

let baseUrl = `http://52.11.188.162/`;


//I keep getting an http status of 400 whenever I request /author(s)
//I've reviewed the Swagger documentation and I'm not sure what I'm
//getting wrong here. Is this the appropriate endpoint?
function getAuthors() {
  fetch(baseUrl + 'authors')
    .then(response => response.json())
    .then(authors => console.log(authors))
    .catch(error =>console.error(error));
}


let searchBooksObj = {
  // "authorIds": [
  //   0
  // ],
  // "editorIds": [
  //   0
  // ],
  // "licenseCodes": [

  // ],
  "partialTitle": title.value,
  // "partialUrl": "string",
  "repositoryIds": [
  ]
  ,
  "tagIds": [

  ]
}

//get title from
function getTitle() {
  const title = document.querySelector('#title');
  title.addEventListener('change', (e) => {
    searchBooksObj.partialTitle = e.target.value;
  })
}

//POST to /search to get data
function searchBooks() {
  // console.log(JSON.stringify(searchBooksObj));
  // fetch(baseUrl + 'search', {
  //   body: JSON.stringify(searchBooksObj),
  //   cache: 'no-cache',
  //   headers: {
  //     'content-type': 'application/json',
  //   },
  //   method: 'POST',
  // }).then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //   })
  //   .catch(error => console.error(error));
}
//kick things off when the page loads
function init() {
  getTitle();
  getLicences();
  getDisciplines();
  getAuthorsEditors();
  getRepositories();
}

btn.addEventListener("click", () => {
  clear();
  searchBooks();
  getAuthors();
});

function getLicences() {
  //these are the licenses provided from the spec that the user can select
  const licenses = ["CC BY", "CC BY-NC", "CC BY-NC-ND", "CC BY-NC-SA", "CC BY-SA", "EMUCL", "GFDL", "GGPL", "OPL", "PD"]
  const licenseList = document.getElementById('license-select');
  const licenseSearch = document.getElementById('license-search');
  for(let i = 0; i < licenses.length; i++) {
    const licenseListItem = document.createElement("option");
      licenseListItem.textContent = licenses[i];
      licenseListItem.value = licenses[i];
      licenseList.appendChild(licenseListItem);
  }
  //get license from the dropdown
  licenseList.addEventListener('change', (e) => {
    searchBooksObj.licenseCodes.push(e.target.value);
  });
  // get custom license from text input
  licenseSearch.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      searchBooksObj.licenseCodes.push(licenseSearch.value);
    }
  });
}

//this populates and GETs disciplines
function getDisciplines()  {
  const disciplineList = document.querySelector('#disciplines');
  fetch(baseUrl + 'tag')
    .then(disciplineResponse => disciplineResponse.json())
    .then(disciplines => {
      const lists = disciplines.map((i) => [i.name, i.id]  );
      //use awesomplete js library to dynamically list tags
      new Awesomplete(disciplineList, {
        list: lists,
        replace: function(name) {
         this.input.value = name.label
      }
    });
    //get selected tag and populate tag key in searchBookObj to POST
    disciplineList.addEventListener("awesomplete-select", function(event) {
      searchBooksObj.tagIds = [event.text.value];
    });
  })
  .catch(error => console.error(error));
}

//so far this only populates/GETs the editors.
function getAuthorsEditors() {
  const editorsAuthorsList = document.querySelector('#author-name');
  fetch(baseUrl + 'editors')
    .then(response => response.json())
    .then(editors => {
      const lists = editors.map((i) => [i.name, i.id]);
      new Awesomplete(editorsAuthorsList, {
        list: lists,
        replace: function(name) {
          this.input.value = name.label
        }
      });
      editorsAuthorsList.addEventListener("awesomplete-select", function(event) {
        searchBooksObj.editorIds = [event.text.value];
      });
    })
    .catch(error => console.error(error));
}

//this populates/GETs the reposiroties
function getRepositories() {
  const respository = document.querySelector('#repository');
  fetch(baseUrl + 'repositories')
    .then(response => response.json())
    .then(repositories => {
      const lists = repositories.map((i) => [i.name, i.id]);
      new Awesomplete(repository, {
        list: lists,
        replace: function(name) {
          this.input.value = name.label
        }
      });
      repository.addEventListener("awesomplete-select", function(event) {
        searchBooksObj.repositoryIds.push(event.text.value);
      });
    })
    .catch(error => console.error(error));
}


// This just erases the unordered list when the user makes multiple searches.
function clear() {
  document.getElementById('list').innerHTML = "";
};
document.addEventListener("DOMContentLoaded", init);
