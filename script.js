const form = document.querySelector('#converter-form');
const input = document.querySelector('#temperature-input');
const fromUnit = document.querySelector('#from-unit');
const toUnit = document.querySelector('#to-unit');
const swapButton = document.querySelector('#swap-button');
const clearButton = document.querySelector('#clear-button');
const errorMessage = document.querySelector('#input-error');
const resultPanel = document.querySelector('#result-panel');
const resultValue = document.querySelector('#result-value');
const resultDescription = document.querySelector('#result-description');
const temperatureStatus = document.querySelector('#temperature-status');

const symbols = { C: '°C', F: '°F', K: 'K' };

function toCelsius(value, unit) {
  if (unit === 'F') return (value - 32) * 5 / 9;
  if (unit === 'K') return value - 273.15;
  return value;
}

function fromCelsius(value, unit) {
  if (unit === 'F') return (value * 9 / 5) + 32;
  if (unit === 'K') return value + 273.15;
  return value;
}

function convertTemperature(value, from, to) {
  return fromCelsius(toCelsius(value, from), to);
}

function isPhysicallyValid(value, unit) {
  return unit !== 'K' || value >= 0;
}

function getTemperatureStatus(valueCelsius) {
  if (valueCelsius < 10) return { label: 'Fría', className: 'cold', description: 'La temperatura se encuentra en un rango frío.' };
  if (valueCelsius >= 30) return { label: 'Caliente', className: 'hot', description: 'La temperatura se encuentra en un rango caliente.' };
  return { label: 'Templada', className: 'neutral', description: 'La temperatura se encuentra en un rango templado.' };
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 4
  }).format(value);
}

function showError(message) {
  errorMessage.textContent = message;
  input.classList.add('invalid');
}

function clearError() {
  errorMessage.textContent = '';
  input.classList.remove('invalid');
}

function renderResult(value, targetUnit, sourceValue, sourceUnit) {
  const celsiusValue = toCelsius(sourceValue, sourceUnit);
  const status = getTemperatureStatus(celsiusValue);

  resultValue.textContent = `${formatNumber(value)} ${symbols[targetUnit]}`;
  resultDescription.textContent = status.description;
  temperatureStatus.textContent = status.label;
  temperatureStatus.className = `status-badge ${status.className}`;

  resultPanel.classList.remove('animate');
  void resultPanel.offsetWidth;
  resultPanel.classList.add('animate');
}

function convert() {
  clearError();

  if (input.value.trim() === '') {
    showError('Ingresa una temperatura para realizar la conversión.');
    return;
  }

  const value = Number(input.value);

  if (!Number.isFinite(value)) {
    showError('Ingresa un número válido, por ejemplo: 25 o -10.5.');
    return;
  }

  if (!isPhysicallyValid(value, fromUnit.value)) {
    showError('La temperatura en Kelvin no puede ser menor que 0 K.');
    return;
  }

  const result = convertTemperature(value, fromUnit.value, toUnit.value);
  renderResult(result, toUnit.value, value, fromUnit.value);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  convert();
});

input.addEventListener('input', () => {
  if (input.value.trim() !== '') convert();
});

fromUnit.addEventListener('change', () => {
  if (input.value.trim() !== '') convert();
});

toUnit.addEventListener('change', () => {
  if (input.value.trim() !== '') convert();
});

swapButton.addEventListener('click', () => {
  const previousFrom = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = previousFrom;

  if (input.value.trim() !== '') convert();
});

clearButton.addEventListener('click', () => {
  input.value = '';
  fromUnit.value = 'C';
  toUnit.value = 'F';
  clearError();
  resultValue.textContent = '—';
  resultDescription.textContent = 'Ingresa una temperatura para comenzar.';
  temperatureStatus.textContent = '—';
  temperatureStatus.className = 'status-badge neutral';
  input.focus();
});
