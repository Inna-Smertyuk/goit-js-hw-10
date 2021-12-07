import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector(`input#search-box`);
const сountryList = document.querySelector(`.country-list`);
const countryInfo = document.querySelector(`.country-info`);

searchBox.addEventListener('input', debounce(showCountry, DEBOUNCE_DELAY));

function showCountry() {
    fetchCountries(searchBox.value.trim())
        .then(country => {
            сountryList.innerHTML = '';
            countryInfo.innerHTML = '';

            if (country.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (country.length >= 2 && country.length <= 10) {
                renderCountryList(country);
            } else if (country.length === 1) {
                renderCountryInfo(country);
            }
        })
        .catch(showError);
}

function renderCountryList(country) {
    сountryList.innerHTML = country.map(({ name, flags }) => {
            return `<li class="country-item">
    <img class="country-item__img" src="${flags.svg}" alt="${name.common} width="30" height="20">
    <span class="country-item__name">${name.common}<span>
    </li>`;
        })
        .join('');
}

function renderCountryInfo([{ name, capital, population, flags, languages }]) {
    const lang = Object.values(languages).join(', ')
    return countryInfo.innerHTML = `<img src="${flags.svg}" alt="${name.common} width="30" height="30">
       <span class="country-item__name">${name.official}</span>
  <p class="info">Capital:<span>${capital}</span></p>
  <p class="info">Population:<span>${population}</span></p>
  <p class="info">Languages:<span>${lang}</span></p>`;

}

function showError(error) {
    console.log(error);
    Notiflix.Notify.failure('Oops, there is no country with that name');
    countryInfo.innerHTML = '';
    сountryList.innerHTML = '';
}