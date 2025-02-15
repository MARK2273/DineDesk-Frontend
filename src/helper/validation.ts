import * as yup from "yup";
// // Define common schema argument types
interface BaseSchemaArgs {
  required?: boolean;
  nullable?: boolean;
}

// Specific arguments for each schema type
interface StringSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
  trim?: boolean;
}

interface NumberSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
  min?: number;
  max?: number;
}

interface BooleanSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
}

interface ArraySchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
  min?: number;
}

interface ObjectSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  schema: yup.ObjectShape;
  requiredMessage?: string;
}

interface EmailSchemaArgs extends BaseSchemaArgs {
  fieldName?: string;
  requiredMessage?: string;
}

interface PhoneSchemaArgs extends BaseSchemaArgs {
  fieldName: string;
  requiredMessage?: string;
  isValidKey?: string;
}

// Dynamically infer the correct type for Yup's schemas
type DynamicStringSchema<T extends StringSchemaArgs> =
  T["required"] extends true
    ? T["nullable"] extends true
      ? yup.StringSchema<string | null, yup.AnyObject, undefined, "">
      : yup.StringSchema<string, yup.AnyObject, undefined, "">
    : T["nullable"] extends true
    ? yup.StringSchema<string | null | undefined, yup.AnyObject, undefined, "">
    : yup.StringSchema<string | undefined, yup.AnyObject, undefined, "">;

type DynamicNumberSchema<T extends NumberSchemaArgs> =
  T["required"] extends true
    ? T["nullable"] extends true
      ? yup.NumberSchema<number | null, yup.AnyObject, undefined, "">
      : yup.NumberSchema<number, yup.AnyObject, undefined, "">
    : T["nullable"] extends true
    ? yup.NumberSchema<number | null | undefined, yup.AnyObject, undefined, "">
    : yup.NumberSchema<number | undefined, yup.AnyObject, undefined, "">;

type DynamicBooleanSchema<T extends BooleanSchemaArgs> =
  T["required"] extends true
    ? T["nullable"] extends true
      ? yup.BooleanSchema<boolean | null, yup.AnyObject, undefined, "">
      : yup.BooleanSchema<boolean, yup.AnyObject, undefined, "">
    : T["nullable"] extends true
    ? yup.BooleanSchema<
        boolean | null | undefined,
        yup.AnyObject,
        undefined,
        ""
      >
    : yup.BooleanSchema<boolean | undefined, yup.AnyObject, undefined, "">;

type DynamicArraySchema<T extends ArraySchemaArgs> = T["required"] extends true
  ? T["nullable"] extends true
    ? yup.ArraySchema<any[] | null, yup.AnyObject, undefined, "">
    : yup.ArraySchema<any[], yup.AnyObject, undefined, "">
  : T["nullable"] extends true
  ? yup.ArraySchema<any[] | null | undefined, yup.AnyObject, undefined, "">
  : yup.ArraySchema<any[] | undefined, yup.AnyObject, undefined, "">;

type DynamicObjectSchema<T extends ObjectSchemaArgs> =
  T["required"] extends true
    ? T["nullable"] extends true
      ? yup.ObjectSchema<yup.AnyObject | null, yup.AnyObject, yup.AnyObject, "">
      : yup.ObjectSchema<yup.AnyObject, yup.AnyObject, yup.AnyObject, "">
    : T["nullable"] extends true
    ? yup.ObjectSchema<
        yup.AnyObject | null | undefined,
        yup.AnyObject,
        yup.AnyObject,
        ""
      >
    : yup.ObjectSchema<
        yup.AnyObject | undefined,
        yup.AnyObject,
        yup.AnyObject,
        ""
      >;

type DynamicEmailSchema<T extends EmailSchemaArgs> = T["required"] extends true
  ? yup.StringSchema<string, yup.AnyObject, undefined, "">
  : T["nullable"] extends true
  ? yup.StringSchema<string | null, yup.AnyObject, undefined, "">
  : yup.StringSchema<string | undefined, yup.AnyObject, undefined, "">;

type DynamicPhoneSchema<T extends PhoneSchemaArgs> = T["required"] extends true
  ? yup.StringSchema<string, yup.AnyObject, undefined, "">
  : T["nullable"] extends true
  ? yup.StringSchema<string | null, yup.AnyObject, undefined, "">
  : yup.StringSchema<string | undefined, yup.AnyObject, undefined, "">;

