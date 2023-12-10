import { fetchBreeds } from './cat-api';
import { fetchCatByBreed } from './cat-api';

const select = document.querySelector('.breed-select');
select.addEventListener('change', selectOnChange);
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');
loader.hidden = false;
error.hidden = true;
select.style.width = '200px';

function createLayoutSelect(response) {
  const options = response.map(({ id, name }) => {
    return `<option value="${id}" class="js-option">${name}</option>`;
  });
  options.unshift(
    '<option value="" disabled selected>Оберіть породу кішки...</option>'
  );
  return (select.innerHTML = options.join(''));
}

fetchBreeds()
  .then(response => {
    loader.hidden = true;
    createLayoutSelect(response);
  })
  .catch(() => {
    error.hidden = false;
    select.hidden = true;
  });

function selectOnChange(event) {
  error.hidden = true;
  if (event.target.value) {
    select.firstChild.remove();
    loader.hidden = false;
    catInfo.innerHTML = '';
  }
  fetchCatByBreed(event.target.value)
    .then(response => {
      loader.hidden = true;
      catInfo.innerHTML =
        createLayoutInfo(response) ?? (catInfo.innerHTML = '');
    })
    .catch(() => {
      error.hidden = false;
      select.hidden = true;
    });
}

function createLayoutInfo(response) {
  if (response.length) {
    const url = response[0].url;
    return response[0].breeds
      .map(({ name, description, temperament }) => {
        return `<img src="${url}" alt="${name}" width="500px"/>
        <div class="wrapper"><h2>${name}</h2>
        <p>${description}</p>
        <p><span>Temperament: </span>${temperament}</p></div>`;
      })
      .join('');
  } else {
    error.hidden = false;
    select.hidden = true;
  }
}
