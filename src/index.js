import axios from "axios";
import SlimSelect from 'slim-select'
import Notiflix from 'notiflix';
axios.defaults.headers.common["x-api-key"] = "live_GjIVFJQdIadSkDRZ0Y4ZowRqOxnObwoHNcs4EbHDhbUzMjjnQveFnJevRgec2rqN";

const breedSelect = document.querySelector('select.breed-select');
const catInfoDiv = document.querySelector('div.cat-info');
const loader = document.querySelector('p.loader');

const urlPlaceholder = "https://api.thecatapi.com/v1/breeds";

loader.style.visibility = 'hidden';


// create the dropdown and add info from api
axios.get(urlPlaceholder)
  .then((response) => {
    const breeds = response.data;
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    new SlimSelect({
      select: breedSelect
    })
  })
  .catch((error) => {
    console.error('Error fetching breeds:', error);
  });

// onchange functionality - grab info, create elements and add html

  breedSelect.addEventListener('change', event => {
    loader.style.visibility = 'visible';
    catInfoDiv.style.visibility = 'hidden';
    const selectedBreedId = event.target.value;
    fetchCatByBreed(selectedBreedId)
      .then(catData => {

          const cat = catData[0];
          const breed = cat.breeds[0];
  
          catInfoDiv.innerHTML = `
            <img src="${cat.url}" alt="${breed.name}" class="cat-photo" />
            <h2>${breed.name}</h2>
            <p><strong>Description:</strong> ${breed.description}</p>
            <p><strong>Temperament:</strong> ${breed.temperament}</p>
          `;
          loader.style.visibility = 'hidden';
          catInfoDiv.style.visibility = 'visible';

      })
      .catch(error => {
        Notiflix.Notify.failure("Oops! Something went wrong! Try reloading the page!");
        loader.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';

      });
  });

  
  function fetchCatByBreed(breedId) {
    return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to fetch cat details:', error);
        throw error;
      });
  }
