export function fetchCoins() {
  // It needs to  return json data's promise
  return fetch(`https://api.coinpaprika.com/v1/coins`).then((response) => response.json());
}
