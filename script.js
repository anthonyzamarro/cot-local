const btn = document.getElementById('search-button');
const list = document.getElementById('list');

const tagEndpoint = "http://52.11.188.162/tag";
const authorEndpoint = "https://52.11.188.162/author";
const editorEndpoint = "https://52.11.188.162/editor";
const licenseEndpoint = "https://52.11.188.162/licenses";
const reviewEndpoint = "https://52.11.188.162/review";
const resourcesEndpoint = "https://52.11.188.162/resources";

function init() {
  // getResources();
  populateLicenseList();
  populateDisciplineList();
}

btn.addEventListener("click", () => {
  clear();
  getResources();
});


// This was supposed to populate the license drop down, but I only received a few items from the API.
// So, I decided to just hard code the licenses for now.
// const populateLicenseList = () => {
//   fetch(licenseEndpoint).then(function(response) {
//     return response.json();
//   }).then(function(obj) {
//     let value = license.options[license.selectedIndex].value;
//     obj.forEach((data) => {
//       if (data !== null && data.length < 13) {
//         console.log(data);
//       }
//     });
//   });
// }

// For now, I've just hard coded the licenses from the specs.
const populateLicenseList = () => {
  const licenses = ["CC BY", "CC BY-NC", "CC BY-NC-ND", "CC BY-NC-SA", "CC BY-SA", "Custom", "EMUCL", "GFDL", "GGPL", "OPL", "PD"]
  const licenseList = document.getElementById('license');
  for(let i = 0; i < licenses.length; i++) {
    const licenseListItem = document.createElement("option");
        licenseListItem.textContent = licenses[i];
        licenseListItem.value = licenses[i];
        licenseList.appendChild(licenseListItem);
  }
}

// This populates the disciplines drop down
const populateDisciplineList = () => {
  fetch(tagEndpoint).then(function(disciplineResponse) {
    return disciplineResponse.json();
  }).then(function(disciplines) {
    const disciplineList = document.getElementById('discipline');
    disciplines.forEach((discipline) => {
      const disciplineListItem = document.createElement("option");
          disciplineListItem.textContent = discipline.name;
          disciplineListItem.value = discipline.name;
          disciplineListItem.setAttribute('class', 'discipline-item');
          disciplineList.appendChild(disciplineListItem);
    });
  });
}

// Build the results list from the user input
const buildList = (resourceItem) => {
  let li = `<li>
            <p><strong>Title</strong>: ${resourceItem.title}</p>
            <p><strong>Author/Editor</strong>: ${resourceItem.authors.length > 0 ? resourceItem.authors.map(author => author.name).join(' ') : 'Not found'}  </p>
            <p><strong>Resource URL</strong>: ${resourceItem.url}</p>
            <p><strong>Discipline</strong>: ${resourceItem.tags.length > 0 ? resourceItem.tags.map(tag => tag.name).join(' ') : 'Not found' }</p>
            <p><strong>Repository</strong>: ${resourceItem.repository.name}</p>
            <p><strong>License</strong>: ${resourceItem.license.name !== null && resourceItem.license.name.length < 12 ? resourceItem.license.name : 'Custom'}</p>
            <p><strong>Peer Reviews</strong>: ${resourceItem.reviews !== null ? resourceItem.reviews :  'Not found'}</p>
            <p><strong>Ancillaries</strong>: ${resourceItem.ancillariesUrl !== null ? resourceItem.ancillariesUrl : 'Not found'}</p>
            </li>
            <br>`
  list.insertAdjacentHTML('beforeend', li);
}

const getResources = () => {
  fetch(resourcesEndpoint).then(function(resourcesResponse) {
    return resourcesResponse.json();
  })
  .then(function(resources) {
    const options = {
      keys: [
       'title', 'authors.name','tags.name'
      ]
    }
    const fuse = new Fuse(resources, options);
    const titleInput = document.querySelector('#title');
    const authorName = document.querySelector('#author-name');

    const disciplineArray = [];
    const disciplineOptions = document.getElementById('discipline');
    for (let i = 0; i < disciplineOptions.length; i++) {
      if (disciplineOptions.options[i].selected) {
        disciplineArray.push(disciplineOptions.options[i].value);
      }
    }
    disciplineArray.forEach(discipline => {
      const getDiscipline = fuse.search(discipline.toString());
        buildList(getDiscipline);
    });

    const getAuthor = fuse.search(authorName.value.toString());
    getAuthor.forEach(author => {
      buildList(author);
    });

    const getTitle = fuse.search(titleInput.value.toString());
    getTitle.forEach(title => {
      buildList(title);
    });











    // const authorInput = document.getElementById('author-name');
    // resources.forEach((resource) => {
    //   resource.tags.forEach((tag) => {
    //     disciplineArray.forEach((discipline) => {
    //       if (tag.name === discipline.toLowerCase()) {
    //         buildList(resource);
    //       }
    //     });
    //   });
    //   resource.authors.forEach((author) => {
    //     // return resource if entire entry matches
    //     if (authorInput.value === "") {
    //     // console.log('no author found');
    //     } else if (author.searchName === authorInput.value.toString()) {
    //       buildList(resource);
    //     } else {
    //       // return resource if one word from entry matches
    //       authorInput.value.split(' ').forEach((authorSearch) => {
    //         author.searchName.split(' ').join().split(',').forEach((authorResource) => {
    //           if (authorResource !== authorSearch) {
    //             // console.log('No author match');
    //           } else if (authorResource === authorSearch) {
    //             buildList(resource);
    //           }
    //         });
    //       });
    //     }
    //   });
    //   const titleInput = document.querySelector('#title')
    //   // If user doesn't type anything into the field, return 'Sorry, no match. Try again.'
    //   if (titleInput.value === "") {
    //     // console.log('no title match');
    //     return;
    //   } else if (resource.searchTitle === titleInput.value.toString().toLowerCase()) {
    //     buildList(resource);
    //   } else {
    //     title.value.split(' ').forEach((searchTitle) => {
    //       resource.searchTitle.split(' ').forEach((resourceTitle) => {
    //       if (searchTitle !== resourceTitle) {
    //       } else if (searchTitle === resourceTitle) {
    //         buildList(resource);
    //         }
    //       });
    //     });
    //   }
    // });
  }); // end of resource response
} // end of getResources
// This just erases the unordered list when the user makes multiple searches.
const clear = () => {
  document.getElementById('list').innerHTML = "";
};
document.addEventListener("DOMContentLoaded", init);
