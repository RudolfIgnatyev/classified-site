class Card {
  constructor(data, cardSelector, { handleCardClick, handleHeartClick }, selectorsAndClass, likedProperty, currentUserId) {
    this.#name = data.name;
    this.#link = data.link;
    this.#likedCardId = data.likes;
    this.#cardId = data.#id;
    this.#cardSelector = cardSelector;
    this.#handleCardClick = handleCardClick;
    this.#handleHeartClick = handleHeartClick;
    this.#cardImageSelector = selectorsAndClass.cardImageSelector;
    this.#cardTitleSelector = selectorsAndClass.cardTitleSelector;
    this.#cardLikeIconSelector = selectorsAndClass.cardLikeIconSelector;
    this.#cardLikeIconActiveClass = selectorsAndClass.cardLikeIconActiveClass;
    this.#cardLikeAmountTextSelector = selectorsAndClass.cardLikeAmountTextSelector;
    this.#likedProperty = likedProperty;
    this.#currentUserId = currentUserId;
  }

  // Метод клонирования содержимого селектора шаблона
  #getTemplate() {
    const cardElement = document.querySelector(this.#cardSelector).content.cloneNode(true);
    return cardElement.firstElementChild;
  }

  // Метод прикрепления обработчиков к элементам
  #setEventListeners() {
    this.#element.querySelector(this.#cardLikeIconSelector).addEventListener('click', this.#likeCard.bind(this));
    this.#element.querySelector(this.#cardImageSelector).addEventListener('click', () => {
      this.#handleCardClick();
    });
  }

  // Публичный метод генерирования карточки
  generateCard() {
    this.#element = this.#getTemplate();
    this.#setEventListeners();
    this.#element.id = this.#cardId;
    this.#element.querySelector(this.#cardImageSelector).src = this.#link;
    this.#element.querySelector(this.#cardImageSelector).alt = this.#name;
    this.#element.querySelector(this.#cardTitleSelector).textContent = this.#name;

    // Проверяем наличие "лайка" у карточки после загрузки страницы для автоматической пометки понравившейся карточки в положительном случае
    if (this.#likedCardId === this.#cardId) {
      this.#element.querySelector(this.#cardLikeIconSelector).classList.toggle(this.#cardLikeIconActiveClass);
    }

    return this.#element;
  }

  // Метод создания и удаления пометки понравившейся карточки
  #likeCard() {
    this.#likedProperty = (!this.#element.querySelector(this.#cardLikeIconSelector).classList.contains('fav-add_checked')) ? true : false;
    this.#handleHeartClick(this.#element.id, this.#element.querySelector(this.#cardLikeIconSelector), this.#likedProperty);
  }
}

export { Card };
