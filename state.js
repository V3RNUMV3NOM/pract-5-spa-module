// state.js
export const state = {
    currentPage: window.location.pathname,
    requests: [] // Масив для збереження відправлених заявок з форми
};

// Масив функцій, які потрібно викликати при зміні стану
const listeners = [];

// Функція для оновлення стану
export function setState(newState) {
    Object.assign(state, newState);
    // Сповіщаємо всіх підписників (наш UI) про зміни
    listeners.forEach(listener => listener(state));
}

// Функція підписки на зміни
export function subscribe(listener) {
    listeners.push(listener);
}