export const validationRules = {
  string: <T extends StringSchemaArgs>({
    fieldName,
    required = false,
    requiredMessage,
    trim = true,
    nullable = false,
  }: T): DynamicStringSchema<T> => {
    let schema = yup.string().nullable();

    if (trim) schema = schema.trim();

    if (required) {
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    }

    if (nullable) {
      schema = schema.nullable();
    }

    return schema as DynamicStringSchema<T>;
  },

  /**
   * Number Validation (Fixed for TypeScript)
   */
  number: <T extends NumberSchemaArgs>({
    fieldName,
    required = false,
    requiredMessage,
    min,
    max,
    nullable = false,
  }: T): DynamicNumberSchema<T> => {
    let schema = yup.number().nullable();

    if (required)
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    if (nullable) schema = schema.nullable();
    if (min !== undefined)
      schema = schema.min(min, `${fieldName} must be at least ${min}`);
    if (max !== undefined)
      schema = schema.max(max, `${fieldName} must not exceed ${max}`);

    return schema as DynamicNumberSchema<T>;
  },

  /**
   * Boolean Validation (Fixed for TypeScript)
   */
  boolean: <T extends BooleanSchemaArgs>({
    fieldName,
    required = false,
    requiredMessage,
    nullable = false,
  }: T): DynamicBooleanSchema<T> => {
    let schema = yup.boolean().nullable();

    if (required)
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    if (nullable) schema = schema.nullable();

    return schema as DynamicBooleanSchema<T>;
  },

  /**
   * Array Validation (Fully Fixed)
   */
  array: <T extends ArraySchemaArgs>({
    fieldName,
    min = 1,
    required = false,
    requiredMessage,
    nullable = false,
  }: T): DynamicArraySchema<T> => {
    let schema = yup.array().of(yup.mixed()).nullable();

    if (required)
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    if (nullable) schema = schema.nullable();
    schema = schema.min(
      min,
      requiredMessage || `${fieldName} must have at least ${min} item(s)`
    );

    return schema as unknown as DynamicArraySchema<T>;
  },

  /**
   * Object Validation (Fully Fixed)
   */
  // object: <T extends ObjectSchemaArgs>({
  //   fieldName,
  //   schema,
  //   required = false,
  //   requiredMessage,
  //   nullable = false
  // }: T): DynamicObjectSchema<T> => {
  //   let objectSchema = yup.object().shape(schema).nullable();

  //   if (required)
  //     objectSchema = objectSchema.required(
  //       requiredMessage || `${fieldName} is required`
  //     );
  //   if (nullable) objectSchema = objectSchema.nullable();

  //   return schema as unknown as DynamicObjectSchema<T>;
  // },

  object: <T extends ObjectSchemaArgs>({
    fieldName,
    schema,
    required = false,
    requiredMessage,
    nullable = true,
  }: T): DynamicObjectSchema<T> => {
    let objectSchema = yup.object().shape(schema).nullable();

    if (nullable) objectSchema = objectSchema.nullable();
    if (required)
      objectSchema = objectSchema.required(
        requiredMessage || `${fieldName} is required`
      );

    return objectSchema as DynamicObjectSchema<T>;
  },

  /**
   * Email Validation (Fully Fixed)
   */
  email: <T extends EmailSchemaArgs>({
    fieldName = "email",
    required = false,
    requiredMessage,
    nullable = false,
  }: T): DynamicEmailSchema<T> => {
    let schema = yup.string().email(`Invalid ${fieldName} address`).nullable();

    if (required)
      schema = schema.required(requiredMessage || `${fieldName} is required`);
    if (nullable) schema = schema.nullable();

    return schema as DynamicEmailSchema<T>;
  },
  phone: <T extends PhoneSchemaArgs>({
    fieldName,
    required = false,
    requiredMessage,
    isValidKey = "isValid",
    nullable = false,
  }: T): DynamicPhoneSchema<T> => {
    let schema = yup.string().nullable();

    if (required)
      schema = schema
        .required(requiredMessage || `${fieldName} is required`)
        .min(5, requiredMessage || `${fieldName} is required`);
    if (nullable) schema = schema.nullable();

    return schema.test(
      "is-valid-phone",
      "Phone number is invalid",
      function (value) {
        // If value is empty, do not apply the validation test
        if (!value) return required ? false : true;
        return this.parent?.[isValidKey] ?? false;
      }
    ) as DynamicPhoneSchema<T>;
  },

  // phone: <T extends PhoneSchemaArgs>({
  //   fieldName,
  //   required = false,
  //   requiredMessage,
  //   isValidKey = 'isValid',
  //   nullable = false
  // }: T): DynamicPhoneSchema<T> => {
  //   let schema = yup.string().nullable();

  //   if (nullable) schema = schema.nullable();

  //   if (required) {
  //     schema = schema
  //       .required(requiredMessage || `${fieldName} is required`)
  //       .min(5, requiredMessage || `${fieldName} is required`);
  //   }
  //   // schema = schema.test(
  //   //   'is-valid-phone',
  //   //   'Phone number is invalid 21',
  //   //   function () {
  //   //     return this.parent?.[isValidKey] ?? false;
  //   //   }
  //   // );
  //   schema = schema.when('$currentStep', (currentStep, schema) => {
  //     const step = Array.isArray(currentStep) ? currentStep[0] : currentStep;
  //     console.log('in demo', step);
  //     return step === 2
  //       ? schema
  //           .required('Phone number is required')
  //           .test('is-valid-phone', 'Phone number is invalid 21', function () {
  //             return this.parent?.[isValidKey] ?? false;
  //           })
  //       : schema.nullable();
  //   });

  //   return schema as DynamicPhoneSchema<T>;
  // }
};
export const generateConditionalSchema = <T extends yup.Schema<any>>(
  schema: T,
  stepCondition: number,
  requiredSchema?: (schema: T) => T
) =>
  schema.when("$currentStep", (currentStep, baseSchema) => {
    const step = Array.isArray(currentStep) ? currentStep[0] : currentStep;
    return step >= stepCondition && requiredSchema
      ? requiredSchema(baseSchema)
      : baseSchema.nullable();
  });
