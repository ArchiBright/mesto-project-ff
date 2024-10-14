
function createCard(cardData, deleteCallback) {
    const template = document.querySelector('#card-template').content.cloneNode(true);
    const cardElement = template.querySelector('.card');
    const cardImage = template.querySelector('.card__image');
    const cardTitle = template.querySelector('.card__title');
    const deleteButton = template.querySelector('.card__delete-button');
    
    
  
    cardTitle.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
  

    deleteButton.addEventListener('click', () => {
      deleteCallback(cardElement);
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

const editButton = document.querySelector('.profile__edit-button');
const editPopup = document.querySelector('.popup_type_edit');
const addButton = document.querySelector('.profile__add-button');
const addPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
function openPopup(popup) {
  popup.style.display = 'flex';
}


editButton.addEventListener('click', () => {
  openPopup(editPopup);
});

addButton.addEventListener('click', () => {
  openPopup(addPopup);
});

editButton.addEventListener('click', () => {
  openPopup(imagePopup);
});

  
  

  renderCards(initialCards);

  