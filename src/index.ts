import {
  createEffect,
  createEvent,
  createStore,
  type Effect,
  type EventCallable,
  type Store,
} from 'effector';

export type FormFieldValueType = string | number | boolean | null;
export type FormRulesType<T> = {
  [K in keyof T]?: ((
    value: T[keyof T],
  ) => { valid: true } | { valid: false; errors: string[] })[];
};

export class Form<T extends { [K in keyof T]: FormFieldValueType }> {
  initValue: T;
  setFields: EventCallable<Partial<T>> = createEvent<Partial<T>>();
  $fields: Store<T>;
  $handlers: Record<keyof T, (value: FormFieldValueType) => void>;
  setErrors: EventCallable<Record<keyof T, string[]>> =
    createEvent<Record<keyof T, string[]>>();
  $errors: Store<Record<keyof T, string[]>>;
  rules?: FormRulesType<T> | null;
  validCallback?: EventCallable<void> | null;
  nonValidCallback?: EventCallable<void> | null;

  validate: Effect<void, void, Error> = createEffect(() => {
    if (!this.rules) {
      this.validCallback?.();
      return;
    }
    (Object.keys(this.$fields.getState()) as (keyof T)[]).forEach((key) => {
      const validators = this.rules?.[key];

      if (!validators) {
        return;
      }

      validators.forEach((validator) => {
        const value = this.$fields.getState();
        const result = validator(value[key]);
        const errors = this.$errors.getState();

        if (!result.valid) {
          this.setErrors({
            ...errors,
            [key]: [...new Set([...errors[key], ...result.errors])],
          });
        } else {
          this.setErrors({ ...errors, [key]: [] });
        }
      });
    });
    const errors = this.$errors.getState();

    if (
      Object.values(errors).every((v) => Array.isArray(v) && v.length === 0)
    ) {
      this.validCallback?.();
    } else {
      this.nonValidCallback?.();
    }
  });
  reset: EventCallable<void> = createEvent<void>();
  clearErrors: EventCallable<void> = createEvent<void>();

  constructor(
    init: T,
    rules?: FormRulesType<T> | null,
    validCallback?: EventCallable<void> | null,
    nonValidCallback?: EventCallable<void> | null,
  ) {
    this.initValue = init;
    this.$fields = createStore<T>(this.initValue)
      .on(this.setFields, (state, data) => ({ ...state, ...data }))
      .reset(this.reset);
    this.rules = rules;
    this.validCallback = validCallback;
    this.nonValidCallback = nonValidCallback;

    const initErrors = {} as Record<keyof T, string[]>;
    (Object.keys(init) as Array<keyof T>).forEach((key) => {
      initErrors[key] = [];
    });

    this.$errors = createStore<Record<keyof T, string[]>>(initErrors)
      .on(this.setErrors, (_, errors) => errors)
      .reset(this.clearErrors);

    const handlers = {} as Record<keyof T, (value: FormFieldValueType) => void>;
    (Object.keys(init) as Array<keyof T>).forEach((key) => {
      handlers[key] = (value: FormFieldValueType) => {
        this.setFields({ [key]: value } as Partial<T>);
      };
    });
    this.$handlers = handlers as Record<
      keyof T,
      (value: FormFieldValueType) => void
    >;
  }
}
