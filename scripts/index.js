function createCard(cardData, deleteCallback) {
  const template = document.querySelector('#card-template').content.cloneNode(true);
  const cardElement = template.querySelector('.card');
  const cardImage = template.querySelector('.card__image');
  const cardTitle = template.querySelector('.card__title');
  const deleteButton = template.querySelector('.card__delete-button');
  const likeButton = template.querySelector('.card__like-button');
  
  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  
  
  // Add click event to open the image popup when the card image is clicked
  cardImage.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name, cardData.name); // Open the image popup
  });

  deleteButton.addEventListener('click', () => {
    deleteCallback(cardElement);
  });

  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('card__like-button_is-active');
  });

  return cardElement;
}

function removeCard(cardElement) {
  cardElement.remove();
}

function renderCards(cards) {
  const cardList = document.querySelector('.places__list');

  cards.forEach(cardData => {
    const cardElement = createCard(cardData, removeCard);
    cardList.appendChild(cardElement);
  });
}

// Image popup handling
const imagePopup = document.querySelector('.popup_type_image');
const imageElement = imagePopup.querySelector('.popup__image');
const imageCaption = imagePopup.querySelector('.popup__caption');

// Function to open the image popup with the clicked image and caption
function openImagePopup(imageSrc, imageAlt, captionText) {
  imageElement.src = imageSrc; // Set the image source
  imageElement.alt = imageAlt; // Set the alt text
  imageCaption.textContent = captionText; // Set the caption text
  openPopup(imagePopup); // Open the image popup
}

// Popup handling for edit and add popups
const editButton = document.querySelector('.profile__edit-button');
const editPopup = document.querySelector('.popup_type_edit');
const addButton = document.querySelector('.profile__add-button');
const addPopup = document.querySelector('.popup_type_new-card');
const closeButtons = document.querySelectorAll('.popup__close');

// Function to open any popup
function openPopup(popup) {
  popup.style.display = 'flex';
  document.addEventListener('keydown', closePopupOnEsc);
}

// Function to close any popup
function closePopup(popup) {
  popup.style.display = 'none';
  document.removeEventListener('keydown', closePopupOnEsc);
}

// Profile name and description elements
const profileNameElement = document.querySelector('.profile__title'); // Элемент с именем
const profileDescriptionElement = document.querySelector('.profile__description'); // Элемент с описанием
const nameInput = document.querySelector('.popup__input_type_name'); // Поле "Имя"
const descriptionInput = document.querySelector('.popup__input_type_description');
const editForm = document.querySelector('.popup__form[name="edit-profile"]');


// Handle the opening of edit and add popups
editButton.addEventListener('click', () => {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  openPopup(editPopup);
});

addButton.addEventListener('click', () => {
  openPopup(addPopup);
});

// Close popups when close buttons are clicked
closeButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const popup = event.target.closest('.popup');
    closePopup(popup);
  });
});

function closePopupOnEsc(event) {
  if (event.key === 'Escape') {
    const openPopup = document.querySelector('.popup[style="display: flex;"]'); // Find the open popup
    if (openPopup) {
      closePopup(openPopup);
    }
  }
}

editForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Предотвращаем стандартное поведение отправки формы
  
  // Обновляем информацию на странице
  profileNameElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = descriptionInput.value;
  
  // Закрываем попап после сохранения
  closePopup(editPopup);
});

const addCardForm = document.querySelector('.popup__form[name="new-place"]');

// Поля ввода для имени и ссылки карточки
const cardNameInput = document.querySelector('.popup__input_type_card-name');
const cardLinkInput = document.querySelector('.popup__input_type_url');

// Список карточек
const cardList = document.querySelector('.places__list');

// Функция добавления новой карточки в начало списка
function addNewCard(cardData) {
  const newCard = createCard(cardData, removeCard);
  cardList.prepend(newCard); // Добавляем карточку в начало списка
}

addCardForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Предотвращаем стандартное поведение формы
  
  // Создаем объект данных карточки из значений формы
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  
  // Добавляем новую карточку в начало
  addNewCard(newCardData);
  
  // Очищаем форму
  addCardForm.reset();
  
  // Закрываем попап добавления карточки
  closePopup(addPopup);
});

const popups = document.querySelectorAll('.popup'); // Select all popups
popups.forEach((popup) => {
  popup.addEventListener('click', (event) => {
    if (event.target === popup) { // If the click target is the overlay (popup itself, not content)
      closePopup(popup);
    }
  });
});

// Render initial cards (assuming you have an array `initialCards`)
renderCards(initialCards);


  