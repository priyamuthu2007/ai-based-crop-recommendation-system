const form = document.querySelector('#recommendation-form');
const cropName = document.querySelector('#crop-name');
const confidenceValue = document.querySelector('#confidence-value');
const confidenceBar = document.querySelector('#confidence-bar');
const resetButton = document.querySelector('#reset-button');

function chooseCrop(values) {
  if (values.rainfall > 180 && values.humidity > 70 && values.ph < 7.5) return ['Rice', 94, 'Your field conditions show a strong fit for a healthy rice season.'];
  if (values.rainfall < 90 && values.temperature > 25) return ['Millet', 88, 'Your warmer, drier field conditions suit a resilient millet crop.'];
  if (values.phosphorus > 45 && values.potassium > 35) return ['Maize', 86, 'Your nutrient profile is a good match for a productive maize season.'];
  return ['Chickpea', 79, 'Your current soil and weather profile shows a promising chickpea fit.'];
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());
  Object.keys(values).forEach((key) => { values[key] = Number(values[key]); });
  const [crop, confidence, message] = chooseCrop(values);
  cropName.textContent = crop;
  confidenceValue.textContent = `${confidence}%`;
  confidenceBar.style.width = `${confidence}%`;
  document.querySelector('.result-copy').textContent = message;
});

resetButton.addEventListener('click', () => {
  form.reset();
  cropName.textContent = 'Rice';
  confidenceValue.textContent = '94%';
  confidenceBar.style.width = '94%';
  document.querySelector('.result-copy').textContent = 'Your field conditions show a strong fit for a healthy rice season.';
});
