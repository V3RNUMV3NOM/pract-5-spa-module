// router.js
import { state, setState } from './state.js';

export const navigateTo = (url) => {
    // Змінюємо URL в адресному рядку браузера без перезавантаження
    window.history.pushState(null, null, url);
    // Оновлюємо стан застосунку
    setState({ currentPage: url });
};

export const initRouter = () => {
    // Обробка події натискання кнопок "Назад/Вперед" у браузері
    window.addEventListener('popstate', () => {
        setState({ currentPage: window.location.pathname });
    });

    // Перехоплення кліків по всім посиланням з атрибутом data-link
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.getAttribute('href'));
        }
    });
};