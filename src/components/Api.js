class Api {
  constructor({ baseUrl, headers = {} }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  // Метод проверки промиса с его разрешением или отклонением в зависимости от ответа сервера
  #checkPromise(res) {
    if (res.ok) {
      return res.json();
    }

    // Если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Публичный метод загрузки с сервера начальных карточек
  getInitialCards() {
    return fetch(`${this.baseUrl}`, {
      method: 'GET',
      headers: this.headers
    })
      .then(res => this.#checkPromise(res));
  }
}

export { Api };
