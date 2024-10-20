export function openModal(popup) {
    popup.classList.add('popup_is-opened'); 
    document.addEventListener('keydown', closeModalOnEsc);
  }
  

  export function closeModal(popup) {
    popup.classList.remove('popup_is-opened'); 
    document.removeEventListener('keydown', closeModalOnEsc);
  }
  

  function closeModalOnEsc(event) {
    if (event.key === 'Escape') {
      const openPopup = document.querySelector('.popup.popup_is-opened'); 
      if (openPopup) {
        closeModal(openPopup);
      }
    }
  }
  

  export function addPopupListeners(popups) {
    popups.forEach((popup) => {
      popup.addEventListener('click', (event) => {
        if (event.target === popup) { 
          closeModal(popup);
        }
      });
    });
  }