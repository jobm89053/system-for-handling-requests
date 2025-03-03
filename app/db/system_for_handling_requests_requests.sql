CREATE TABLE Requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    status ENUM('Новое', 'В работе', 'Завершено', 'Отменено') DEFAULT 'Новое',
    solution TEXT,
    cancellationReason TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Requests (topic, text, status, solution, cancellationReason, createdAt, updatedAt)
VALUES
('Проблема с подключением', 'Не могу подключиться к базе данных', 'Новое', NULL, NULL, NOW(), NOW()),
('Ошибка в интерфейсе', 'Кнопка "Отправить" не работает', 'Новое', 'Исправлено в версии 2.3', NULL, NOW(), NOW()),
('Медленная работа системы', 'Система тормозит при загрузке данных', 'Новое', 'Оптимизированы запросы к базе данных', NULL, NOW(), NOW()),
('Неверные данные в отчете', 'В отчете отображаются некорректные цифры', 'Новое', NULL, NULL, NOW(), NOW()),
('Проблема с авторизацией', 'Не могу войти в систему', 'Отменено', NULL, 'Пользователь не зарегистрирован', NOW(), NOW()),
('Ошибка при печати', 'Документ печатается с искажениями', 'Новое', NULL, NULL, NOW(), NOW()),
('Недоступен сервис', 'Сервис не отвечает уже 2 часа', 'Новое', 'Перезапущен сервер', NULL, NOW(), NOW()),
('Проблема с обновлением', 'Обновление зависло на 50%', 'Новое', NULL, NULL, NOW(), NOW()),
('Ошибка в расчетах', 'Неправильно рассчитывается налог', 'Новое', NULL, NULL, NOW(), NOW()),
('Проблема с почтой', 'Письма не отправляются', 'Новое', 'Исправлена конфигурация SMTP', NULL, NOW(), NOW());