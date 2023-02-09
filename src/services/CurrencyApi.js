const fetchExchangeRate = async () => {
  const response = await fetch(
    "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
};

export default fetchExchangeRate;
