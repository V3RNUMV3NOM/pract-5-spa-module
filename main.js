// main.js
import { state, subscribe, setState } from './state.js';
import { initRouter, navigateTo } from './router.js';

// --- Віртуальні сторінки (Компоненти) ---

const HomeView = () => `
    <section class="hero">
        <div class="container">
            <h1>Boost Your Productivity</h1>
            <p>Manage your tasks effortlessly, keep track of your progress, and achieve your goals with our intuitive task manager.</p>
            <a href="/pract-5-spa-module/contact" class="btn-primary" data-link>Try for Free</a>
        </div>
    </section>

    <section id="features" class="features-section bg-light">
        <div class="container">
            <h2>Features Included</h2>
            
            <div class="cards-grid">
                <div class="card feature-card">
                    <div class="feature-image">
                        <span class="badge">Essential</span>
                        <span class="feature-placeholder">Task Management</span>
                    </div>
                    <div class="feature-info">
                        <p class="feature-subtitle">Task Organizer</p>
                        <h3>Organize tasks with ease</h3>
                    </div>
                </div>
                <div class="card feature-card">
                    <div class="feature-image">
                        <span class="badge">Pro</span>
                        <span class="feature-placeholder">Calendar Integration</span>
                    </div>
                    <div class="feature-info">
                        <p class="feature-subtitle">Calendar Sync</p>
                        <h3>Sync with Google Calendar</h3>
                    </div>
                </div>
                <div class="card feature-card">
                    <div class="feature-image">
                        <span class="badge">Premium</span>
                        <span class="feature-placeholder">Custom Reminders</span>
                    </div>
                    <div class="feature-info">
                        <p class="feature-subtitle">Reminders and Alerts</p>
                        <h3>Never miss a deadline</h3>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

const AboutView = () => `
    <section class="features-section">
        <div class="container">
            <h2>Why Choose Our App?</h2>
            <p style="text-align: center; margin-bottom: 40px; color: #666;">Discover the features that set us apart.</p>
            <div class="cards-grid">
                <div class="card horizontal-card">
                    <div class="card-icon"></div>
                    <div class="card-text">
                        <h3>Simple Interface</h3>
                        <p>Our clean and intuitive design makes it easy to p...</p>
                    </div>
                </div>
                <div class="card horizontal-card">
                    <div class="card-icon"></div>
                    <div class="card-text">
                        <h3>Real-time Collaboration</h3>
                        <p>Work together with others in real-time for increased...</p>
                    </div>
                </div>
                <div class="card horizontal-card">
                    <div class="card-icon"></div>
                    <div class="card-text">
                        <h3>Progress Tracking</h3>
                        <p>Keep an eye on your progress and stay motiva...</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

const ContactView = (requests) => `
    <section class="features-section">
        <div class="container">
            <h2>Contact Us</h2>
            <form id="contact-form" class="contact-form" novalidate>
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" id="name" class="form-control" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="email" class="form-control" placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label>Message:</label>
                    <textarea id="message" class="form-control" rows="4" placeholder="Your message..."></textarea>
                </div>
                <div id="form-message" class="message-box" style="display: none;"></div>
                <button type="submit" class="btn-primary">Submit</button>
            </form>

            <h3 style="margin-top: 40px;">Recent Requests:</h3>
            <div class="cards-grid">
                ${requests.map(req => `
                    <div class="card">
                        <div class="card-icon" style="background-color: #4CAF50;"></div>
                        <h3>${req.name}</h3>
                        <p style="font-size: 0.9em; color: #888;">${req.email}</p>
                        <p>${req.message}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
`;

// --- Логіка відображення ---

const routes = {
    '/pract-5-spa-module/': HomeView,
    '/pract-5-spa-module/about': AboutView,
    '/pract-5-spa-module/contact': ContactView
};

const render = () => {
    const appContainer = document.getElementById('app');
    // Якщо маршрут не знайдено, малюємо Home
    const view = routes[state.currentPage] || routes['/pract-5-spa-module/'];
    
    // Рендеримо HTML, передаючи дані стану у компонент
    appContainer.innerHTML = view(state.requests);

    // Ініціалізуємо логіку після рендеру специфічної сторінки
    if (state.currentPage === '/contact') {
        initContactForm();
    }
};

// --- Логіка Форми ---

const initContactForm = () => {
    const form = document.getElementById('contact-form');
    const msgBox = document.getElementById('form-message');
    
    // Отримуємо самі поля вводу
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Зняття стану помилки (червоної рамки) під час введення тексту
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
            msgBox.style.display = 'none';
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Очищуємо попередні стани помилок перед новою перевіркою
        nameInput.classList.remove('input-error');
        emailInput.classList.remove('input-error');
        messageInput.classList.remove('input-error');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // 1. Перевірка на порожні поля
        if (!name || !email || !message) {
            msgBox.textContent = 'Please fill in all fields.';
            msgBox.className = 'message-box error';
            msgBox.style.display = 'block';
            
            // Підсвічуємо конкретні порожні поля
            if (!name) nameInput.classList.add('input-error');
            if (!email) emailInput.classList.add('input-error');
            if (!message) messageInput.classList.add('input-error');
            return;
        }

        // 2. Перевірка формату email за допомогою регулярного виразу
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            msgBox.textContent = 'Please enter a valid email address.';
            msgBox.className = 'message-box error';
            msgBox.style.display = 'block';
            
            // Підсвічуємо тільки поле email
            emailInput.classList.add('input-error');
            return;
        }

        // Ховаємо повідомлення про помилку, якщо все добре
        msgBox.style.display = 'none';

        // Оновлення стану (One-way data flow)
        const newRequests = [...state.requests, { name, email, message }];
        setState({ requests: newRequests });
    });
};

// --- Ініціалізація Застосунку ---
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    subscribe(render); // UI підписується на зміни стану
    render(); // Первинне відмальовування
});