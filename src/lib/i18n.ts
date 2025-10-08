export type Language = 'ru' | 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar';

export const languages: Record<Language, { name: string; flag: string }> = {
  ru: { name: 'Русский', flag: '🇷🇺' },
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  zh: { name: '中文', flag: '🇨🇳' },
  ar: { name: 'العربية', flag: '🇸🇦' }
};

export const translations = {
  ru: {
    hero: {
      badge: 'Интеллектуальный помощник нового поколения',
      title: 'Богдан',
      subtitle: 'Ваш личный помощник',
      description: 'Создан с любовью сотрудниками аэропорта Пулково для помощи путешественникам и всем, кто ищет умного собеседника. Объединяет опыт работы с людьми и современные технологии.',
      codeGen: 'Генерация кода',
      docAnalysis: 'Анализ документов',
      translations: 'Переводы',
      ideas: 'Креативные идеи',
      search: 'Поиск информации',
      startChat: 'Начать общение',
      fast: 'Молниеносный',
      fastDesc: 'Мгновенные ответы',
      smart: 'Умный',
      smartDesc: 'Современный ИИ',
      secure: 'Безопасный',
      secureDesc: 'Защита данных',
      limitless: 'Безграничный',
      limitlessDesc: 'Любые задачи'
    },
    features: {
      title: 'Возможности ИИ',
      subtitle: 'Что умеют наши помощники',
      
      reasoning: 'Глубокий анализ',
      reasoningDesc: 'Решение сложных задач с пошаговым рассуждением. Математика, логика, программирование, научные вычисления.',
      
      coding: 'Программирование',
      codingDesc: 'Написание кода на 50+ языках. Отладка, рефакторинг, code review, архитектурные решения.',
      
      multimodal: 'Мультимодальность',
      multimodalDesc: 'Анализ изображений, PDF, документов. Описание графиков, таблиц, диаграмм, фотографий.',
      
      longContext: 'Большой контекст',
      longContextDesc: 'Обработка до 200,000 токенов. Анализ книг, документации, больших кодовых баз.',
      
      translation: 'Переводы',
      translationDesc: '100+ языков с сохранением стиля и контекста. Технические, художественные, деловые тексты.',
      
      creative: 'Креативность',
      creativeDesc: 'Генерация идей, сценариев, статей. Копирайтинг, сторителлинг, brainstorming.',
      
      data: 'Анализ данных',
      dataDesc: 'Работа с таблицами, статистика, визуализация. JSON, CSV, XML парсинг и обработка.',
      
      research: 'Исследования',
      researchDesc: 'Поиск информации, составление отчётов. Научные статьи, маркетинговые исследования.',
      
      chat: 'Общение',
      chatDesc: 'Естественный диалог на любые темы. Обучение, консультации, дружеская беседа.'
    },
    navigation: {
      home: 'Главная',
      chat: 'Чат',
      features: 'Возможности',
      tools: 'ИИ Инструменты',
      admin: 'Админ',
      profile: 'Профиль',
      login: 'Войти'
    },
    aboutUs: {
      title: 'О нас',
      description: 'Мы - команда энтузиастов, создающая интеллектуальные решения для повседневных задач',
      mission: 'Наша миссия',
      missionText: 'Сделать искусственный интеллект доступным каждому',
      vision: 'Наше видение',
      visionText: 'Мир, где технологии помогают людям достигать большего'
    },
    useCases: {
      title: 'Примеры использования',
      startNow: 'Начать сейчас',
      
      students: 'Для студентов',
      studentsDesc: 'Помощь в учёбе, решение задач, подготовка к экзаменам',
      
      developers: 'Для разработчиков',
      developersDesc: 'Code review, отладка, генерация кода, архитектура',
      
      business: 'Для бизнеса',
      businessDesc: 'Автоматизация, анализ данных, отчёты, презентации',
      
      creative: 'Для креативщиков',
      creativeDesc: 'Контент, копирайтинг, идеи для проектов, сценарии'
    },
    auth: {
      title: 'Добро пожаловать',
      login: 'Вход',
      register: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      name: 'Имя',
      loginButton: 'Войти',
      registerButton: 'Зарегистрироваться',
      success: 'Успешно!',
      loginSuccess: 'Вы успешно вошли в систему',
      registerSuccess: 'Регистрация прошла успешно',
      passwordMismatch: 'Пароли не совпадают',
      fillFields: 'Заполните все поля'
    },
    profile: {
      title: 'Личный кабинет',
      totalRequests: 'Всего запросов',
      timeInSystem: 'Время в системе',
      activeSessions: 'Активных сессий',
      rating: 'Рейтинг',
      
      tabs: {
        profile: 'Профиль',
        history: 'История',
        settings: 'Настройки'
      },
      
      editProfile: 'Редактировать профиль',
      name: 'Имя',
      email: 'Email',
      changePhoto: 'Сменить фото',
      saveChanges: 'Сохранить изменения',
      logout: 'Выйти из системы',
      
      recentRequests: 'Последние запросы',
      viewAll: 'Посмотреть все',
      
      preferences: 'Настройки',
      notifications: 'Уведомления',
      notificationsDesc: 'Получать уведомления о новых ответах',
      darkMode: 'Тёмная тема',
      darkModeDesc: 'Использовать тёмную тему интерфейса',
      autoSave: 'Автосохранение',
      autoSaveDesc: 'Автоматически сохранять историю чатов',
      
      dangerZone: 'Опасная зона',
      deleteAccount: 'Удалить аккаунт',
      deleteWarning: 'Это действие необратимо',
      
      changesSaved: 'Изменения сохранены!',
      profileUpdated: 'Профиль обновлён'
    },
    chat: {
      title: 'Чат с Богданом',
      startConversation: 'Начните беседу',
      selectModel: 'Задайте любой вопрос. Богдан готов помочь!',
      inputPlaceholder: 'Введите сообщение...',
      send: 'Отправить',
      export: 'Экспорт',
      settings: 'Настройки',
      clear: 'Очистить',
      menu: 'Меню',
      translator: 'Переводчик',
      languageSettings: 'Язык интерфейса',
      imageAnalysis: 'Анализ изображений',
      voiceInput: 'Голосовой ввод',
      codeAnalysis: 'Анализ кода',
      translateFrom: 'Перевести с',
      translateTo: 'На',
      enterText: 'Введите текст для перевода',
      translate: 'Перевести',
      interfaceLanguage: 'Язык интерфейса',
      primaryModel: 'Основной помощник',
      backupModel: 'Резервный помощник',
      you: 'Вы',
      chatExported: 'Чат экспортирован!',
      copied: 'Скопировано в буфер обмена!',
      responseReceived: 'Ответ получен!'
    }
  },
  en: {
    hero: {
      badge: 'Next Generation Intelligent Assistant',
      title: 'Bogdan',
      subtitle: 'Your Personal Assistant',
      description: 'Created with love by Pulkovo Airport employees to help travelers and anyone seeking an intelligent companion. Combines human experience with modern technology.',
      codeGen: 'Code Generation',
      docAnalysis: 'Document Analysis',
      translations: 'Translations',
      ideas: 'Creative Ideas',
      search: 'Information Search',
      startChat: 'Start Conversation',
      fast: 'Lightning Fast',
      fastDesc: 'Instant Responses',
      smart: 'Intelligent',
      smartDesc: 'Modern AI',
      secure: 'Secure',
      secureDesc: 'Data Protection',
      limitless: 'Limitless',
      limitlessDesc: 'Any Tasks'
    },
    features: {
      title: 'AI Capabilities',
      subtitle: 'What Our Assistants Can Do',
      
      reasoning: 'Deep Analysis',
      reasoningDesc: 'Solving complex problems with step-by-step reasoning. Math, logic, programming, scientific calculations.',
      
      coding: 'Programming',
      codingDesc: 'Writing code in 50+ languages. Debugging, refactoring, code review, architectural solutions.',
      
      multimodal: 'Multimodal',
      multimodalDesc: 'Image, PDF, document analysis. Describing charts, tables, diagrams, photos.',
      
      longContext: 'Large Context',
      longContextDesc: 'Processing up to 200,000 tokens. Analyzing books, documentation, large codebases.',
      
      translation: 'Translations',
      translationDesc: '100+ languages preserving style and context. Technical, literary, business texts.',
      
      creative: 'Creativity',
      creativeDesc: 'Generating ideas, scripts, articles. Copywriting, storytelling, brainstorming.',
      
      data: 'Data Analysis',
      dataDesc: 'Working with tables, statistics, visualization. JSON, CSV, XML parsing and processing.',
      
      research: 'Research',
      researchDesc: 'Information search, report compilation. Scientific papers, market research.',
      
      chat: 'Communication',
      chatDesc: 'Natural dialogue on any topics. Education, consulting, friendly conversation.'
    },
    navigation: {
      home: 'Home',
      chat: 'Chat',
      features: 'Features',
      tools: 'AI Tools',
      admin: 'Admin',
      profile: 'Profile',
      login: 'Login'
    },
    aboutUs: {
      title: 'About Us',
      description: 'We are a team of enthusiasts creating intelligent solutions for everyday tasks',
      mission: 'Our Mission',
      missionText: 'Make artificial intelligence accessible to everyone',
      vision: 'Our Vision',
      visionText: 'A world where technology helps people achieve more'
    },
    useCases: {
      title: 'Use Cases',
      startNow: 'Start Now',
      
      students: 'For Students',
      studentsDesc: 'Study help, problem solving, exam preparation',
      
      developers: 'For Developers',
      developersDesc: 'Code review, debugging, code generation, architecture',
      
      business: 'For Business',
      businessDesc: 'Automation, data analysis, reports, presentations',
      
      creative: 'For Creatives',
      creativeDesc: 'Content, copywriting, project ideas, scripts'
    },
    auth: {
      title: 'Welcome',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Name',
      loginButton: 'Login',
      registerButton: 'Register',
      success: 'Success!',
      loginSuccess: 'Successfully logged in',
      registerSuccess: 'Registration successful',
      passwordMismatch: 'Passwords do not match',
      fillFields: 'Please fill all fields'
    },
    profile: {
      title: 'Profile',
      totalRequests: 'Total Requests',
      timeInSystem: 'Time in System',
      activeSessions: 'Active Sessions',
      rating: 'Rating',
      
      tabs: {
        profile: 'Profile',
        history: 'History',
        settings: 'Settings'
      },
      
      editProfile: 'Edit Profile',
      name: 'Name',
      email: 'Email',
      changePhoto: 'Change Photo',
      saveChanges: 'Save Changes',
      logout: 'Logout',
      
      recentRequests: 'Recent Requests',
      viewAll: 'View All',
      
      preferences: 'Preferences',
      notifications: 'Notifications',
      notificationsDesc: 'Receive notifications about new responses',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Use dark interface theme',
      autoSave: 'Auto-save',
      autoSaveDesc: 'Automatically save chat history',
      
      dangerZone: 'Danger Zone',
      deleteAccount: 'Delete Account',
      deleteWarning: 'This action is irreversible',
      
      changesSaved: 'Changes saved!',
      profileUpdated: 'Profile updated'
    },
    chat: {
      title: 'Chat with Bogdan',
      startConversation: 'Start a conversation',
      selectModel: 'Ask any question. Bogdan is ready to help!',
      inputPlaceholder: 'Type a message...',
      send: 'Send',
      export: 'Export',
      settings: 'Settings',
      clear: 'Clear',
      menu: 'Menu',
      translator: 'Translator',
      languageSettings: 'Interface Language',
      imageAnalysis: 'Image Analysis',
      voiceInput: 'Voice Input',
      codeAnalysis: 'Code Analysis',
      translateFrom: 'Translate from',
      translateTo: 'To',
      enterText: 'Enter text to translate',
      translate: 'Translate',
      interfaceLanguage: 'Interface Language',
      primaryModel: 'Primary Assistant',
      backupModel: 'Backup Assistant',
      you: 'You',
      chatExported: 'Chat exported!',
      copied: 'Copied to clipboard!',
      responseReceived: 'Response received!'
    }
  },
  es: {
    hero: {
      badge: 'Asistente Inteligente de Nueva Generación',
      title: 'Bogdan',
      subtitle: 'Tu Asistente Personal',
      description: 'Creado con amor por empleados del Aeropuerto Pulkovo para ayudar a viajeros y a cualquiera que busque un compañero inteligente.',
      codeGen: 'Generación de Código',
      docAnalysis: 'Análisis de Documentos',
      translations: 'Traducciones',
      ideas: 'Ideas Creativas',
      search: 'Búsqueda de Información',
      startChat: 'Iniciar Conversación',
      fast: 'Ultrarrápido',
      fastDesc: 'Respuestas Instantáneas',
      smart: 'Inteligente',
      smartDesc: 'IA Moderna',
      secure: 'Seguro',
      secureDesc: 'Protección de Datos',
      limitless: 'Sin Límites',
      limitlessDesc: 'Cualquier Tarea'
    },
    features: {
      title: 'Capacidades de IA',
      subtitle: 'Lo Que Pueden Hacer Nuestros Asistentes',
      
      reasoning: 'Análisis Profundo',
      reasoningDesc: 'Resolución de problemas complejos con razonamiento paso a paso. Matemáticas, lógica, programación.',
      
      coding: 'Programación',
      codingDesc: 'Escritura de código en más de 50 lenguajes. Depuración, refactorización, revisión de código.',
      
      multimodal: 'Multimodal',
      multimodalDesc: 'Análisis de imágenes, PDF, documentos. Descripción de gráficos, tablas, diagramas.',
      
      longContext: 'Contexto Amplio',
      longContextDesc: 'Procesamiento de hasta 200,000 tokens. Análisis de libros, documentación, bases de código grandes.',
      
      translation: 'Traducciones',
      translationDesc: 'Más de 100 idiomas preservando estilo y contexto. Textos técnicos, literarios, de negocios.',
      
      creative: 'Creatividad',
      creativeDesc: 'Generación de ideas, guiones, artículos. Copywriting, storytelling, brainstorming.',
      
      data: 'Análisis de Datos',
      dataDesc: 'Trabajo con tablas, estadísticas, visualización. Análisis JSON, CSV, XML.',
      
      research: 'Investigación',
      researchDesc: 'Búsqueda de información, compilación de informes. Artículos científicos, investigación de mercado.',
      
      chat: 'Comunicación',
      chatDesc: 'Diálogo natural sobre cualquier tema. Educación, consultoría, conversación amistosa.'
    },
    navigation: {
      home: 'Inicio',
      chat: 'Chat',
      features: 'Características',
      tools: 'Herramientas IA',
      admin: 'Admin',
      profile: 'Perfil',
      login: 'Iniciar Sesión'
    },
    aboutUs: {
      title: 'Sobre Nosotros',
      description: 'Somos un equipo de entusiastas creando soluciones inteligentes para tareas cotidianas',
      mission: 'Nuestra Misión',
      missionText: 'Hacer la inteligencia artificial accesible para todos',
      vision: 'Nuestra Visión',
      visionText: 'Un mundo donde la tecnología ayuda a las personas a lograr más'
    },
    useCases: {
      title: 'Casos de Uso',
      startNow: 'Comenzar Ahora',
      
      students: 'Para Estudiantes',
      studentsDesc: 'Ayuda con estudios, resolución de problemas, preparación de exámenes',
      
      developers: 'Para Desarrolladores',
      developersDesc: 'Revisión de código, depuración, generación de código, arquitectura',
      
      business: 'Para Negocios',
      businessDesc: 'Automatización, análisis de datos, informes, presentaciones',
      
      creative: 'Para Creativos',
      creativeDesc: 'Contenido, copywriting, ideas de proyectos, guiones'
    },
    auth: {
      title: 'Bienvenido',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      name: 'Nombre',
      loginButton: 'Iniciar Sesión',
      registerButton: 'Registrarse',
      success: '¡Éxito!',
      loginSuccess: 'Sesión iniciada exitosamente',
      registerSuccess: 'Registro exitoso',
      passwordMismatch: 'Las contraseñas no coinciden',
      fillFields: 'Por favor complete todos los campos'
    },
    profile: {
      title: 'Perfil',
      totalRequests: 'Total de Solicitudes',
      timeInSystem: 'Tiempo en el Sistema',
      activeSessions: 'Sesiones Activas',
      rating: 'Calificación',
      
      tabs: {
        profile: 'Perfil',
        history: 'Historial',
        settings: 'Configuración'
      },
      
      editProfile: 'Editar Perfil',
      name: 'Nombre',
      email: 'Email',
      changePhoto: 'Cambiar Foto',
      saveChanges: 'Guardar Cambios',
      logout: 'Cerrar Sesión',
      
      recentRequests: 'Solicitudes Recientes',
      viewAll: 'Ver Todo',
      
      preferences: 'Preferencias',
      notifications: 'Notificaciones',
      notificationsDesc: 'Recibir notificaciones sobre nuevas respuestas',
      darkMode: 'Modo Oscuro',
      darkModeDesc: 'Usar tema oscuro de interfaz',
      autoSave: 'Guardado Automático',
      autoSaveDesc: 'Guardar automáticamente el historial de chat',
      
      dangerZone: 'Zona de Peligro',
      deleteAccount: 'Eliminar Cuenta',
      deleteWarning: 'Esta acción es irreversible',
      
      changesSaved: '¡Cambios guardados!',
      profileUpdated: 'Perfil actualizado'
    },
    chat: {
      title: 'Chat con Bogdan',
      startConversation: 'Iniciar conversación',
      selectModel: 'Haz cualquier pregunta. ¡Bogdan está listo para ayudar!',
      inputPlaceholder: 'Escribe un mensaje...',
      send: 'Enviar',
      export: 'Exportar',
      settings: 'Configuración',
      clear: 'Limpiar',
      menu: 'Menú',
      translator: 'Traductor',
      languageSettings: 'Idioma de interfaz',
      imageAnalysis: 'Análisis de imágenes',
      voiceInput: 'Entrada de voz',
      codeAnalysis: 'Análisis de código',
      translateFrom: 'Traducir de',
      translateTo: 'A',
      enterText: 'Ingrese texto para traducir',
      translate: 'Traducir',
      interfaceLanguage: 'Idioma de interfaz',
      primaryModel: 'Asistente principal',
      backupModel: 'Asistente de respaldo',
      you: 'Tú',
      chatExported: '¡Chat exportado!',
      copied: '¡Copiado al portapapeles!',
      responseReceived: '¡Respuesta recibida!'
    }
  },
  fr: {
    hero: {
      badge: 'Assistant Intelligent de Nouvelle Génération',
      title: 'Bogdan',
      subtitle: 'Votre Assistant Personnel',
      description: 'Créé avec amour par les employés de l\'aéroport Pulkovo pour aider les voyageurs et tous ceux qui cherchent un compagnon intelligent.',
      codeGen: 'Génération de Code',
      docAnalysis: 'Analyse de Documents',
      translations: 'Traductions',
      ideas: 'Idées Créatives',
      search: 'Recherche d\'Informations',
      startChat: 'Commencer la Conversation',
      fast: 'Ultra Rapide',
      fastDesc: 'Réponses Instantanées',
      smart: 'Intelligent',
      smartDesc: 'IA Moderne',
      secure: 'Sécurisé',
      secureDesc: 'Protection des Données',
      limitless: 'Sans Limites',
      limitlessDesc: 'Toutes Tâches'
    },
    features: {
      title: 'Capacités IA',
      subtitle: 'Ce Que Nos Assistants Peuvent Faire',
      
      reasoning: 'Analyse Profonde',
      reasoningDesc: 'Résolution de problèmes complexes avec raisonnement étape par étape. Mathématiques, logique, programmation.',
      
      coding: 'Programmation',
      codingDesc: 'Écriture de code dans plus de 50 langages. Débogage, refactorisation, révision de code.',
      
      multimodal: 'Multimodal',
      multimodalDesc: 'Analyse d\'images, PDF, documents. Description de graphiques, tableaux, diagrammes.',
      
      longContext: 'Grand Contexte',
      longContextDesc: 'Traitement jusqu\'à 200 000 tokens. Analyse de livres, documentation, grandes bases de code.',
      
      translation: 'Traductions',
      translationDesc: 'Plus de 100 langues en préservant le style et le contexte. Textes techniques, littéraires, commerciaux.',
      
      creative: 'Créativité',
      creativeDesc: 'Génération d\'idées, scénarios, articles. Rédaction, storytelling, brainstorming.',
      
      data: 'Analyse de Données',
      dataDesc: 'Travail avec tableaux, statistiques, visualisation. Analyse JSON, CSV, XML.',
      
      research: 'Recherche',
      researchDesc: 'Recherche d\'informations, compilation de rapports. Articles scientifiques, études de marché.',
      
      chat: 'Communication',
      chatDesc: 'Dialogue naturel sur tous les sujets. Éducation, consultation, conversation amicale.'
    },
    navigation: {
      home: 'Accueil',
      chat: 'Chat',
      features: 'Fonctionnalités',
      tools: 'Outils IA',
      admin: 'Admin',
      profile: 'Profil',
      login: 'Connexion'
    },
    aboutUs: {
      title: 'À Propos',
      description: 'Nous sommes une équipe d\'enthousiastes créant des solutions intelligentes pour les tâches quotidiennes',
      mission: 'Notre Mission',
      missionText: 'Rendre l\'intelligence artificielle accessible à tous',
      vision: 'Notre Vision',
      visionText: 'Un monde où la technologie aide les gens à accomplir plus'
    },
    useCases: {
      title: 'Cas d\'Utilisation',
      startNow: 'Commencer Maintenant',
      
      students: 'Pour Étudiants',
      studentsDesc: 'Aide aux études, résolution de problèmes, préparation aux examens',
      
      developers: 'Pour Développeurs',
      developersDesc: 'Révision de code, débogage, génération de code, architecture',
      
      business: 'Pour Entreprises',
      businessDesc: 'Automatisation, analyse de données, rapports, présentations',
      
      creative: 'Pour Créatifs',
      creativeDesc: 'Contenu, rédaction, idées de projets, scénarios'
    },
    auth: {
      title: 'Bienvenue',
      login: 'Connexion',
      register: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le Mot de passe',
      name: 'Nom',
      loginButton: 'Se connecter',
      registerButton: 'S\'inscrire',
      success: 'Succès!',
      loginSuccess: 'Connexion réussie',
      registerSuccess: 'Inscription réussie',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      fillFields: 'Veuillez remplir tous les champs'
    },
    profile: {
      title: 'Profil',
      totalRequests: 'Total des Demandes',
      timeInSystem: 'Temps dans le Système',
      activeSessions: 'Sessions Actives',
      rating: 'Évaluation',
      
      tabs: {
        profile: 'Profil',
        history: 'Historique',
        settings: 'Paramètres'
      },
      
      editProfile: 'Modifier le Profil',
      name: 'Nom',
      email: 'Email',
      changePhoto: 'Changer la Photo',
      saveChanges: 'Enregistrer les Modifications',
      logout: 'Déconnexion',
      
      recentRequests: 'Demandes Récentes',
      viewAll: 'Voir Tout',
      
      preferences: 'Préférences',
      notifications: 'Notifications',
      notificationsDesc: 'Recevoir des notifications sur les nouvelles réponses',
      darkMode: 'Mode Sombre',
      darkModeDesc: 'Utiliser le thème sombre de l\'interface',
      autoSave: 'Sauvegarde Automatique',
      autoSaveDesc: 'Sauvegarder automatiquement l\'historique des chats',
      
      dangerZone: 'Zone de Danger',
      deleteAccount: 'Supprimer le Compte',
      deleteWarning: 'Cette action est irréversible',
      
      changesSaved: 'Modifications enregistrées!',
      profileUpdated: 'Profil mis à jour'
    },
    chat: {
      title: 'Chat avec Bogdan',
      startConversation: 'Commencer une conversation',
      selectModel: 'Posez votre question. Bogdan est prêt à aider!',
      inputPlaceholder: 'Tapez un message...',
      send: 'Envoyer',
      export: 'Exporter',
      settings: 'Paramètres',
      clear: 'Effacer',
      menu: 'Menu',
      translator: 'Traducteur',
      languageSettings: 'Langue d\'interface',
      imageAnalysis: 'Analyse d\'images',
      voiceInput: 'Entrée vocale',
      codeAnalysis: 'Analyse de code',
      translateFrom: 'Traduire de',
      translateTo: 'Vers',
      enterText: 'Entrez le texte à traduire',
      translate: 'Traduire',
      interfaceLanguage: 'Langue d\'interface',
      primaryModel: 'Assistant principal',
      backupModel: 'Assistant de secours',
      you: 'Vous',
      chatExported: 'Chat exporté!',
      copied: 'Copié dans le presse-papiers!',
      responseReceived: 'Réponse reçue!'
    }
  },
  de: {
    hero: {
      badge: 'Intelligenter Assistent der Neuen Generation',
      title: 'Bogdan',
      subtitle: 'Ihr Persönlicher Assistent',
      description: 'Mit Liebe von Mitarbeitern des Flughafens Pulkovo erstellt, um Reisenden und allen zu helfen, die einen intelligenten Begleiter suchen.',
      codeGen: 'Code-Generierung',
      docAnalysis: 'Dokumentenanalyse',
      translations: 'Übersetzungen',
      ideas: 'Kreative Ideen',
      search: 'Informationssuche',
      startChat: 'Gespräch Beginnen',
      fast: 'Blitzschnell',
      fastDesc: 'Sofortige Antworten',
      smart: 'Intelligent',
      smartDesc: 'Moderne KI',
      secure: 'Sicher',
      secureDesc: 'Datenschutz',
      limitless: 'Grenzenlos',
      limitlessDesc: 'Jede Aufgabe'
    },
    features: {
      title: 'KI-Fähigkeiten',
      subtitle: 'Was Unsere Assistenten Können',
      
      reasoning: 'Tiefenanalyse',
      reasoningDesc: 'Lösung komplexer Probleme mit schrittweisem Denken. Mathematik, Logik, Programmierung.',
      
      coding: 'Programmierung',
      codingDesc: 'Code-Schreibung in über 50 Sprachen. Debugging, Refactoring, Code-Review.',
      
      multimodal: 'Multimodal',
      multimodalDesc: 'Bild-, PDF-, Dokumentenanalyse. Beschreibung von Grafiken, Tabellen, Diagrammen.',
      
      longContext: 'Großer Kontext',
      longContextDesc: 'Verarbeitung von bis zu 200.000 Token. Analyse von Büchern, Dokumentation, großen Codebasen.',
      
      translation: 'Übersetzungen',
      translationDesc: 'Über 100 Sprachen unter Beibehaltung von Stil und Kontext. Technische, literarische, geschäftliche Texte.',
      
      creative: 'Kreativität',
      creativeDesc: 'Generierung von Ideen, Skripten, Artikeln. Copywriting, Storytelling, Brainstorming.',
      
      data: 'Datenanalyse',
      dataDesc: 'Arbeit mit Tabellen, Statistiken, Visualisierung. JSON-, CSV-, XML-Analyse.',
      
      research: 'Forschung',
      researchDesc: 'Informationssuche, Berichtserstellung. Wissenschaftliche Artikel, Marktforschung.',
      
      chat: 'Kommunikation',
      chatDesc: 'Natürlicher Dialog zu jedem Thema. Bildung, Beratung, freundliches Gespräch.'
    },
    navigation: {
      home: 'Startseite',
      chat: 'Chat',
      features: 'Funktionen',
      tools: 'KI-Werkzeuge',
      admin: 'Admin',
      profile: 'Profil',
      login: 'Anmelden'
    },
    aboutUs: {
      title: 'Über Uns',
      description: 'Wir sind ein Team von Enthusiasten, die intelligente Lösungen für alltägliche Aufgaben schaffen',
      mission: 'Unsere Mission',
      missionText: 'Künstliche Intelligenz für alle zugänglich machen',
      vision: 'Unsere Vision',
      visionText: 'Eine Welt, in der Technologie Menschen hilft, mehr zu erreichen'
    },
    useCases: {
      title: 'Anwendungsfälle',
      startNow: 'Jetzt Starten',
      
      students: 'Für Studenten',
      studentsDesc: 'Lernhilfe, Problemlösung, Prüfungsvorbereitung',
      
      developers: 'Für Entwickler',
      developersDesc: 'Code-Review, Debugging, Code-Generierung, Architektur',
      
      business: 'Für Unternehmen',
      businessDesc: 'Automatisierung, Datenanalyse, Berichte, Präsentationen',
      
      creative: 'Für Kreative',
      creativeDesc: 'Inhalt, Copywriting, Projektideen, Skripte'
    },
    auth: {
      title: 'Willkommen',
      login: 'Anmelden',
      register: 'Registrieren',
      email: 'Email',
      password: 'Passwort',
      confirmPassword: 'Passwort Bestätigen',
      name: 'Name',
      loginButton: 'Anmelden',
      registerButton: 'Registrieren',
      success: 'Erfolg!',
      loginSuccess: 'Erfolgreich angemeldet',
      registerSuccess: 'Registrierung erfolgreich',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      fillFields: 'Bitte alle Felder ausfüllen'
    },
    profile: {
      title: 'Profil',
      totalRequests: 'Gesamtanfragen',
      timeInSystem: 'Zeit im System',
      activeSessions: 'Aktive Sitzungen',
      rating: 'Bewertung',
      
      tabs: {
        profile: 'Profil',
        history: 'Verlauf',
        settings: 'Einstellungen'
      },
      
      editProfile: 'Profil Bearbeiten',
      name: 'Name',
      email: 'Email',
      changePhoto: 'Foto Ändern',
      saveChanges: 'Änderungen Speichern',
      logout: 'Abmelden',
      
      recentRequests: 'Letzte Anfragen',
      viewAll: 'Alle Anzeigen',
      
      preferences: 'Einstellungen',
      notifications: 'Benachrichtigungen',
      notificationsDesc: 'Benachrichtigungen über neue Antworten erhalten',
      darkMode: 'Dunkler Modus',
      darkModeDesc: 'Dunkles Interface-Theme verwenden',
      autoSave: 'Automatisches Speichern',
      autoSaveDesc: 'Chat-Verlauf automatisch speichern',
      
      dangerZone: 'Gefahrenzone',
      deleteAccount: 'Konto Löschen',
      deleteWarning: 'Diese Aktion ist irreversibel',
      
      changesSaved: 'Änderungen gespeichert!',
      profileUpdated: 'Profil aktualisiert'
    },
    chat: {
      title: 'Chat mit Bogdan',
      startConversation: 'Gespräch beginnen',
      selectModel: 'Stellen Sie eine Frage. Bogdan ist bereit zu helfen!',
      inputPlaceholder: 'Nachricht eingeben...',
      send: 'Senden',
      export: 'Exportieren',
      settings: 'Einstellungen',
      clear: 'Löschen',
      menu: 'Menü',
      translator: 'Übersetzer',
      languageSettings: 'Sprache der Benutzeroberfläche',
      imageAnalysis: 'Bildanalyse',
      voiceInput: 'Spracheingabe',
      codeAnalysis: 'Code-Analyse',
      translateFrom: 'Übersetzen von',
      translateTo: 'Nach',
      enterText: 'Text zum Übersetzen eingeben',
      translate: 'Übersetzen',
      interfaceLanguage: 'Sprache der Benutzeroberfläche',
      primaryModel: 'Hauptassistent',
      backupModel: 'Backup-Assistent',
      you: 'Sie',
      chatExported: 'Chat exportiert!',
      copied: 'In Zwischenablage kopiert!',
      responseReceived: 'Antwort erhalten!'
    }
  },
  zh: {
    hero: {
      badge: '新一代智能助手',
      title: 'Bogdan',
      subtitle: '您的个人助手',
      description: '由普尔科沃机场员工用心创建，为旅客和所有寻求智能伴侣的人提供帮助。',
      codeGen: '代码生成',
      docAnalysis: '文档分析',
      translations: '翻译',
      ideas: '创意想法',
      search: '信息搜索',
      startChat: '开始对话',
      fast: '闪电般快速',
      fastDesc: '即时响应',
      smart: '智能',
      smartDesc: '现代AI',
      secure: '安全',
      secureDesc: '数据保护',
      limitless: '无限',
      limitlessDesc: '任何任务'
    },
    features: {
      title: 'AI能力',
      subtitle: '我们的助手能做什么',
      
      reasoning: '深度分析',
      reasoningDesc: '通过逐步推理解决复杂问题。数学、逻辑、编程。',
      
      coding: '编程',
      codingDesc: '用50多种语言编写代码。调试、重构、代码审查。',
      
      multimodal: '多模态',
      multimodalDesc: '图像、PDF、文档分析。描述图表、表格、图表。',
      
      longContext: '大上下文',
      longContextDesc: '处理多达200,000个令牌。分析书籍、文档、大型代码库。',
      
      translation: '翻译',
      translationDesc: '100多种语言，保留风格和上下文。技术、文学、商业文本。',
      
      creative: '创造力',
      creativeDesc: '生成想法、脚本、文章。文案、故事讲述、头脑风暴。',
      
      data: '数据分析',
      dataDesc: '处理表格、统计、可视化。JSON、CSV、XML分析。',
      
      research: '研究',
      researchDesc: '信息搜索、报告编制。科学论文、市场研究。',
      
      chat: '交流',
      chatDesc: '关于任何主题的自然对话。教育、咨询、友好交谈。'
    },
    navigation: {
      home: '首页',
      chat: '聊天',
      features: '功能',
      tools: 'AI工具',
      admin: '管理',
      profile: '个人资料',
      login: '登录'
    },
    aboutUs: {
      title: '关于我们',
      description: '我们是一群热情的团队，为日常任务创建智能解决方案',
      mission: '我们的使命',
      missionText: '让所有人都能使用人工智能',
      vision: '我们的愿景',
      visionText: '一个技术帮助人们实现更多的世界'
    },
    useCases: {
      title: '使用案例',
      startNow: '立即开始',
      
      students: '学生',
      studentsDesc: '学习帮助、问题解决、考试准备',
      
      developers: '开发者',
      developersDesc: '代码审查、调试、代码生成、架构',
      
      business: '企业',
      businessDesc: '自动化、数据分析、报告、演示',
      
      creative: '创意人士',
      creativeDesc: '内容、文案、项目创意、脚本'
    },
    auth: {
      title: '欢迎',
      login: '登录',
      register: '注册',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      name: '姓名',
      loginButton: '登录',
      registerButton: '注册',
      success: '成功！',
      loginSuccess: '登录成功',
      registerSuccess: '注册成功',
      passwordMismatch: '密码不匹配',
      fillFields: '请填写所有字段'
    },
    profile: {
      title: '个人资料',
      totalRequests: '总请求数',
      timeInSystem: '系统时间',
      activeSessions: '活跃会话',
      rating: '评分',
      
      tabs: {
        profile: '个人资料',
        history: '历史',
        settings: '设置'
      },
      
      editProfile: '编辑个人资料',
      name: '姓名',
      email: '邮箱',
      changePhoto: '更换照片',
      saveChanges: '保存更改',
      logout: '登出',
      
      recentRequests: '最近请求',
      viewAll: '查看全部',
      
      preferences: '偏好设置',
      notifications: '通知',
      notificationsDesc: '接收新回复通知',
      darkMode: '深色模式',
      darkModeDesc: '使用深色界面主题',
      autoSave: '自动保存',
      autoSaveDesc: '自动保存聊天历史',
      
      dangerZone: '危险区域',
      deleteAccount: '删除账户',
      deleteWarning: '此操作不可逆',
      
      changesSaved: '更改已保存！',
      profileUpdated: '个人资料已更新'
    },
    chat: {
      title: '与Bogdan聊天',
      startConversation: '开始对话',
      selectModel: '提出任何问题。Bogdan随时准备帮助您！',
      inputPlaceholder: '输入消息...',
      send: '发送',
      export: '导出',
      settings: '设置',
      clear: '清除',
      menu: '菜单',
      translator: '翻译器',
      languageSettings: '界面语言',
      imageAnalysis: '图像分析',
      voiceInput: '语音输入',
      codeAnalysis: '代码分析',
      translateFrom: '从',
      translateTo: '翻译到',
      enterText: '输入要翻译的文本',
      translate: '翻译',
      interfaceLanguage: '界面语言',
      primaryModel: '主助手',
      backupModel: '备用助手',
      you: '你',
      chatExported: '聊天已导出！',
      copied: '已复制到剪贴板！',
      responseReceived: '已收到回复！'
    }
  },
  ar: {
    hero: {
      badge: 'مساعد ذكي من الجيل الجديد',
      title: 'بوغدان',
      subtitle: 'مساعدك الشخصي',
      description: 'تم إنشاؤه بحب من قبل موظفي مطار بولكوفو لمساعدة المسافرين وأي شخص يبحث عن رفيق ذكي.',
      codeGen: 'توليد الكود',
      docAnalysis: 'تحليل المستندات',
      translations: 'الترجمات',
      ideas: 'أفكار إبداعية',
      search: 'البحث عن المعلومات',
      startChat: 'بدء المحادثة',
      fast: 'سريع البرق',
      fastDesc: 'استجابات فورية',
      smart: 'ذكي',
      smartDesc: 'الذكاء الاصطناعي الحديث',
      secure: 'آمن',
      secureDesc: 'حماية البيانات',
      limitless: 'بلا حدود',
      limitlessDesc: 'أي مهام'
    },
    features: {
      title: 'قدرات الذكاء الاصطناعي',
      subtitle: 'ما يمكن لمساعدينا القيام به',
      
      reasoning: 'التحليل العميق',
      reasoningDesc: 'حل المشاكل المعقدة بالتفكير خطوة بخطوة. الرياضيات والمنطق والبرمجة.',
      
      coding: 'البرمجة',
      codingDesc: 'كتابة التعليمات البرمجية بأكثر من 50 لغة. التصحيح وإعادة البناء ومراجعة الكود.',
      
      multimodal: 'متعدد الوسائط',
      multimodalDesc: 'تحليل الصور وملفات PDF والمستندات. وصف الرسوم البيانية والجداول والمخططات.',
      
      longContext: 'سياق كبير',
      longContextDesc: 'معالجة ما يصل إلى 200000 رمز. تحليل الكتب والوثائق وقواعد التعليمات البرمجية الكبيرة.',
      
      translation: 'الترجمات',
      translationDesc: 'أكثر من 100 لغة مع الحفاظ على الأسلوب والسياق. النصوص التقنية والأدبية والتجارية.',
      
      creative: 'الإبداع',
      creativeDesc: 'توليد الأفكار والسيناريوهات والمقالات. الكتابة الإبداعية والعصف الذهني.',
      
      data: 'تحليل البيانات',
      dataDesc: 'العمل مع الجداول والإحصاءات والتصور. تحليل JSON و CSV و XML.',
      
      research: 'البحث',
      researchDesc: 'البحث عن المعلومات وإعداد التقارير. المقالات العلمية وأبحاث السوق.',
      
      chat: 'التواصل',
      chatDesc: 'حوار طبيعي حول أي موضوع. التعليم والاستشارات والمحادثة الودية.'
    },
    navigation: {
      home: 'الرئيسية',
      chat: 'الدردشة',
      features: 'الميزات',
      tools: 'أدوات الذكاء الاصطناعي',
      admin: 'المسؤول',
      profile: 'الملف الشخصي',
      login: 'تسجيل الدخول'
    },
    aboutUs: {
      title: 'معلومات عنا',
      description: 'نحن فريق من المتحمسين الذين يبتكرون حلولاً ذكية للمهام اليومية',
      mission: 'مهمتنا',
      missionText: 'جعل الذكاء الاصطناعي في متناول الجميع',
      vision: 'رؤيتنا',
      visionText: 'عالم تساعد فيه التكنولوجيا الناس على تحقيق المزيد'
    },
    useCases: {
      title: 'حالات الاستخدام',
      startNow: 'ابدأ الآن',
      
      students: 'للطلاب',
      studentsDesc: 'المساعدة في الدراسة وحل المشكلات والتحضير للامتحانات',
      
      developers: 'للمطورين',
      developersDesc: 'مراجعة الكود والتصحيح وتوليد الكود والهندسة المعمارية',
      
      business: 'للأعمال',
      businessDesc: 'الأتمتة وتحليل البيانات والتقارير والعروض التقديمية',
      
      creative: 'للمبدعين',
      creativeDesc: 'المحتوى والكتابة الإبداعية وأفكار المشاريع والسيناريوهات'
    },
    auth: {
      title: 'مرحبا',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      name: 'الاسم',
      loginButton: 'تسجيل الدخول',
      registerButton: 'التسجيل',
      success: 'نجاح!',
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      registerSuccess: 'تم التسجيل بنجاح',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      fillFields: 'يرجى ملء جميع الحقول'
    },
    profile: {
      title: 'الملف الشخصي',
      totalRequests: 'إجمالي الطلبات',
      timeInSystem: 'الوقت في النظام',
      activeSessions: 'الجلسات النشطة',
      rating: 'التقييم',
      
      tabs: {
        profile: 'الملف الشخصي',
        history: 'السجل',
        settings: 'الإعدادات'
      },
      
      editProfile: 'تعديل الملف الشخصي',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      changePhoto: 'تغيير الصورة',
      saveChanges: 'حفظ التغييرات',
      logout: 'تسجيل الخروج',
      
      recentRequests: 'الطلبات الأخيرة',
      viewAll: 'عرض الكل',
      
      preferences: 'التفضيلات',
      notifications: 'الإشعارات',
      notificationsDesc: 'تلقي إشعارات حول الردود الجديدة',
      darkMode: 'الوضع الداكن',
      darkModeDesc: 'استخدام سمة الواجهة الداكنة',
      autoSave: 'الحفظ التلقائي',
      autoSaveDesc: 'حفظ سجل الدردشة تلقائيًا',
      
      dangerZone: 'منطقة الخطر',
      deleteAccount: 'حذف الحساب',
      deleteWarning: 'هذا الإجراء لا رجعة فيه',
      
      changesSaved: 'تم حفظ التغييرات!',
      profileUpdated: 'تم تحديث الملف الشخصي'
    },
    chat: {
      title: 'الدردشة مع بوغدان',
      startConversation: 'بدء محادثة',
      selectModel: 'اطرح أي سؤال. بوغدان جاهز للمساعدة!',
      inputPlaceholder: 'اكتب رسالة...',
      send: 'إرسال',
      export: 'تصدير',
      settings: 'الإعدادات',
      clear: 'مسح',
      menu: 'القائمة',
      translator: 'المترجم',
      languageSettings: 'لغة الواجهة',
      imageAnalysis: 'تحليل الصور',
      voiceInput: 'إدخال صوتي',
      codeAnalysis: 'تحليل الكود',
      translateFrom: 'ترجمة من',
      translateTo: 'إلى',
      enterText: 'أدخل النص للترجمة',
      translate: 'ترجمة',
      interfaceLanguage: 'لغة الواجهة',
      primaryModel: 'المساعد الرئيسي',
      backupModel: 'المساعد الاحتياطي',
      you: 'أنت',
      chatExported: 'تم تصدير الدردشة!',
      copied: 'تم النسخ إلى الحافظة!',
      responseReceived: 'تم استلام الرد!'
    }
  }
};

export const getTranslations = (lang: Language) => {
  return translations[lang] || translations.ru;
};
