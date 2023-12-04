import { Card } from '../components/Card.js';
import { Section } from '../components/Section.js';
import { Api } from '../components/Api.js';
import './index.css';

// Создаём объект api класса Api
const api = new Api({
  baseUrl: 'https://mock.pages.academy/store/db'
});
