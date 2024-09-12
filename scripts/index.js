


// // @todo: Темплейт карточки
// const cardTemplate = document.querySelector('#card-template').content;

// // @todo: DOM узлы

// // @todo: Функция создания карточки

// function createCard(cardData, deleteCallback) {
//     const template = document.querySelector('#card-template').content.cloneNode(true);
//     const cardElement = template.querySelector('.card');
//     const cardImage = template.querySelector('.card__image');
//     const cardTitle = template.querySelector('.card__title');
//     const deleteButton = template.querySelector('.card__delete-button');

//     cardImage.src = cardData.link;
//     cardImage.alt = cardData.name;
//     cardTitle.textContent = cardData.name;
//     deleteButton.addEventListener('click', () => {
//         deleteCallback(cardElement);
//     });

//     return cardElement;
// }

// // @todo: Функция удаления карточки

// // @todo: Вывести карточки на страницу

// function renderCards(cards) {
//     const cardList = document.querySelector('.places__list');
  
//     cards.forEach(cardData => {
//       const cardElement = createCard(cardData, (cardElement) => {
//         // Удаление карточки из DOM
//         cardElement.remove();
//       });
//       cardList.appendChild(cardElement);
//     });
//   }
  
//   // При загрузке страницы выводим все карточки
//   renderCards(initialCards);


// const initialCards = [
//     { name: 'Mountain', link: './images/card_1.jpg' },
//     { name: 'Ocean', link: './images/card_2.jpg' },
//     { name: 'Forest', link: './images/card_3.jpg' },
//     { name: 'Desert', link: './images/card_4.jpg' },
//     { name: 'City', link: './images/card_5.jpg' },
//     { name: 'Island', link: './images/card_6.jpg' }
//   ];

function createCard(cardData, deleteCallback) {
    // Clone the template
    const template = document.querySelector('#card-template').content.cloneNode(true);
  
    // Get elements inside the cloned template
    const cardElement = template.querySelector('.card');
    const cardImage = template.querySelector('.card__image');
    const cardTitle = template.querySelector('.card__title');
    const deleteButton = template.querySelector('.card__delete-button');
  
    // Set the image and title for the card
    cardTitle.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
  
    // Add event listener to the delete button
    deleteButton.addEventListener('click', () => {
      deleteCallback(cardElement);
    });
  
    return cardElement;
  }

  function renderCards(cards) {
    const cardList = document.querySelector('.places__list');
  
    cards.forEach(cardData => {
      const cardElement = createCard(cardData, (cardElement) => {
        // Remove the card from the DOM
        cardElement.remove();
      });
      cardList.appendChild(cardElement);
    });
  }
  
  // Call the render function on page load
  renderCards(initialCards);