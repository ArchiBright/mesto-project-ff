// Function to create a card
export function createCard(cardData, deleteCallback, openImagePopup) {
    const template = document.querySelector('#card-template').content.cloneNode(true);
    const cardElement = template.querySelector('.card');
    const cardImage = template.querySelector('.card__image');
    const cardTitle = template.querySelector('.card__title');
    const deleteButton = template.querySelector('.card__delete-button');
    const likeButton = template.querySelector('.card__like-button');
    
    cardTitle.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
  
    // Event listener for image click to open image popup
    cardImage.addEventListener('click', () => {
      openImagePopup(cardData.link, cardData.name, cardData.name); 
    });
  
    // Event listener for deleting a card
    deleteButton.addEventListener('click', () => {
      deleteCallback(cardElement);
    });
  
    // Event listener for liking a card
    likeButton.addEventListener('click', () => {
      likeButton.classList.toggle('card__like-button_is-active');
    });
  
    return cardElement;
  }
  
  // Function to remove a card
  export function removeCard(cardElement) {
    cardElement.remove();
  }