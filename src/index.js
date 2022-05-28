import './css/styles.css';
import { fetchCountries } from './fetchCountries'
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;
const refs = {
    inputEl: document.querySelector('#search-box'),
    countryListEl: document.querySelector('.country-list'),
    countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function createListCountryEl(countries) {
    return countries
        .map(
            country =>
            `<li style = "list-style-type: none; display:flex; align-items: center" > <img src="${country.flags.svg}" alt="flag" width = "44px" heigth = "auto" /> <p style = "margin-left: 20px; color: blue"> ${country.name.common} </p></li>`,
        )
        .join('');
}

function createCardCountryEl(nameCountry) {
    return nameCountry
        .map(
            country => `            
            <img src="${
              country.flags.png
            }" alt="" width ="80px" /> <h2 style = "color: red; font-size: 36px "> ${
        country.name.official
      }</h2>
            <p style = "color: green" > Capital: ${country.capital}</p>
            <p style = "color: purple"> Population: ${country.population}</p>
          <p style = "color: blue"> Languages: ${Object.values(country.languages).join(', ')}</p>`,
        )
        .join('');
}

function clearSearchResult() {
    refs.countryListEl.innerHTML = '';
    refs.countryInfoEl.innerHTML = '';
}

function onInput(e) {
    e.preventDefault();
    const nameCountry = e.target.value.trim();
    console.log(nameCountry);
    clearSearchResult();
    if (nameCountry === '') {
        return;
    }

    fetchCountries(nameCountry)
        .then(countries => {
            console.log(countries);
            if (countries.length >= 10) {
                console.log('Too many matches found. Please enter a more specific name.');
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            } else if ((countries.length >= 2) & (countries.length < 10)) {

                const nameCountryElement = createListCountryEl(countries);
                refs.countryListEl.insertAdjacentHTML('beforeend', nameCountryElement);
            } else if (countries.length === 1) {
                const cardCountryElement = createCardCountryEl(countries);
                refs.countryInfoEl.insertAdjacentHTML('beforeend', cardCountryElement);
            }
        })
        .catch(onFetchCatch);

}

function onFetchCatch(error) {
    console.error(error);
    Notiflix.Notify.failure('Oops, there is no country with that name');
}