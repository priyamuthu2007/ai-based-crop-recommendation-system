const form = document.querySelector('#recommendation-form');
const cropName = document.querySelector('#crop-name');
const confidenceValue = document.querySelector('#confidence-value');
const confidenceBar = document.querySelector('#confidence-bar');
const resetButton = document.querySelector('#reset-button');
const submitButton = document.querySelector('.primary-button');
const resultPanel = document.querySelector('.result-panel');

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle('is-loading', isLoading);
  if (isLoading) {
    submitButton.innerHTML = '<span>✦</span> Analysing field...';
  } else {
    submitButton.innerHTML = '<span>✦</span> Get crop recommendation <b>→</b>';
  }
}

async function requestRecommendation(values) {
  const response = await fetch('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Unable to get recommendation.');
  }

  return response.json();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());
  Object.keys(values).forEach((key) => { values[key] = Number(values[key]); });

  setLoading(true);
  try {
    const result = await requestRecommendation(values);
    cropName.textContent = result.crop;
    confidenceValue.textContent = `${result.confidence}%`;
    confidenceBar.style.width = `${result.confidence}%`;
    document.querySelector('.result-copy').textContent = result.message;
    resultPanel.classList.add('is-ready');
  } catch (error) {
    document.querySelector('.result-copy').textContent = error.message || 'Could not generate a recommendation.';
    confidenceValue.textContent = '0%';
    confidenceBar.style.width = '0%';
  } finally {
    setLoading(false);
  }
});

resetButton.addEventListener('click', () => {
  form.reset();
  cropName.textContent = 'Rice';
  confidenceValue.textContent = '94%';
  confidenceBar.style.width = '94%';
  document.querySelector('.result-copy').textContent = 'Your field conditions show a strong fit for a healthy rice season.';
  resultPanel.classList.remove('is-ready');
});
