export type Language = 'ru' | 'kz';

export const translations = {
  ru: {
    // Header
    siteTitle: "Свод мероприятий",
    organizations: "KMU · KazNMU · AMU · KRMU · MKTU · SMU · ZKMU",
    autosave: "автосохранение",
    autosaveShort: "сохр.",
    login: "Вход",
    logout: "Выйти",
    
    // Navigation
    charts: "Диаграммы",
    chartsShort: "Граф",
    orgs: "Организации",
    orgsShort: "Орг",
    tables: "Таблицы данных",
    tablesShort: "Табл",
    
    // Charts View
    distribution: "Распределение",
    eventsByOrg: "Мероприятия по организациям",
    total: "всего",
    clickToFilter: "Клик по сегменту или строке — фильтр остальных диаграмм",
    
    composition: "Состав",
    eventStructure: "Структура мероприятий",
    practiceNote: "Практикалы — часть плановых. Внеплановые идут сверх плана и могут превышать годовой норматив.",
    
    format: "Формат",
    speakersAndPractice: "Спикеры и практикалы",
    
    comparison: "Сравнение",
    planVsNorm: "План и внеплановые против годового норматива",
    plan: "план",
    unplanned: "вне плана",
    norm: "норма",
    completed: "выполнено",
    comparisonNote: "Пунктир — нужный норматив на год. Полоса, выходящая за него, — перевыполнение (плановые + внеплановые свыше нормы).",
    
    result: "Итог",
    performanceByEvents: "Успеваемость по мероприятиям",
    performanceNote: "Успеваемость = выполнено ÷ всего. Норма года может перевыполняться — свыше 100%.",
    
    // Metrics
    planned: "Плановые",
    practical: "Практикалы",
    unplannedEvents: "Внеплановые",
    withSpeakers: "Со спикерами",
    completedEvents: "Выполнено",
    normativ: "Норматив",
    
    // Orgs View
    orgBreakdown: "Разрез по организациям",
    separateOrgs: "Отдельные организации",
    orgsNote: "Плановые, практикалы, внеплановые и спикеры каждой организации — данные общие с таблицами.",
    editInTable: "Изменить цифры в таблице",
    summary: "Сводка",
    allOrgs: "Все организации · итог",
    
    // Tables View
    exactNumbers: "Точные цифры",
    eventsByOrgs: "Мероприятия по организациям",
    editNote: "Меняйте значения — все диаграммы перестроятся мгновенно.",
    clickToEdit: "клик по ячейке — правка",
    editMode: "✓ Режим редактирования",
    viewOnly: "🔒 Только просмотр",
    restoreDefaults: "Восстановить исходные",
    
    totalPlanUnplan: "Всего (план+внепл.)",
    left: "Осталось",
    performance: "Успеваемость",
    status: "Статус",
    normPercent: "Норма, %",
    
    // Performance table
    performanceTable: "Общая таблица успеваемости по мероприятиям",
    performanceTableNote: "Процент выполнения и норма года могут превышать 100% — это перевыполнение.",
    
    // Statuses
    excellent: "Отлично",
    good: "Хорошо",
    average: "Средне",
    needsAttention: "Требует внимания",
    
    // Footer
    footerNote: "Правки во вкладке «Таблицы» перестраивают все диаграммы",
    
    // Language
    language: "Язык",
    
    // Login
    loginTitle: "Вход для редактирования",
    loginSubtitle: "Введите пароль администратора",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    cancel: "Отмена",
    submit: "Войти",
    hint: "💡 Подсказка",
    hintNote: "Пароль для демонстрации:",
    wrongPassword: "Неверный пароль",
    
    // Toast
    dataRestored: "Исходные данные восстановлены",
    
    // Org card
    organization: "Организация",
    totalEvents: "всего мероприятий",
    fromPlanned: "из плановых",
    withinNorm: "в пределах нормы",
    overNorm: "сверх нормы",
  },
  
  kz: {
    // Header
    siteTitle: "Іс-шаралар жиынтығы",
    organizations: "KMU · KazNMU · AMU · KRMU · MKTU · SMU · ZKMU",
    autosave: "автосақтау",
    autosaveShort: "сақтау",
    login: "Кіру",
    logout: "Шығу",
    
    // Navigation
    charts: "Диаграммалар",
    chartsShort: "Граф",
    orgs: "Ұйымдар",
    orgsShort: "Ұйым",
    tables: "Деректер кестелері",
    tablesShort: "Кесте",
    
    // Charts View
    distribution: "Бөлініс",
    eventsByOrg: "Ұйымдар бойынша іс-шаралар",
    total: "барлығы",
    clickToFilter: "Сегментке немесе жолға басу — қалған диаграммаларды сүзгілеу",
    
    composition: "Құрамы",
    eventStructure: "Іс-шаралар құрылымы",
    practiceNote: "Практикалар — жоспарлы іс-шаралардың бөлігі. Жоспардан тыс іс-шаралар жоспардан тыс және жылдық нормативтен асып кетуі мүмкін.",
    
    format: "Формат",
    speakersAndPractice: "Спикерлер және практикалар",
    
    comparison: "Салыстыру",
    planVsNorm: "Жоспарлы және жоспардан тыс іс-шаралар жылдық нормативке қарсы",
    plan: "жоспар",
    unplanned: "жоспардан тыс",
    norm: "норма",
    completed: "орындалды",
    comparisonNote: "Штрих — жылға қажетті норматив. Одан шығатын жолақ — норманы асып орындау (жоспарлы + жоспардан тыс норманан жоғары).",
    
    result: "Қорытынды",
    performanceByEvents: "Іс-шаралар бойынша үлгерім",
    performanceNote: "Үлгерім = орындалды ÷ барлығы. Жылдық норма асып орындалуы мүмкін — 100%-дан жоғары.",
    
    // Metrics
    planned: "Жоспарлы",
    practical: "Практикалар",
    unplannedEvents: "Жоспардан тыс",
    withSpeakers: "Спикерлермен",
    completedEvents: "Орындалды",
    normativ: "Норматив",
    
    // Orgs View
    orgBreakdown: "Ұйымдар бойынша талдау",
    separateOrgs: "Жеке ұйымдар",
    orgsNote: "Әр ұйымның жоспарлы, практикалар, жоспардан тыс және спикерлері — деректер кестелермен ортақ.",
    editInTable: "Кестедегі сандарды өзгерту",
    summary: "Жиынтық",
    allOrgs: "Барлық ұйымдар · қорытынды",
    
    // Tables View
    exactNumbers: "Нақты сандар",
    eventsByOrgs: "Ұйымдар бойынша іс-шаралар",
    editNote: "Мәндерді өзгертіңіз — барлық диаграммалар бірден қайта құрылады.",
    clickToEdit: "ұяшыққа басу — өңдеу",
    editMode: "✓ Өңдеу режимі",
    viewOnly: "🔒 Тек қарау",
    restoreDefaults: "Бастапқы деректерді қалпына келтіру",
    
    totalPlanUnplan: "Барлығы (жоспар+жоспардан тыс)",
    left: "Қалды",
    performance: "Үлгерім",
    status: "Мәртебе",
    normPercent: "Норма, %",
    
    // Performance table
    performanceTable: "Іс-шаралар бойынша жалпы үлгерім кестесі",
    performanceTableNote: "Орындау пайызы және жылдық норма 100%-дан асып кетуі мүмкін — бұл норманы асып орындау.",
    
    // Statuses
    excellent: "Тамаша",
    good: "Жақсы",
    average: "Орташа",
    needsAttention: "Назар аударуды қажет етеді",
    
    // Footer
    footerNote: "«Кестелер» қойындысындағы өзгерістер барлық диаграммаларды қайта құрады",
    
    // Language
    language: "Тіл",
    
    // Login
    loginTitle: "Өңдеу үшін кіру",
    loginSubtitle: "Әкімші құпиясөзін енгізіңіз",
    password: "Құпиясөз",
    passwordPlaceholder: "Құпиясөзді енгізіңіз",
    cancel: "Болдырмау",
    submit: "Кіру",
    hint: "💡 Кеңес",
    hintNote: "Демо үшін құпиясөз:",
    wrongPassword: "Құпиясөз дұрыс емес",
    
    // Toast
    dataRestored: "Бастапқы деректер қалпына келтірілді",
    
    // Org card
    organization: "Ұйым",
    totalEvents: "барлық іс-шаралар",
    fromPlanned: "жоспарлыдан",
    withinNorm: "норма шегінде",
    overNorm: "нормадан тыс",
  }
};

export type TranslationKey = keyof typeof translations.ru;
