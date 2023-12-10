import axios from '../node_modules/axios';

const MAIN_URL = 'https://pixabay.com/api/';
const KEY = '29244852-b91e3d5198a9840c92a9dad06';

const form = document.querySelector('#search-form');
form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  const queryString = event.target.searchQuery.value.trim();
  console.log(queryString);
  form.reset();
  fetchQuery(queryString)
    .then(response => {
      createLayout(response);
    })
    .catch(err => console.log(err));
}
async function fetchQuery(queryString) {
  const axInstance = await axios(
    `${MAIN_URL}?key=${KEY}&q=${queryString}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  return axInstance;
}

function createLayout(response) {
  if (!response.data.total) {
    form.reset();
    throw new Error('err');
  } else {
    console.log(response.data);
  }
}
