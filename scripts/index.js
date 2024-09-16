
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
  

  renderCards(initialCards);