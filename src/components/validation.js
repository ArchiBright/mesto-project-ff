// Function to show error message
function showInputError(formElement, inputElement, errorMessage, config) {
    // Получаем элемент для вывода ошибки
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    
    // Проверяем, существует ли errorElement, прежде чем к нему обращаться
    if (errorElement) {
      inputElement.classList.add(config.inputErrorClass);
      errorElement.textContent = errorMessage;
      errorElement.classList.add(config.errorClass);
    }
  }

// Function to hide error message
function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    
    if (errorElement) {
      inputElement.classList.remove(config.inputErrorClass);
      errorElement.classList.remove(config.errorClass);
      errorElement.textContent = '';
    }
  }

// Function to check if input is valid
function isValid(formElement, inputElement, settings) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ -]+$/;

    if (!inputElement.validity.valid) {
        if (inputElement.type === 'text' && !nameRegex.test(inputElement.value)) {
            showInputError(formElement, inputElement, "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы", settings);
        } else {
            showInputError(formElement, inputElement, inputElement.validationMessage, settings);
        }
    } else {
        hideInputError(formElement, inputElement, settings);
    }
}

// Function to check form validity and toggle submit button
function toggleButtonState(inputList, buttonElement, settings) {
    const isFormInvalid = inputList.some((inputElement) => !inputElement.validity.valid);
    if (isFormInvalid) {
        buttonElement.classList.add(settings.inactiveButtonClass);
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove(settings.inactiveButtonClass);
        buttonElement.disabled = false;
    }
}

// Function to set event listeners for form inputs
function setEventListeners(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            isValid(formElement, inputElement, settings);
            toggleButtonState(inputList, buttonElement, settings);
        });
    });
}

// Function to enable validation for all forms
export function enableValidation(settings) {
    const formList = Array.from(document.querySelectorAll(settings.formSelector));
    formList.forEach((formElement) => {
        setEventListeners(formElement, settings);
    });
}

// Function to clear validation errors
export function clearValidation(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, settings);
    });

    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
}