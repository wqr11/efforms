# efforms 📝

Легковесная библиотека для работы с формами, построенная на основе [effector](https://effector.dev/).

## ✨ Особенности

- 🎯 **Type-safe** - полная поддержка TypeScript
- ⚡ **Реактивность** - построено на Effector
- 🔒 **Валидация** - встроенная система валидации с поддержкой множественных правил
- 🎨 **Гибкость** - легко интегрируется с любыми UI фреймворками
- 📦 **Минимализм** - без лишних зависимостей
- 🔄 **Управление состоянием** - автоматическое управление полями и ошибками

## 📦 Установка

```bash
npm install efforms effector
```

## 📚 API

`new Form(initialValues, rules?, validCallback?, nonValidCallback?)`
Создает новый экземпляр формы.

### Параметры:

`initialValues: T` - начальные значения полей формы

`rules?: FormRulesType<T>` - правила валидации (опционально)

`validCallback?: EventCallable<void>` - коллбек при успешной валидации (опционально)

`nonValidCallback?: EventCallable<void>` - коллбек при неуспешной валидации (опционально)

### Stores (сторы)

`$fields: Store<T>` - store с текущими значениями полей

`$errors: Store<Record<keyof T, string[]>>` - store с ошибками валидации

### Events (ивенты)

`setFields: Event<Partial<T>>` - установить значения полей

`setErrors: Event<Record<keyof T, string[]>>` - установить ошибки

`reset: Event<void>` - сбросить форму к начальным значениям

`clearErrors: Event<void>` - очистить все ошибки

### Effects (эффекты)

`validate: Effect<void, void>` - выполнить валидацию формы

### Handlers (обработчики)

`$handlers: Record<keyof T, (value: FormFieldValueType) => void>` - автоматически созданные обработчики для каждого поля

## 🔍 Примеры использования

### Базовая форма без валидации

```typescript
const simpleForm = new Form({
  username: '',
  age: 0,
});

// Изменение значений
simpleForm.$handlers.username('john_doe');
simpleForm.$handlers.age(25);

// Сброс формы
simpleForm.reset();
```

### Множественные правила валидации

```typescript
const form = new Form(
  { password: '' },
  {
    password: [
      (value) => {
        if (!value) {
          return { valid: false, errors: ['Поле обязательно'] };
        }
        return { valid: true };
      },
      (value) => {
        if ((value as string).length < 8) {
          return { valid: false, errors: ['Минимум 8 символов'] };
        }
        return { valid: true };
      },
      (value) => {
        if (!/[A-Z]/.test(value as string)) {
          return { valid: false, errors: ['Нужна заглавная буква'] };
        }
        return { valid: true };
      },
      (value) => {
        if (!/[0-9]/.test(value as string)) {
          return { valid: false, errors: ['Нужна цифра'] };
        }
        return { valid: true };
      },
    ],
  },
);
```

## 🤝 Совместимость

- Effector v20+ (2019+)
- TypeScript 3.7.0+ (2019+)
- Любые UI фреймворки (React, Vue, Solid, Svelte и т.д.)

## 📝 Лицензия

- MIT

## 🐛 Сообщить о проблеме

Нашли баг? Создайте issue

## ⭐ Поддержка проекта

Если вам нравится efforms, поставьте звезду на GitHub!
