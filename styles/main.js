document.addEventListener('DOMContentLoaded', function() {
    // Автоматическое определение размера экрана и добавление классов для адаптивности
    function updateScreenSize() {
        const width = window.innerWidth;
        const body = document.body;
        
        // Удаляем старые классы размеров
        body.classList.remove('mobile', 'tablet', 'desktop');
        
        // Добавляем класс в зависимости от размера экрана
        if (width <= 768) {
            body.classList.add('mobile');
        } else if (width <= 1024) {
            body.classList.add('tablet');
        } else {
            body.classList.add('desktop');
        }
    }
    
    // Вызываем функцию при загрузке и при изменении размера окна
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    // Мобильное меню
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Анимация гамбургера
        const bars = menuToggle.querySelectorAll('.bar');
        if (mainNav.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            const bars = menuToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            
            // Закрыть меню на мобильных устройствах после клика
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    mainNav.classList.remove('active');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }, 300);
            }
        });
    });

    // Проверка пароля
    const passwordInput = document.getElementById('password');
    const strengthLevel = document.getElementById('strength-level');
    const strengthText = document.getElementById('strength-text');
    
    // Элементы требований
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            strengthLevel.style.width = '0%';
            strengthLevel.style.backgroundColor = '#ef4444';
            strengthText.textContent = 'Введите пароль для проверки';
            
            // Сбрасываем требования
            reqLength.className = 'requirement pending';
            reqUppercase.className = 'requirement pending';
            reqLowercase.className = 'requirement pending';
            reqNumber.className = 'requirement pending';
            reqSpecial.className = 'requirement pending';
            
            return;
        }
        
        // Проверяем требования
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        
        // Обновляем требования
        reqLength.className = hasLength ? 'requirement met' : 'requirement pending';
        reqUppercase.className = hasUppercase ? 'requirement met' : 'requirement pending';
        reqLowercase.className = hasLowercase ? 'requirement met' : 'requirement pending';
        reqNumber.className = hasNumber ? 'requirement met' : 'requirement pending';
        reqSpecial.className = hasSpecial ? 'requirement met' : 'requirement pending';
        
        // Продвинутая проверка надежности пароля
        let strength = 0;
        
        // Основные критерии
        if (hasLength) strength += 20;
        if (hasUppercase) strength += 20;
        if (hasLowercase) strength += 20;
        if (hasNumber) strength += 20;
        if (hasSpecial) strength += 20;
        
        // Убедимся, что оценка в пределах 0-100
        strength = Math.max(0, Math.min(100, strength));
        
        // Устанавливаем уровень надежности
        strengthLevel.style.width = strength + '%';
        
        // Определение цвета и текста в зависимости от силы
        if (strength < 40) {
            strengthLevel.style.backgroundColor = '#ef4444'; // Красный
            strengthText.textContent = 'Слабый пароль';
            strengthText.style.color = '#ef4444';
        } else if (strength < 80) {
            strengthLevel.style.backgroundColor = '#f59e0b'; // Оранжевый
            strengthText.textContent = 'Средний пароль';
            strengthText.style.color = '#f59e0b';
        } else {
            strengthLevel.style.backgroundColor = '#10b981'; // Зеленый
            strengthText.textContent = 'Надежный пароль';
            strengthText.style.color = '#10b981';
        }
    });

    // Обновление значения длины пароля
    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Генератор паролей
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const generatedPassword = document.getElementById('generated-password');
    
    generateBtn.addEventListener('click', generatePassword);
    
    function generatePassword() {
        const length = lengthSlider.value;
        const includeUppercase = document.getElementById('include-uppercase').checked;
        const includeLowercase = document.getElementById('include-lowercase').checked;
        const includeNumbers = document.getElementById('include-numbers').checked;
        const includeSymbols = document.getElementById('include-symbols').checked;
        
        if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
            generatedPassword.textContent = 'Выберите хотя бы один тип символов';
            return;
        }
        
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let charSet = '';
        if (includeUppercase) charSet += uppercaseChars;
        if (includeLowercase) charSet += lowercaseChars;
        if (includeNumbers) charSet += numberChars;
        if (includeSymbols) charSet += symbolChars;
        
        if (charSet === '') {
            generatedPassword.textContent = 'Выберите хотя бы один тип символов';
            return;
        }
        
        let password = '';
        
        // Убедимся, что в пароле есть хотя бы по одному символу каждого типа, если он выбран
        if (includeUppercase) {
            password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        }
        if (includeLowercase) {
            password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        }
        if (includeNumbers) {
            password += numberChars[Math.floor(Math.random() * numberChars.length)];
        }
        if (includeSymbols) {
            password += symbolChars[Math.floor(Math.random() * symbolChars.length)];
        }
        
        // Заполним оставшиеся позиции случайными символами
        for (let i = password.length; i < length; i++) {
            password += charSet[Math.floor(Math.random() * charSet.length)];
        }
        
        // Перемешаем пароль
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        // Обрежем до нужной длины (если нужно)
        password = password.substring(0, length);
        
        generatedPassword.textContent = password;
    }

    // Копирование пароля
    copyBtn.addEventListener('click', copyPassword);
    
    function copyPassword() {
        const password = generatedPassword.textContent;
        if (password === 'Нажмите "Сгенерировать"' || password === 'Выберите хотя бы один тип символов') {
            alert('Сначала сгенерируйте пароль!');
            return;
        }
        
        navigator.clipboard.writeText(password).then(() => {
            alert('Пароль скопирован в буфер обмена!');
        }).catch(err => {
            console.error('Ошибка при копировании: ', err);
            // Альтернативный метод копирования
            const textArea = document.createElement('textarea');
            textArea.value = password;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Пароль скопирован в буфер обмена!');
        });
    }

    // Анимация счетчика
    function animateCounter(element, finalValue, duration) {
        let startValue = 0;
        const increment = finalValue / (duration / 16); // 60fps
        const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= finalValue) {
                element.textContent = finalValue.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(startValue).toLocaleString();
            }
        }, 16);
    }

    // Анимация при загрузке страницы
    setTimeout(() => {
        animateCounter(document.getElementById('attacks-counter'), 2500, 3000);
    }, 1000);

    // Анимация карточек при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Начинать анимацию немного раньше
    });
    
    document.querySelectorAll('.card, .stat-item, .tool-card, .section-title, .section-subtitle').forEach(el => {
        observer.observe(el);
    });

    // Функция для плавного скролла к якорям
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Адаптивный отступ в зависимости от размера экрана
                const offset = window.innerWidth <= 768 ? 70 : 80;
                
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Добавляем функциональность кнопок "Подробнее"
    const detailButtons = document.querySelectorAll('.card-link');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.card');
            const content = card.querySelector('p');
            
            // Переключаем содержимое в зависимости от типа карточки
            const cardTitle = card.querySelector('h3').textContent;
            let detailedText = '';
            let isExpanded = this.innerHTML.includes('Свернуть');
            
            if (cardTitle.includes('Надежные пароли')) {
                if (!isExpanded) {
                    detailedText = 'Создавайте пароли длиной не менее 12 символов, включающие заглавные и строчные буквы, цифры и специальные символы. Избегайте использования личной информации, такой как имена, даты рождения или адреса. Используйте уникальные пароли для каждого аккаунта. Рекомендуется использовать фразы-пароли (passphrases) из 4-5 случайных слов, которые легко запомнить, но трудно угадать. Не храните пароли в текстовых файлах или записывайте их на бумажных носителях. Регулярно обновляйте пароли для важных аккаунтов, особенно если вы подозреваете утечку данных.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Используйте сложные пароли, состоящие из букв, цифр и специальных символов. Не используйте одни и те же пароли для разных аккаунтов.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            } else if (cardTitle.includes('Двухфакторная аутентификация')) {
                if (!isExpanded) {
                    detailedText = 'Двухфакторная аутентификация (2FA) добавляет дополнительный уровень безопасности, требуя второй фактор подтверждения личности. Это может быть SMS-код, приложение-аутентификатор или аппаратный ключ. Даже если ваш пароль скомпрометирован, злоумышленнику будет трудно получить доступ к вашему аккаунту. Используйте приложения-аутентификаторы (Google Authenticator, Authy, Microsoft Authenticator) вместо SMS, если это возможно, поскольку SMS подвержены атакам. Для максимальной безопасности используйте аппаратные токены (YubiKey) для критических аккаунтов.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Всегда включайте двухфакторную аутентификацию. Это добавляет дополнительный уровень защиты к вашим аккаунтам.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            } else if (cardTitle.includes('Фишинг')) {
                if (!isExpanded) {
                    detailedText = 'Фишинговые атаки пытаются обмануть вас, заставляя раскрыть личную информацию. Будьте осторожны с подозрительными электронными письмами, сообщениями и веб-сайтами. Проверяйте адреса веб-сайтов и не переходите по подозрительным ссылкам. Никогда не указывайте логины и пароли в ответ на электронные письма. Обратите внимание на следующие признаки фишинга: срочность или давление, орфографические ошибки, неправильное имя отправителя, подозрительные адреса электронной почты или URL-адреса. Проверяйте URL-адреса перед переходом по ссылке, особенно если они ведут на страницы входа в систему.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Будьте осторожны с подозрительными электронными письмами и ссылками. Не переходите по ссылкам в письмах от неизвестных отправителей.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            } else if (cardTitle.includes('Обновления программного обеспечения')) {
                if (!isExpanded) {
                    detailedText = 'Уязвимости в устаревшем ПО часто используются злоумышленниками. Регулярно обновляйте операционную систему, браузеры, приложения и драйверы. Включите автоматические обновления, где это возможно. Проверяйте обновления не реже одного раза в неделю. Обновления часто содержат исправления безопасности, которые защищают от новых угроз. Злоумышленники активно используют известные уязвимости в устаревшем программном обеспечении. Для корпоративных пользователей: создайте политику обновлений и регулярно проверяйте, что все системы актуальны.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Регулярно обновляйте операционную систему, браузеры и приложения. Уязвимости в устаревшем ПО часто используются злоумышленниками.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            } else if (cardTitle.includes('Шифрование данных')) {
                if (!isExpanded) {
                    detailedText = 'Шифрование преобразует данные в нечитаемый формат без специального ключа. Это обеспечивает дополнительный уровень защиты конфиденциальных данных. Используйте встроенные средства шифрования в Windows (BitLocker), macOS (FileVault) или Linux (LUKS). Для мобильных устройств: включите шифрование в настройках безопасности. При работе с особенно чувствительными данными используйте сторонние решения для шифрования файлов. Помните, что шифрование не заменяет резервное копирование - даже зашифрованные данные могут быть потеряны из-за аппаратных сбоев.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Используйте шифрование для защиты конфиденциальных данных. Это особенно важно для ноутбуков, телефонов и внешних накопителей.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            } else if (cardTitle.includes('Облачные резервные копии')) {
                if (!isExpanded) {
                    detailedText = 'Регулярное создание резервных копий защищает от ransomware, аппаратных сбоев, краж и других потерь данных. Используйте правило 3-2-1: 3 копии данных, на 2 разных типах носителей, 1 копия в облаке. Облачные сервисы обеспечивают защиту от физических угроз (кража, пожар, наводнение). Регулярно тестируйте восстановление данных из резервных копий. Для максимальной безопасности: используйте шифрование при передаче и хранении данных в облаке. Для домашних пользователей: настройте автоматическое резервное копирование важных файлов.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Регулярно создавайте резервные копии важных данных в облаке и на физических носителях. Это защитит вас от ransomware и аппаратных сбоев.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            } else if (cardTitle.includes('Безопасность Wi-Fi')) {
                if (!isExpanded) {
                    detailedText = 'Используйте WPA3 или WPA2 (в порядке убывания предпочтений) для шифрования Wi-Fi сетей. Избегайте открытых публичных Wi-Fi сетей для чувствительных операций. Если необходимо использовать публичный Wi-Fi, применяйте VPN для дополнительной защиты. Регулярно меняйте пароли от роутеров и используйте сильные пароли. Отключайте автоматическое подключение к открытым сетям. Используйте отдельную гостевую сеть для устройств гостей. Настройте MAC-фильтрацию, если это возможно, для дополнительной безопасности.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Используйте защищенные Wi-Fi сети с сильным паролем. Избегайте открытых публичных сетей, особенно для банковских операций и входа в важные аккаунты.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            } else if (cardTitle.includes('Антивирусное программное обеспечение')) {
                if (!isExpanded) {
                    detailedText = 'Антивирусное программное обеспечение обнаруживает и удаляет вредоносное ПО, включая вирусы, шпионские программы и трояны. Выбирайте известные и надежные антивирусы с хорошей репутацией. Обновляйте антивирусные базы регулярно - ежедневно или даже в реальном времени. Проводите полное сканирование системы не реже одного раза в месяц. Не отключайте реального времени сканирование. Используйте программное обеспечение для обнаружения шпионских программ (например, Malwarebytes) в дополнение к антивирусу. Будьте осторожны с бесплатными антивирусами - они могут иметь ограниченные функции по сравнению с платными версиями.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Установите и регулярно обновляйте надежное антивирусное программное обеспечение. Оно помогает обнаруживать и предотвращать вредоносное ПО.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            } else if (cardTitle.includes('Обучение и осведомленность')) {
                if (!isExpanded) {
                    detailedText = 'Человеческий фактор остается одной из основных угроз безопасности. Регулярно обучайтесь последним угрозам и методам кибератак. Участвуйте в тренингах по кибербезопасности, проходите онлайн-курсы, читайте специализированные ресурсы. Будьте внимательны при открытии писем, особенно с вложениями или ссылками. Проверяйте подлинность запросов на предоставление информации. Рассказывайте членам семьи и коллегам о киберугрозах. Используйте симуляции фишинга для самопроверки. Поддерживайте актуальные знания о социальной инженерии и других методах манипуляции.';
                    this.innerHTML = 'Свернуть <i class="fas fa-arrow-up"></i>';
                } else {
                    detailedText = 'Регулярно обучайтесь последним угрозам и методам кибератак. Человеческий фактор остается одним из главных путей проникновения злоумышленников.';
                    this.innerHTML = 'Подробнее <i class="fas fa-arrow-right"></i>';
                }
            }
            
            content.textContent = detailedText;
        });
    });
    
    // Добавляем автоматическое закрытие мобильного меню при изменении ориентации
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (window.innerWidth > 768) {
                mainNav.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        }, 300);
    });
    
    // Оптимизация для сенсорных устройств
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        // Добавляем класс для сенсорных устройств
        document.body.classList.add('touch-device');
        
        // Улучшаем взаимодействие с сенсорными элементами
        const touchElements = document.querySelectorAll('button, .card-link, a');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
            
            element.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            });
        });
    }
});