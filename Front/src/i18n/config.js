import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    ru: {
        translation: {
            login: "Вход", register: "Регистрация", email: "Почта", password: "Пароль", verify: "Подтвердить",
            logout: "Выход", profile: "Профиль", calendar_view: "Календарь", planner_view: "Ежедневник",
            add_entry: "Добавить запись", select_type: "Тип активности", new_type: "+ Новая", duration: "Длительность",
            description: "Описание", save: "Сохранить", cancel: "Отмена", delete: "Удалить", no_entries: "Нет записей",
            theme: "Тема", dark: "Темная", light: "Светлая", language: "Язык", old_pass: "Старый пароль", new_pass: "Новый пароль", change_pass: "Изменить пароль", settings: "Настройки",
            no_admin_rights: "У вас нет прав администратора", select_dates: "Выберите даты!", download_error: "Ошибка при скачивании файла",
            admin_panel: "Панель администратора", download_db_csv: "Скачать базу ЦСВ", back: "Назад", role: "Роль",
            all_time: "За всё время", specific_period: "За определенный период", from_date: "С даты:", to_date: "По дату:",
            download: "Скачать", data_load_error: "Ошибка загрузки данных:", role_fetch_error: "Не удалось получить роль",
            category_load_error: "Ошибка загрузки категорий:", enter_time_gt_0: "Введите время больше 0",
            save_error: "Ошибка сохранения", delete_error: "Ошибка удаления", enter_name: "Введите название",
            create_activity_error: "Ошибка при создании активности", h: "ч", m: "м", name_placeholder: "Название",
            work: "Работа", vacation: "Отпуск", holiday: "Выходной", hours: "Ч", minutes: "М", download_csv: "Скачать ЦСВ",
            activities_load_error: "Ошибка загрузки активностей", back_to_list: "Назад к списку", user_activities: "Активности пользователя",
            loading: "Загрузка...", no_activities: "Активностей пока нет", date: "Дата", activity: "Активность",
            server_error_or_wrong_password: "Ошибка сервера или неверный пароль", or: "или", no_account: "Нет аккаунта?",
            register_error: "Ошибка регистрации", already_have_account: "Уже есть аккаунт?", code_sent: "Код отправлен на вашу почту!",
            code_request_error: "Ошибка при запросе кода", password_changed: "Пароль изменен.", password_change_error: "Ошибка смены пароля",
            request_code: "Запросить код на почту", code_6_digits: "Код (6 цифр)", email_not_found_error: "Ошибка: Почта не найдена",
            back_to_login: "Вернуться к входу", invalid_code_error: "Неверный код или ошибка сервера", enter_code: "Введите код",
            code_sent_to: "Код отправлен на:", confirm: "Подтвердить", auth_google: "Авторизация через Гугл..."
        }
    },
    cs: {
        translation: {
            login: "Přihlášení", register: "Registrace", email: "E-mail", password: "Heslo", verify: "Ověřit",
            logout: "Odhlásit se", profile: "Profil", calendar_view: "Kalendář", planner_view: "Diář",
            add_entry: "Přidat záznam", select_type: "Typ aktivity", new_type: "+ Nová", duration: "Délka",
            description: "Popis", save: "Uložit", cancel: "Zrušit", delete: "Smazat", no_entries: "Žádné záznamy",
            theme: "Motiv", dark: "Tmavý", light: "Světlý", language: "Jazyk", old_pass: "Staré heslo", new_pass: "Nové heslo", change_pass: "Změnit heslo", settings: "Nastavení",
            no_admin_rights: "Nemáte práva administrátora", select_dates: "Vyberte data!", download_error: "Chyba při stahování souboru",
            admin_panel: "Panel administrátora", download_db_csv: "Stáhnout databázi CSV", back: "Zpět", role: "Role",
            all_time: "Za celou dobu", specific_period: "Za určité období", from_date: "Od data:", to_date: "Do data:",
            download: "Stáhnout", data_load_error: "Chyba načítání dat:", role_fetch_error: "Nepodařilo se získat roli",
            category_load_error: "Chyba načítání kategorií:", enter_time_gt_0: "Zadejte čas větší než 0",
            save_error: "Chyba ukládání", delete_error: "Chyba mazání", enter_name: "Zadejte název",
            create_activity_error: "Chyba při vytváření aktivity", h: "h", m: "m", name_placeholder: "Název",
            work: "Práce", vacation: "Dovolená", holiday: "Svátek", hours: "H", minutes: "M", download_csv: "Stáhnout CSV",
            activities_load_error: "Chyba načítání aktivit", back_to_list: "Zpět na seznam", user_activities: "Aktivity uživatele",
            loading: "Načítání...", no_activities: "Zatím žádné aktivity", date: "Datum", activity: "Aktivita",
            server_error_or_wrong_password: "Chyba serveru nebo nesprávné heslo", or: "nebo", no_account: "Nemáte účet?",
            register_error: "Chyba registrace", already_have_account: "Máte již účet?", code_sent: "Kód byl odeslán na váš e-mail!",
            code_request_error: "Chyba při žádosti o kód", password_changed: "Heslo bylo změněno.", password_change_error: "Chyba změny hesla",
            request_code: "Vyžádat kód na e-mail", code_6_digits: "Kód (6 číslic)", email_not_found_error: "Chyba: E-mail nenalezen",
            back_to_login: "Zpět na přihlášení", invalid_code_error: "Nesprávný kód nebo chyba serveru", enter_code: "Zadejte kód",
            code_sent_to: "Kód byl odeslán na:", confirm: "Potvrdit", auth_google: "Přihlášení přes Google..."
        }
    },
    en: {
        translation: {
            login: "Login", register: "Register", email: "Email", password: "Password", verify: "Verify",
            logout: "Logout", profile: "Profile", calendar_view: "Calendar", planner_view: "Planner",
            add_entry: "Add Entry", select_type: "Activity Type", new_type: "+ New", duration: "Duration",
            description: "Description", save: "Save", cancel: "Cancel", delete: "Delete", no_entries: "No entries",
            theme: "Theme", dark: "Dark", light: "Light", language: "Language", old_pass: "Old Password", new_pass: "New Password", change_pass: "Change Password", settings: "Settings",
            no_admin_rights: "You do not have admin rights", select_dates: "Select dates!", download_error: "Error downloading file",
            admin_panel: "Admin Panel", download_db_csv: "Download DB CSV", back: "Back", role: "Role",
            all_time: "All time", specific_period: "Specific period", from_date: "From date:", to_date: "To date:",
            download: "Download", data_load_error: "Data load error:", role_fetch_error: "Failed to fetch role",
            category_load_error: "Category load error:", enter_time_gt_0: "Enter time greater than 0",
            save_error: "Save error", delete_error: "Delete error", enter_name: "Enter name",
            create_activity_error: "Error creating activity", h: "h", m: "m", name_placeholder: "Name",
            work: "Work", vacation: "Vacation", holiday: "Holiday", hours: "H", minutes: "M", download_csv: "Download CSV",
            activities_load_error: "Activities load error", back_to_list: "Back to list", user_activities: "User activities",
            loading: "Loading...", no_activities: "No activities yet", date: "Date", activity: "Activity",
            server_error_or_wrong_password: "Server error or wrong password", or: "or", no_account: "No account?",
            register_error: "Registration error", already_have_account: "Already have an account?", code_sent: "Code sent to your email!",
            code_request_error: "Error requesting code", password_changed: "Password changed.", password_change_error: "Error changing password",
            request_code: "Request code to email", code_6_digits: "Code (6 digits)", email_not_found_error: "Error: Email not found",
            back_to_login: "Back to login", invalid_code_error: "Invalid code or server error", enter_code: "Enter code",
            code_sent_to: "Code sent to:", confirm: "Confirm", auth_google: "Authenticating via Google..."
        }
    }
};

i18n.use(LanguageDetector).use(initReactI18next).init({
    resources, fallbackLng: 'en', interpolation: { escapeValue: false }
});

export default i18n;