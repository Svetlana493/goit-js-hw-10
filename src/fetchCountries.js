export function fetchCountries(name) {
    const params = 'name,capital,population,flags,languages';
    const url = `https://restcountries.com/v3.1/name/${name}?fields=${params}`;
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(response.message);
        }
        return response.json();
    });
}