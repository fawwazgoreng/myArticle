
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Article
 * 
 */
export type Article = $Result.DefaultSelection<Prisma.$ArticlePayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model Session_audit_trail
 * 
 */
export type Session_audit_trail = $Result.DefaultSelection<Prisma.$Session_audit_trailPayload>
/**
 * Model CategoryOnArticle
 * 
 */
export type CategoryOnArticle = $Result.DefaultSelection<Prisma.$CategoryOnArticlePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Articles
 * const articles = await prisma.article.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Articles
   * const articles = await prisma.article.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.article`: Exposes CRUD operations for the **Article** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.article.findMany()
    * ```
    */
  get article(): Prisma.ArticleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session_audit_trail`: Exposes CRUD operations for the **Session_audit_trail** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Session_audit_trails
    * const session_audit_trails = await prisma.session_audit_trail.findMany()
    * ```
    */
  get session_audit_trail(): Prisma.Session_audit_trailDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.categoryOnArticle`: Exposes CRUD operations for the **CategoryOnArticle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CategoryOnArticles
    * const categoryOnArticles = await prisma.categoryOnArticle.findMany()
    * ```
    */
  get categoryOnArticle(): Prisma.CategoryOnArticleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Article: 'Article',
    Category: 'Category',
    Admin: 'Admin',
    Session_audit_trail: 'Session_audit_trail',
    CategoryOnArticle: 'CategoryOnArticle'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "article" | "category" | "admin" | "session_audit_trail" | "categoryOnArticle"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Article: {
        payload: Prisma.$ArticlePayload<ExtArgs>
        fields: Prisma.ArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findFirst: {
            args: Prisma.ArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findMany: {
            args: Prisma.ArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          create: {
            args: Prisma.ArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          createMany: {
            args: Prisma.ArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          delete: {
            args: Prisma.ArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          update: {
            args: Prisma.ArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          deleteMany: {
            args: Prisma.ArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          upsert: {
            args: Prisma.ArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          aggregate: {
            args: Prisma.ArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle>
          }
          groupBy: {
            args: Prisma.ArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      Session_audit_trail: {
        payload: Prisma.$Session_audit_trailPayload<ExtArgs>
        fields: Prisma.Session_audit_trailFieldRefs
        operations: {
          findUnique: {
            args: Prisma.Session_audit_trailFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.Session_audit_trailFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>
          }
          findFirst: {
            args: Prisma.Session_audit_trailFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.Session_audit_trailFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>
          }
          findMany: {
            args: Prisma.Session_audit_trailFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>[]
          }
          create: {
            args: Prisma.Session_audit_trailCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>
          }
          createMany: {
            args: Prisma.Session_audit_trailCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.Session_audit_trailCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>[]
          }
          delete: {
            args: Prisma.Session_audit_trailDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>
          }
          update: {
            args: Prisma.Session_audit_trailUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>
          }
          deleteMany: {
            args: Prisma.Session_audit_trailDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.Session_audit_trailUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.Session_audit_trailUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>[]
          }
          upsert: {
            args: Prisma.Session_audit_trailUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Session_audit_trailPayload>
          }
          aggregate: {
            args: Prisma.Session_audit_trailAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession_audit_trail>
          }
          groupBy: {
            args: Prisma.Session_audit_trailGroupByArgs<ExtArgs>
            result: $Utils.Optional<Session_audit_trailGroupByOutputType>[]
          }
          count: {
            args: Prisma.Session_audit_trailCountArgs<ExtArgs>
            result: $Utils.Optional<Session_audit_trailCountAggregateOutputType> | number
          }
        }
      }
      CategoryOnArticle: {
        payload: Prisma.$CategoryOnArticlePayload<ExtArgs>
        fields: Prisma.CategoryOnArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryOnArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryOnArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>
          }
          findFirst: {
            args: Prisma.CategoryOnArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryOnArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>
          }
          findMany: {
            args: Prisma.CategoryOnArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>[]
          }
          create: {
            args: Prisma.CategoryOnArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>
          }
          createMany: {
            args: Prisma.CategoryOnArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryOnArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>[]
          }
          delete: {
            args: Prisma.CategoryOnArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>
          }
          update: {
            args: Prisma.CategoryOnArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>
          }
          deleteMany: {
            args: Prisma.CategoryOnArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryOnArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryOnArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>[]
          }
          upsert: {
            args: Prisma.CategoryOnArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryOnArticlePayload>
          }
          aggregate: {
            args: Prisma.CategoryOnArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategoryOnArticle>
          }
          groupBy: {
            args: Prisma.CategoryOnArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryOnArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryOnArticleCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryOnArticleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    article?: ArticleOmit
    category?: CategoryOmit
    admin?: AdminOmit
    session_audit_trail?: Session_audit_trailOmit
    categoryOnArticle?: CategoryOnArticleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ArticleCountOutputType
   */

  export type ArticleCountOutputType = {
    category: number
  }

  export type ArticleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | ArticleCountOutputTypeCountCategoryArgs
  }

  // Custom InputTypes
  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleCountOutputType
     */
    select?: ArticleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountCategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryOnArticleWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    article: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | CategoryCountOutputTypeCountArticleArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountArticleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryOnArticleWhereInput
  }


  /**
   * Count Type AdminCountOutputType
   */

  export type AdminCountOutputType = {
    authlogs: number
  }

  export type AdminCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authlogs?: boolean | AdminCountOutputTypeCountAuthlogsArgs
  }

  // Custom InputTypes
  /**
   * AdminCountOutputType without action
   */
  export type AdminCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminCountOutputType
     */
    select?: AdminCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AdminCountOutputType without action
   */
  export type AdminCountOutputTypeCountAuthlogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Session_audit_trailWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Article
   */

  export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  export type ArticleAvgAggregateOutputType = {
    id: number | null
    base_views: number | null
  }

  export type ArticleSumAggregateOutputType = {
    id: number | null
    base_views: number | null
  }

  export type ArticleMinAggregateOutputType = {
    id: number | null
    title: string | null
    content: string | null
    image: string | null
    base_views: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ArticleMaxAggregateOutputType = {
    id: number | null
    title: string | null
    content: string | null
    image: string | null
    base_views: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ArticleCountAggregateOutputType = {
    id: number
    title: number
    content: number
    image: number
    base_views: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ArticleAvgAggregateInputType = {
    id?: true
    base_views?: true
  }

  export type ArticleSumAggregateInputType = {
    id?: true
    base_views?: true
  }

  export type ArticleMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    image?: true
    base_views?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticleMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    image?: true
    base_views?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticleCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    image?: true
    base_views?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Article to aggregate.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Articles
    **/
    _count?: true | ArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType
  }

  export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle[P]>
      : GetScalarType<T[P], AggregateArticle[P]>
  }




  export type ArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithAggregationInput | ArticleOrderByWithAggregationInput[]
    by: ArticleScalarFieldEnum[] | ArticleScalarFieldEnum
    having?: ArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCountAggregateInputType | true
    _avg?: ArticleAvgAggregateInputType
    _sum?: ArticleSumAggregateInputType
    _min?: ArticleMinAggregateInputType
    _max?: ArticleMaxAggregateInputType
  }

  export type ArticleGroupByOutputType = {
    id: number
    title: string
    content: string
    image: string | null
    base_views: number
    created_at: Date
    updated_at: Date
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  type GetArticleGroupByPayload<T extends ArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleGroupByOutputType[P]>
        }
      >
    >


  export type ArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    image?: boolean
    base_views?: boolean
    created_at?: boolean
    updated_at?: boolean
    category?: boolean | Article$categoryArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    image?: boolean
    base_views?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    image?: boolean
    base_views?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    image?: boolean
    base_views?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "image" | "base_views" | "created_at" | "updated_at", ExtArgs["result"]["article"]>
  export type ArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | Article$categoryArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Article"
    objects: {
      category: Prisma.$CategoryOnArticlePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      content: string
      image: string | null
      base_views: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["article"]>
    composites: {}
  }

  type ArticleGetPayload<S extends boolean | null | undefined | ArticleDefaultArgs> = $Result.GetResult<Prisma.$ArticlePayload, S>

  type ArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleCountAggregateInputType | true
    }

  export interface ArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Article'], meta: { name: 'Article' } }
    /**
     * Find zero or one Article that matches the filter.
     * @param {ArticleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFindUniqueArgs>(args: SelectSubset<T, ArticleFindUniqueArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFindFirstArgs>(args?: SelectSubset<T, ArticleFindFirstArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleFindManyArgs>(args?: SelectSubset<T, ArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Article.
     * @param {ArticleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     * 
     */
    create<T extends ArticleCreateArgs>(args: SelectSubset<T, ArticleCreateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Articles.
     * @param {ArticleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleCreateManyArgs>(args?: SelectSubset<T, ArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Articles and returns the data saved in the database.
     * @param {ArticleCreateManyAndReturnArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Article.
     * @param {ArticleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     * 
     */
    delete<T extends ArticleDeleteArgs>(args: SelectSubset<T, ArticleDeleteArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Article.
     * @param {ArticleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleUpdateArgs>(args: SelectSubset<T, ArticleUpdateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Articles.
     * @param {ArticleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleDeleteManyArgs>(args?: SelectSubset<T, ArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleUpdateManyArgs>(args: SelectSubset<T, ArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles and returns the data updated in the database.
     * @param {ArticleUpdateManyAndReturnArgs} args - Arguments to update many Articles.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Article.
     * @param {ArticleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends ArticleUpsertArgs>(args: SelectSubset<T, ArticleUpsertArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticleCountArgs>(
      args?: Subset<T, ArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleAggregateArgs>(args: Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>

    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleGroupByArgs['orderBy'] }
        : { orderBy?: ArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Article model
   */
  readonly fields: ArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Article.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends Article$categoryArgs<ExtArgs> = {}>(args?: Subset<T, Article$categoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Article model
   */
  interface ArticleFieldRefs {
    readonly id: FieldRef<"Article", 'Int'>
    readonly title: FieldRef<"Article", 'String'>
    readonly content: FieldRef<"Article", 'String'>
    readonly image: FieldRef<"Article", 'String'>
    readonly base_views: FieldRef<"Article", 'Int'>
    readonly created_at: FieldRef<"Article", 'DateTime'>
    readonly updated_at: FieldRef<"Article", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Article findUnique
   */
  export type ArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findUniqueOrThrow
   */
  export type ArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findFirst
   */
  export type ArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findFirstOrThrow
   */
  export type ArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findMany
   */
  export type ArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article create
   */
  export type ArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a Article.
     */
    data: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
  }

  /**
   * Article createMany
   */
  export type ArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Article createManyAndReturn
   */
  export type ArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Article update
   */
  export type ArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a Article.
     */
    data: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
    /**
     * Choose, which Article to update.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article updateMany
   */
  export type ArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
  }

  /**
   * Article updateManyAndReturn
   */
  export type ArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
  }

  /**
   * Article upsert
   */
  export type ArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the Article to update in case it exists.
     */
    where: ArticleWhereUniqueInput
    /**
     * In case the Article found by the `where` argument doesn't exist, create a new Article with this data.
     */
    create: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
    /**
     * In case the Article was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
  }

  /**
   * Article delete
   */
  export type ArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter which Article to delete.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article deleteMany
   */
  export type ArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to delete.
     */
    limit?: number
  }

  /**
   * Article.category
   */
  export type Article$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    where?: CategoryOnArticleWhereInput
    orderBy?: CategoryOnArticleOrderByWithRelationInput | CategoryOnArticleOrderByWithRelationInput[]
    cursor?: CategoryOnArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryOnArticleScalarFieldEnum | CategoryOnArticleScalarFieldEnum[]
  }

  /**
   * Article without action
   */
  export type ArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    created_at: Date
    updated_at: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
    article?: boolean | Category$articleArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "created_at" | "updated_at", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | Category$articleArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      article: Prisma.$CategoryOnArticlePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends Category$articleArgs<ExtArgs> = {}>(args?: Subset<T, Category$articleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
    readonly created_at: FieldRef<"Category", 'DateTime'>
    readonly updated_at: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.article
   */
  export type Category$articleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    where?: CategoryOnArticleWhereInput
    orderBy?: CategoryOnArticleOrderByWithRelationInput | CategoryOnArticleOrderByWithRelationInput[]
    cursor?: CategoryOnArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryOnArticleScalarFieldEnum | CategoryOnArticleScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AdminMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    email: number
    password: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type AdminMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    created_at?: true
    updated_at?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    created_at?: true
    updated_at?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: string
    email: string
    password: string | null
    created_at: Date
    updated_at: Date
    _count: AdminCountAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    created_at?: boolean
    updated_at?: boolean
    authlogs?: boolean | Admin$authlogsArgs<ExtArgs>
    _count?: boolean | AdminCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type AdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "created_at" | "updated_at", ExtArgs["result"]["admin"]>
  export type AdminInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authlogs?: boolean | Admin$authlogsArgs<ExtArgs>
    _count?: boolean | AdminCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AdminIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AdminIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {
      authlogs: Prisma.$Session_audit_trailPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins and returns the data updated in the database.
     * @param {AdminUpdateManyAndReturnArgs} args - Arguments to update many Admins.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    authlogs<T extends Admin$authlogsArgs<ExtArgs> = {}>(args?: Subset<T, Admin$authlogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'String'>
    readonly email: FieldRef<"Admin", 'String'>
    readonly password: FieldRef<"Admin", 'String'>
    readonly created_at: FieldRef<"Admin", 'DateTime'>
    readonly updated_at: FieldRef<"Admin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin updateManyAndReturn
   */
  export type AdminUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to delete.
     */
    limit?: number
  }

  /**
   * Admin.authlogs
   */
  export type Admin$authlogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    where?: Session_audit_trailWhereInput
    orderBy?: Session_audit_trailOrderByWithRelationInput | Session_audit_trailOrderByWithRelationInput[]
    cursor?: Session_audit_trailWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Session_audit_trailScalarFieldEnum | Session_audit_trailScalarFieldEnum[]
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
  }


  /**
   * Model Session_audit_trail
   */

  export type AggregateSession_audit_trail = {
    _count: Session_audit_trailCountAggregateOutputType | null
    _avg: Session_audit_trailAvgAggregateOutputType | null
    _sum: Session_audit_trailSumAggregateOutputType | null
    _min: Session_audit_trailMinAggregateOutputType | null
    _max: Session_audit_trailMaxAggregateOutputType | null
  }

  export type Session_audit_trailAvgAggregateOutputType = {
    id: number | null
  }

  export type Session_audit_trailSumAggregateOutputType = {
    id: number | null
  }

  export type Session_audit_trailMinAggregateOutputType = {
    id: number | null
    admin_id: string | null
    event_type: string | null
    device_type: string | null
    ip_address: string | null
    success: boolean | null
    failure_session: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Session_audit_trailMaxAggregateOutputType = {
    id: number | null
    admin_id: string | null
    event_type: string | null
    device_type: string | null
    ip_address: string | null
    success: boolean | null
    failure_session: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Session_audit_trailCountAggregateOutputType = {
    id: number
    admin_id: number
    event_type: number
    device_type: number
    ip_address: number
    success: number
    failure_session: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Session_audit_trailAvgAggregateInputType = {
    id?: true
  }

  export type Session_audit_trailSumAggregateInputType = {
    id?: true
  }

  export type Session_audit_trailMinAggregateInputType = {
    id?: true
    admin_id?: true
    event_type?: true
    device_type?: true
    ip_address?: true
    success?: true
    failure_session?: true
    created_at?: true
    updated_at?: true
  }

  export type Session_audit_trailMaxAggregateInputType = {
    id?: true
    admin_id?: true
    event_type?: true
    device_type?: true
    ip_address?: true
    success?: true
    failure_session?: true
    created_at?: true
    updated_at?: true
  }

  export type Session_audit_trailCountAggregateInputType = {
    id?: true
    admin_id?: true
    event_type?: true
    device_type?: true
    ip_address?: true
    success?: true
    failure_session?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Session_audit_trailAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session_audit_trail to aggregate.
     */
    where?: Session_audit_trailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Session_audit_trails to fetch.
     */
    orderBy?: Session_audit_trailOrderByWithRelationInput | Session_audit_trailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: Session_audit_trailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Session_audit_trails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Session_audit_trails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Session_audit_trails
    **/
    _count?: true | Session_audit_trailCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Session_audit_trailAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Session_audit_trailSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Session_audit_trailMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Session_audit_trailMaxAggregateInputType
  }

  export type GetSession_audit_trailAggregateType<T extends Session_audit_trailAggregateArgs> = {
        [P in keyof T & keyof AggregateSession_audit_trail]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession_audit_trail[P]>
      : GetScalarType<T[P], AggregateSession_audit_trail[P]>
  }




  export type Session_audit_trailGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Session_audit_trailWhereInput
    orderBy?: Session_audit_trailOrderByWithAggregationInput | Session_audit_trailOrderByWithAggregationInput[]
    by: Session_audit_trailScalarFieldEnum[] | Session_audit_trailScalarFieldEnum
    having?: Session_audit_trailScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Session_audit_trailCountAggregateInputType | true
    _avg?: Session_audit_trailAvgAggregateInputType
    _sum?: Session_audit_trailSumAggregateInputType
    _min?: Session_audit_trailMinAggregateInputType
    _max?: Session_audit_trailMaxAggregateInputType
  }

  export type Session_audit_trailGroupByOutputType = {
    id: number
    admin_id: string
    event_type: string
    device_type: string
    ip_address: string
    success: boolean
    failure_session: string | null
    created_at: Date
    updated_at: Date
    _count: Session_audit_trailCountAggregateOutputType | null
    _avg: Session_audit_trailAvgAggregateOutputType | null
    _sum: Session_audit_trailSumAggregateOutputType | null
    _min: Session_audit_trailMinAggregateOutputType | null
    _max: Session_audit_trailMaxAggregateOutputType | null
  }

  type GetSession_audit_trailGroupByPayload<T extends Session_audit_trailGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Session_audit_trailGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Session_audit_trailGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Session_audit_trailGroupByOutputType[P]>
            : GetScalarType<T[P], Session_audit_trailGroupByOutputType[P]>
        }
      >
    >


  export type Session_audit_trailSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    event_type?: boolean
    device_type?: boolean
    ip_address?: boolean
    success?: boolean
    failure_session?: boolean
    created_at?: boolean
    updated_at?: boolean
    admin?: boolean | Session_audit_trail$adminArgs<ExtArgs>
  }, ExtArgs["result"]["session_audit_trail"]>

  export type Session_audit_trailSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    event_type?: boolean
    device_type?: boolean
    ip_address?: boolean
    success?: boolean
    failure_session?: boolean
    created_at?: boolean
    updated_at?: boolean
    admin?: boolean | Session_audit_trail$adminArgs<ExtArgs>
  }, ExtArgs["result"]["session_audit_trail"]>

  export type Session_audit_trailSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    event_type?: boolean
    device_type?: boolean
    ip_address?: boolean
    success?: boolean
    failure_session?: boolean
    created_at?: boolean
    updated_at?: boolean
    admin?: boolean | Session_audit_trail$adminArgs<ExtArgs>
  }, ExtArgs["result"]["session_audit_trail"]>

  export type Session_audit_trailSelectScalar = {
    id?: boolean
    admin_id?: boolean
    event_type?: boolean
    device_type?: boolean
    ip_address?: boolean
    success?: boolean
    failure_session?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type Session_audit_trailOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "event_type" | "device_type" | "ip_address" | "success" | "failure_session" | "created_at" | "updated_at", ExtArgs["result"]["session_audit_trail"]>
  export type Session_audit_trailInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | Session_audit_trail$adminArgs<ExtArgs>
  }
  export type Session_audit_trailIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | Session_audit_trail$adminArgs<ExtArgs>
  }
  export type Session_audit_trailIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | Session_audit_trail$adminArgs<ExtArgs>
  }

  export type $Session_audit_trailPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session_audit_trail"
    objects: {
      admin: Prisma.$AdminPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: string
      event_type: string
      device_type: string
      ip_address: string
      success: boolean
      failure_session: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["session_audit_trail"]>
    composites: {}
  }

  type Session_audit_trailGetPayload<S extends boolean | null | undefined | Session_audit_trailDefaultArgs> = $Result.GetResult<Prisma.$Session_audit_trailPayload, S>

  type Session_audit_trailCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<Session_audit_trailFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Session_audit_trailCountAggregateInputType | true
    }

  export interface Session_audit_trailDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session_audit_trail'], meta: { name: 'Session_audit_trail' } }
    /**
     * Find zero or one Session_audit_trail that matches the filter.
     * @param {Session_audit_trailFindUniqueArgs} args - Arguments to find a Session_audit_trail
     * @example
     * // Get one Session_audit_trail
     * const session_audit_trail = await prisma.session_audit_trail.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Session_audit_trailFindUniqueArgs>(args: SelectSubset<T, Session_audit_trailFindUniqueArgs<ExtArgs>>): Prisma__Session_audit_trailClient<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session_audit_trail that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {Session_audit_trailFindUniqueOrThrowArgs} args - Arguments to find a Session_audit_trail
     * @example
     * // Get one Session_audit_trail
     * const session_audit_trail = await prisma.session_audit_trail.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Session_audit_trailFindUniqueOrThrowArgs>(args: SelectSubset<T, Session_audit_trailFindUniqueOrThrowArgs<ExtArgs>>): Prisma__Session_audit_trailClient<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session_audit_trail that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_audit_trailFindFirstArgs} args - Arguments to find a Session_audit_trail
     * @example
     * // Get one Session_audit_trail
     * const session_audit_trail = await prisma.session_audit_trail.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Session_audit_trailFindFirstArgs>(args?: SelectSubset<T, Session_audit_trailFindFirstArgs<ExtArgs>>): Prisma__Session_audit_trailClient<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session_audit_trail that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_audit_trailFindFirstOrThrowArgs} args - Arguments to find a Session_audit_trail
     * @example
     * // Get one Session_audit_trail
     * const session_audit_trail = await prisma.session_audit_trail.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Session_audit_trailFindFirstOrThrowArgs>(args?: SelectSubset<T, Session_audit_trailFindFirstOrThrowArgs<ExtArgs>>): Prisma__Session_audit_trailClient<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Session_audit_trails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_audit_trailFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Session_audit_trails
     * const session_audit_trails = await prisma.session_audit_trail.findMany()
     * 
     * // Get first 10 Session_audit_trails
     * const session_audit_trails = await prisma.session_audit_trail.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const session_audit_trailWithIdOnly = await prisma.session_audit_trail.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends Session_audit_trailFindManyArgs>(args?: SelectSubset<T, Session_audit_trailFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session_audit_trail.
     * @param {Session_audit_trailCreateArgs} args - Arguments to create a Session_audit_trail.
     * @example
     * // Create one Session_audit_trail
     * const Session_audit_trail = await prisma.session_audit_trail.create({
     *   data: {
     *     // ... data to create a Session_audit_trail
     *   }
     * })
     * 
     */
    create<T extends Session_audit_trailCreateArgs>(args: SelectSubset<T, Session_audit_trailCreateArgs<ExtArgs>>): Prisma__Session_audit_trailClient<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Session_audit_trails.
     * @param {Session_audit_trailCreateManyArgs} args - Arguments to create many Session_audit_trails.
     * @example
     * // Create many Session_audit_trails
     * const session_audit_trail = await prisma.session_audit_trail.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends Session_audit_trailCreateManyArgs>(args?: SelectSubset<T, Session_audit_trailCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Session_audit_trails and returns the data saved in the database.
     * @param {Session_audit_trailCreateManyAndReturnArgs} args - Arguments to create many Session_audit_trails.
     * @example
     * // Create many Session_audit_trails
     * const session_audit_trail = await prisma.session_audit_trail.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Session_audit_trails and only return the `id`
     * const session_audit_trailWithIdOnly = await prisma.session_audit_trail.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends Session_audit_trailCreateManyAndReturnArgs>(args?: SelectSubset<T, Session_audit_trailCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session_audit_trail.
     * @param {Session_audit_trailDeleteArgs} args - Arguments to delete one Session_audit_trail.
     * @example
     * // Delete one Session_audit_trail
     * const Session_audit_trail = await prisma.session_audit_trail.delete({
     *   where: {
     *     // ... filter to delete one Session_audit_trail
     *   }
     * })
     * 
     */
    delete<T extends Session_audit_trailDeleteArgs>(args: SelectSubset<T, Session_audit_trailDeleteArgs<ExtArgs>>): Prisma__Session_audit_trailClient<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session_audit_trail.
     * @param {Session_audit_trailUpdateArgs} args - Arguments to update one Session_audit_trail.
     * @example
     * // Update one Session_audit_trail
     * const session_audit_trail = await prisma.session_audit_trail.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends Session_audit_trailUpdateArgs>(args: SelectSubset<T, Session_audit_trailUpdateArgs<ExtArgs>>): Prisma__Session_audit_trailClient<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Session_audit_trails.
     * @param {Session_audit_trailDeleteManyArgs} args - Arguments to filter Session_audit_trails to delete.
     * @example
     * // Delete a few Session_audit_trails
     * const { count } = await prisma.session_audit_trail.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends Session_audit_trailDeleteManyArgs>(args?: SelectSubset<T, Session_audit_trailDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Session_audit_trails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_audit_trailUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Session_audit_trails
     * const session_audit_trail = await prisma.session_audit_trail.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends Session_audit_trailUpdateManyArgs>(args: SelectSubset<T, Session_audit_trailUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Session_audit_trails and returns the data updated in the database.
     * @param {Session_audit_trailUpdateManyAndReturnArgs} args - Arguments to update many Session_audit_trails.
     * @example
     * // Update many Session_audit_trails
     * const session_audit_trail = await prisma.session_audit_trail.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Session_audit_trails and only return the `id`
     * const session_audit_trailWithIdOnly = await prisma.session_audit_trail.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends Session_audit_trailUpdateManyAndReturnArgs>(args: SelectSubset<T, Session_audit_trailUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session_audit_trail.
     * @param {Session_audit_trailUpsertArgs} args - Arguments to update or create a Session_audit_trail.
     * @example
     * // Update or create a Session_audit_trail
     * const session_audit_trail = await prisma.session_audit_trail.upsert({
     *   create: {
     *     // ... data to create a Session_audit_trail
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session_audit_trail we want to update
     *   }
     * })
     */
    upsert<T extends Session_audit_trailUpsertArgs>(args: SelectSubset<T, Session_audit_trailUpsertArgs<ExtArgs>>): Prisma__Session_audit_trailClient<$Result.GetResult<Prisma.$Session_audit_trailPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Session_audit_trails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_audit_trailCountArgs} args - Arguments to filter Session_audit_trails to count.
     * @example
     * // Count the number of Session_audit_trails
     * const count = await prisma.session_audit_trail.count({
     *   where: {
     *     // ... the filter for the Session_audit_trails we want to count
     *   }
     * })
    **/
    count<T extends Session_audit_trailCountArgs>(
      args?: Subset<T, Session_audit_trailCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Session_audit_trailCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session_audit_trail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_audit_trailAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Session_audit_trailAggregateArgs>(args: Subset<T, Session_audit_trailAggregateArgs>): Prisma.PrismaPromise<GetSession_audit_trailAggregateType<T>>

    /**
     * Group by Session_audit_trail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Session_audit_trailGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Session_audit_trailGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Session_audit_trailGroupByArgs['orderBy'] }
        : { orderBy?: Session_audit_trailGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Session_audit_trailGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSession_audit_trailGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session_audit_trail model
   */
  readonly fields: Session_audit_trailFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session_audit_trail.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__Session_audit_trailClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admin<T extends Session_audit_trail$adminArgs<ExtArgs> = {}>(args?: Subset<T, Session_audit_trail$adminArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session_audit_trail model
   */
  interface Session_audit_trailFieldRefs {
    readonly id: FieldRef<"Session_audit_trail", 'Int'>
    readonly admin_id: FieldRef<"Session_audit_trail", 'String'>
    readonly event_type: FieldRef<"Session_audit_trail", 'String'>
    readonly device_type: FieldRef<"Session_audit_trail", 'String'>
    readonly ip_address: FieldRef<"Session_audit_trail", 'String'>
    readonly success: FieldRef<"Session_audit_trail", 'Boolean'>
    readonly failure_session: FieldRef<"Session_audit_trail", 'String'>
    readonly created_at: FieldRef<"Session_audit_trail", 'DateTime'>
    readonly updated_at: FieldRef<"Session_audit_trail", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session_audit_trail findUnique
   */
  export type Session_audit_trailFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * Filter, which Session_audit_trail to fetch.
     */
    where: Session_audit_trailWhereUniqueInput
  }

  /**
   * Session_audit_trail findUniqueOrThrow
   */
  export type Session_audit_trailFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * Filter, which Session_audit_trail to fetch.
     */
    where: Session_audit_trailWhereUniqueInput
  }

  /**
   * Session_audit_trail findFirst
   */
  export type Session_audit_trailFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * Filter, which Session_audit_trail to fetch.
     */
    where?: Session_audit_trailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Session_audit_trails to fetch.
     */
    orderBy?: Session_audit_trailOrderByWithRelationInput | Session_audit_trailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Session_audit_trails.
     */
    cursor?: Session_audit_trailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Session_audit_trails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Session_audit_trails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Session_audit_trails.
     */
    distinct?: Session_audit_trailScalarFieldEnum | Session_audit_trailScalarFieldEnum[]
  }

  /**
   * Session_audit_trail findFirstOrThrow
   */
  export type Session_audit_trailFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * Filter, which Session_audit_trail to fetch.
     */
    where?: Session_audit_trailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Session_audit_trails to fetch.
     */
    orderBy?: Session_audit_trailOrderByWithRelationInput | Session_audit_trailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Session_audit_trails.
     */
    cursor?: Session_audit_trailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Session_audit_trails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Session_audit_trails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Session_audit_trails.
     */
    distinct?: Session_audit_trailScalarFieldEnum | Session_audit_trailScalarFieldEnum[]
  }

  /**
   * Session_audit_trail findMany
   */
  export type Session_audit_trailFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * Filter, which Session_audit_trails to fetch.
     */
    where?: Session_audit_trailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Session_audit_trails to fetch.
     */
    orderBy?: Session_audit_trailOrderByWithRelationInput | Session_audit_trailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Session_audit_trails.
     */
    cursor?: Session_audit_trailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Session_audit_trails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Session_audit_trails.
     */
    skip?: number
    distinct?: Session_audit_trailScalarFieldEnum | Session_audit_trailScalarFieldEnum[]
  }

  /**
   * Session_audit_trail create
   */
  export type Session_audit_trailCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * The data needed to create a Session_audit_trail.
     */
    data: XOR<Session_audit_trailCreateInput, Session_audit_trailUncheckedCreateInput>
  }

  /**
   * Session_audit_trail createMany
   */
  export type Session_audit_trailCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Session_audit_trails.
     */
    data: Session_audit_trailCreateManyInput | Session_audit_trailCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session_audit_trail createManyAndReturn
   */
  export type Session_audit_trailCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * The data used to create many Session_audit_trails.
     */
    data: Session_audit_trailCreateManyInput | Session_audit_trailCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session_audit_trail update
   */
  export type Session_audit_trailUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * The data needed to update a Session_audit_trail.
     */
    data: XOR<Session_audit_trailUpdateInput, Session_audit_trailUncheckedUpdateInput>
    /**
     * Choose, which Session_audit_trail to update.
     */
    where: Session_audit_trailWhereUniqueInput
  }

  /**
   * Session_audit_trail updateMany
   */
  export type Session_audit_trailUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Session_audit_trails.
     */
    data: XOR<Session_audit_trailUpdateManyMutationInput, Session_audit_trailUncheckedUpdateManyInput>
    /**
     * Filter which Session_audit_trails to update
     */
    where?: Session_audit_trailWhereInput
    /**
     * Limit how many Session_audit_trails to update.
     */
    limit?: number
  }

  /**
   * Session_audit_trail updateManyAndReturn
   */
  export type Session_audit_trailUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * The data used to update Session_audit_trails.
     */
    data: XOR<Session_audit_trailUpdateManyMutationInput, Session_audit_trailUncheckedUpdateManyInput>
    /**
     * Filter which Session_audit_trails to update
     */
    where?: Session_audit_trailWhereInput
    /**
     * Limit how many Session_audit_trails to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session_audit_trail upsert
   */
  export type Session_audit_trailUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * The filter to search for the Session_audit_trail to update in case it exists.
     */
    where: Session_audit_trailWhereUniqueInput
    /**
     * In case the Session_audit_trail found by the `where` argument doesn't exist, create a new Session_audit_trail with this data.
     */
    create: XOR<Session_audit_trailCreateInput, Session_audit_trailUncheckedCreateInput>
    /**
     * In case the Session_audit_trail was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Session_audit_trailUpdateInput, Session_audit_trailUncheckedUpdateInput>
  }

  /**
   * Session_audit_trail delete
   */
  export type Session_audit_trailDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
    /**
     * Filter which Session_audit_trail to delete.
     */
    where: Session_audit_trailWhereUniqueInput
  }

  /**
   * Session_audit_trail deleteMany
   */
  export type Session_audit_trailDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session_audit_trails to delete
     */
    where?: Session_audit_trailWhereInput
    /**
     * Limit how many Session_audit_trails to delete.
     */
    limit?: number
  }

  /**
   * Session_audit_trail.admin
   */
  export type Session_audit_trail$adminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null
    where?: AdminWhereInput
  }

  /**
   * Session_audit_trail without action
   */
  export type Session_audit_trailDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session_audit_trail
     */
    select?: Session_audit_trailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session_audit_trail
     */
    omit?: Session_audit_trailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Session_audit_trailInclude<ExtArgs> | null
  }


  /**
   * Model CategoryOnArticle
   */

  export type AggregateCategoryOnArticle = {
    _count: CategoryOnArticleCountAggregateOutputType | null
    _avg: CategoryOnArticleAvgAggregateOutputType | null
    _sum: CategoryOnArticleSumAggregateOutputType | null
    _min: CategoryOnArticleMinAggregateOutputType | null
    _max: CategoryOnArticleMaxAggregateOutputType | null
  }

  export type CategoryOnArticleAvgAggregateOutputType = {
    category_id: number | null
    article_id: number | null
  }

  export type CategoryOnArticleSumAggregateOutputType = {
    category_id: number | null
    article_id: number | null
  }

  export type CategoryOnArticleMinAggregateOutputType = {
    category_id: number | null
    article_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CategoryOnArticleMaxAggregateOutputType = {
    category_id: number | null
    article_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CategoryOnArticleCountAggregateOutputType = {
    category_id: number
    article_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CategoryOnArticleAvgAggregateInputType = {
    category_id?: true
    article_id?: true
  }

  export type CategoryOnArticleSumAggregateInputType = {
    category_id?: true
    article_id?: true
  }

  export type CategoryOnArticleMinAggregateInputType = {
    category_id?: true
    article_id?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoryOnArticleMaxAggregateInputType = {
    category_id?: true
    article_id?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoryOnArticleCountAggregateInputType = {
    category_id?: true
    article_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CategoryOnArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoryOnArticle to aggregate.
     */
    where?: CategoryOnArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryOnArticles to fetch.
     */
    orderBy?: CategoryOnArticleOrderByWithRelationInput | CategoryOnArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryOnArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryOnArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryOnArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CategoryOnArticles
    **/
    _count?: true | CategoryOnArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryOnArticleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategoryOnArticleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryOnArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryOnArticleMaxAggregateInputType
  }

  export type GetCategoryOnArticleAggregateType<T extends CategoryOnArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateCategoryOnArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategoryOnArticle[P]>
      : GetScalarType<T[P], AggregateCategoryOnArticle[P]>
  }




  export type CategoryOnArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryOnArticleWhereInput
    orderBy?: CategoryOnArticleOrderByWithAggregationInput | CategoryOnArticleOrderByWithAggregationInput[]
    by: CategoryOnArticleScalarFieldEnum[] | CategoryOnArticleScalarFieldEnum
    having?: CategoryOnArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryOnArticleCountAggregateInputType | true
    _avg?: CategoryOnArticleAvgAggregateInputType
    _sum?: CategoryOnArticleSumAggregateInputType
    _min?: CategoryOnArticleMinAggregateInputType
    _max?: CategoryOnArticleMaxAggregateInputType
  }

  export type CategoryOnArticleGroupByOutputType = {
    category_id: number
    article_id: number
    created_at: Date
    updated_at: Date
    _count: CategoryOnArticleCountAggregateOutputType | null
    _avg: CategoryOnArticleAvgAggregateOutputType | null
    _sum: CategoryOnArticleSumAggregateOutputType | null
    _min: CategoryOnArticleMinAggregateOutputType | null
    _max: CategoryOnArticleMaxAggregateOutputType | null
  }

  type GetCategoryOnArticleGroupByPayload<T extends CategoryOnArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryOnArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryOnArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryOnArticleGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryOnArticleGroupByOutputType[P]>
        }
      >
    >


  export type CategoryOnArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    category_id?: boolean
    article_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    article?: boolean | CategoryOnArticle$articleArgs<ExtArgs>
    category?: boolean | CategoryOnArticle$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["categoryOnArticle"]>

  export type CategoryOnArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    category_id?: boolean
    article_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    article?: boolean | CategoryOnArticle$articleArgs<ExtArgs>
    category?: boolean | CategoryOnArticle$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["categoryOnArticle"]>

  export type CategoryOnArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    category_id?: boolean
    article_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    article?: boolean | CategoryOnArticle$articleArgs<ExtArgs>
    category?: boolean | CategoryOnArticle$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["categoryOnArticle"]>

  export type CategoryOnArticleSelectScalar = {
    category_id?: boolean
    article_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type CategoryOnArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"category_id" | "article_id" | "created_at" | "updated_at", ExtArgs["result"]["categoryOnArticle"]>
  export type CategoryOnArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | CategoryOnArticle$articleArgs<ExtArgs>
    category?: boolean | CategoryOnArticle$categoryArgs<ExtArgs>
  }
  export type CategoryOnArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | CategoryOnArticle$articleArgs<ExtArgs>
    category?: boolean | CategoryOnArticle$categoryArgs<ExtArgs>
  }
  export type CategoryOnArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | CategoryOnArticle$articleArgs<ExtArgs>
    category?: boolean | CategoryOnArticle$categoryArgs<ExtArgs>
  }

  export type $CategoryOnArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CategoryOnArticle"
    objects: {
      article: Prisma.$ArticlePayload<ExtArgs> | null
      category: Prisma.$CategoryPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      category_id: number
      article_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["categoryOnArticle"]>
    composites: {}
  }

  type CategoryOnArticleGetPayload<S extends boolean | null | undefined | CategoryOnArticleDefaultArgs> = $Result.GetResult<Prisma.$CategoryOnArticlePayload, S>

  type CategoryOnArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryOnArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryOnArticleCountAggregateInputType | true
    }

  export interface CategoryOnArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CategoryOnArticle'], meta: { name: 'CategoryOnArticle' } }
    /**
     * Find zero or one CategoryOnArticle that matches the filter.
     * @param {CategoryOnArticleFindUniqueArgs} args - Arguments to find a CategoryOnArticle
     * @example
     * // Get one CategoryOnArticle
     * const categoryOnArticle = await prisma.categoryOnArticle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryOnArticleFindUniqueArgs>(args: SelectSubset<T, CategoryOnArticleFindUniqueArgs<ExtArgs>>): Prisma__CategoryOnArticleClient<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CategoryOnArticle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryOnArticleFindUniqueOrThrowArgs} args - Arguments to find a CategoryOnArticle
     * @example
     * // Get one CategoryOnArticle
     * const categoryOnArticle = await prisma.categoryOnArticle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryOnArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryOnArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryOnArticleClient<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CategoryOnArticle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryOnArticleFindFirstArgs} args - Arguments to find a CategoryOnArticle
     * @example
     * // Get one CategoryOnArticle
     * const categoryOnArticle = await prisma.categoryOnArticle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryOnArticleFindFirstArgs>(args?: SelectSubset<T, CategoryOnArticleFindFirstArgs<ExtArgs>>): Prisma__CategoryOnArticleClient<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CategoryOnArticle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryOnArticleFindFirstOrThrowArgs} args - Arguments to find a CategoryOnArticle
     * @example
     * // Get one CategoryOnArticle
     * const categoryOnArticle = await prisma.categoryOnArticle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryOnArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryOnArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryOnArticleClient<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CategoryOnArticles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryOnArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CategoryOnArticles
     * const categoryOnArticles = await prisma.categoryOnArticle.findMany()
     * 
     * // Get first 10 CategoryOnArticles
     * const categoryOnArticles = await prisma.categoryOnArticle.findMany({ take: 10 })
     * 
     * // Only select the `category_id`
     * const categoryOnArticleWithCategory_idOnly = await prisma.categoryOnArticle.findMany({ select: { category_id: true } })
     * 
     */
    findMany<T extends CategoryOnArticleFindManyArgs>(args?: SelectSubset<T, CategoryOnArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CategoryOnArticle.
     * @param {CategoryOnArticleCreateArgs} args - Arguments to create a CategoryOnArticle.
     * @example
     * // Create one CategoryOnArticle
     * const CategoryOnArticle = await prisma.categoryOnArticle.create({
     *   data: {
     *     // ... data to create a CategoryOnArticle
     *   }
     * })
     * 
     */
    create<T extends CategoryOnArticleCreateArgs>(args: SelectSubset<T, CategoryOnArticleCreateArgs<ExtArgs>>): Prisma__CategoryOnArticleClient<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CategoryOnArticles.
     * @param {CategoryOnArticleCreateManyArgs} args - Arguments to create many CategoryOnArticles.
     * @example
     * // Create many CategoryOnArticles
     * const categoryOnArticle = await prisma.categoryOnArticle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryOnArticleCreateManyArgs>(args?: SelectSubset<T, CategoryOnArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CategoryOnArticles and returns the data saved in the database.
     * @param {CategoryOnArticleCreateManyAndReturnArgs} args - Arguments to create many CategoryOnArticles.
     * @example
     * // Create many CategoryOnArticles
     * const categoryOnArticle = await prisma.categoryOnArticle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CategoryOnArticles and only return the `category_id`
     * const categoryOnArticleWithCategory_idOnly = await prisma.categoryOnArticle.createManyAndReturn({
     *   select: { category_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryOnArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryOnArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CategoryOnArticle.
     * @param {CategoryOnArticleDeleteArgs} args - Arguments to delete one CategoryOnArticle.
     * @example
     * // Delete one CategoryOnArticle
     * const CategoryOnArticle = await prisma.categoryOnArticle.delete({
     *   where: {
     *     // ... filter to delete one CategoryOnArticle
     *   }
     * })
     * 
     */
    delete<T extends CategoryOnArticleDeleteArgs>(args: SelectSubset<T, CategoryOnArticleDeleteArgs<ExtArgs>>): Prisma__CategoryOnArticleClient<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CategoryOnArticle.
     * @param {CategoryOnArticleUpdateArgs} args - Arguments to update one CategoryOnArticle.
     * @example
     * // Update one CategoryOnArticle
     * const categoryOnArticle = await prisma.categoryOnArticle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryOnArticleUpdateArgs>(args: SelectSubset<T, CategoryOnArticleUpdateArgs<ExtArgs>>): Prisma__CategoryOnArticleClient<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CategoryOnArticles.
     * @param {CategoryOnArticleDeleteManyArgs} args - Arguments to filter CategoryOnArticles to delete.
     * @example
     * // Delete a few CategoryOnArticles
     * const { count } = await prisma.categoryOnArticle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryOnArticleDeleteManyArgs>(args?: SelectSubset<T, CategoryOnArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CategoryOnArticles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryOnArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CategoryOnArticles
     * const categoryOnArticle = await prisma.categoryOnArticle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryOnArticleUpdateManyArgs>(args: SelectSubset<T, CategoryOnArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CategoryOnArticles and returns the data updated in the database.
     * @param {CategoryOnArticleUpdateManyAndReturnArgs} args - Arguments to update many CategoryOnArticles.
     * @example
     * // Update many CategoryOnArticles
     * const categoryOnArticle = await prisma.categoryOnArticle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CategoryOnArticles and only return the `category_id`
     * const categoryOnArticleWithCategory_idOnly = await prisma.categoryOnArticle.updateManyAndReturn({
     *   select: { category_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryOnArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryOnArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CategoryOnArticle.
     * @param {CategoryOnArticleUpsertArgs} args - Arguments to update or create a CategoryOnArticle.
     * @example
     * // Update or create a CategoryOnArticle
     * const categoryOnArticle = await prisma.categoryOnArticle.upsert({
     *   create: {
     *     // ... data to create a CategoryOnArticle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CategoryOnArticle we want to update
     *   }
     * })
     */
    upsert<T extends CategoryOnArticleUpsertArgs>(args: SelectSubset<T, CategoryOnArticleUpsertArgs<ExtArgs>>): Prisma__CategoryOnArticleClient<$Result.GetResult<Prisma.$CategoryOnArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CategoryOnArticles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryOnArticleCountArgs} args - Arguments to filter CategoryOnArticles to count.
     * @example
     * // Count the number of CategoryOnArticles
     * const count = await prisma.categoryOnArticle.count({
     *   where: {
     *     // ... the filter for the CategoryOnArticles we want to count
     *   }
     * })
    **/
    count<T extends CategoryOnArticleCountArgs>(
      args?: Subset<T, CategoryOnArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryOnArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CategoryOnArticle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryOnArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryOnArticleAggregateArgs>(args: Subset<T, CategoryOnArticleAggregateArgs>): Prisma.PrismaPromise<GetCategoryOnArticleAggregateType<T>>

    /**
     * Group by CategoryOnArticle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryOnArticleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryOnArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryOnArticleGroupByArgs['orderBy'] }
        : { orderBy?: CategoryOnArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryOnArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryOnArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CategoryOnArticle model
   */
  readonly fields: CategoryOnArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CategoryOnArticle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryOnArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends CategoryOnArticle$articleArgs<ExtArgs> = {}>(args?: Subset<T, CategoryOnArticle$articleArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    category<T extends CategoryOnArticle$categoryArgs<ExtArgs> = {}>(args?: Subset<T, CategoryOnArticle$categoryArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CategoryOnArticle model
   */
  interface CategoryOnArticleFieldRefs {
    readonly category_id: FieldRef<"CategoryOnArticle", 'Int'>
    readonly article_id: FieldRef<"CategoryOnArticle", 'Int'>
    readonly created_at: FieldRef<"CategoryOnArticle", 'DateTime'>
    readonly updated_at: FieldRef<"CategoryOnArticle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CategoryOnArticle findUnique
   */
  export type CategoryOnArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * Filter, which CategoryOnArticle to fetch.
     */
    where: CategoryOnArticleWhereUniqueInput
  }

  /**
   * CategoryOnArticle findUniqueOrThrow
   */
  export type CategoryOnArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * Filter, which CategoryOnArticle to fetch.
     */
    where: CategoryOnArticleWhereUniqueInput
  }

  /**
   * CategoryOnArticle findFirst
   */
  export type CategoryOnArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * Filter, which CategoryOnArticle to fetch.
     */
    where?: CategoryOnArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryOnArticles to fetch.
     */
    orderBy?: CategoryOnArticleOrderByWithRelationInput | CategoryOnArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoryOnArticles.
     */
    cursor?: CategoryOnArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryOnArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryOnArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryOnArticles.
     */
    distinct?: CategoryOnArticleScalarFieldEnum | CategoryOnArticleScalarFieldEnum[]
  }

  /**
   * CategoryOnArticle findFirstOrThrow
   */
  export type CategoryOnArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * Filter, which CategoryOnArticle to fetch.
     */
    where?: CategoryOnArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryOnArticles to fetch.
     */
    orderBy?: CategoryOnArticleOrderByWithRelationInput | CategoryOnArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoryOnArticles.
     */
    cursor?: CategoryOnArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryOnArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryOnArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoryOnArticles.
     */
    distinct?: CategoryOnArticleScalarFieldEnum | CategoryOnArticleScalarFieldEnum[]
  }

  /**
   * CategoryOnArticle findMany
   */
  export type CategoryOnArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * Filter, which CategoryOnArticles to fetch.
     */
    where?: CategoryOnArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoryOnArticles to fetch.
     */
    orderBy?: CategoryOnArticleOrderByWithRelationInput | CategoryOnArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CategoryOnArticles.
     */
    cursor?: CategoryOnArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoryOnArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoryOnArticles.
     */
    skip?: number
    distinct?: CategoryOnArticleScalarFieldEnum | CategoryOnArticleScalarFieldEnum[]
  }

  /**
   * CategoryOnArticle create
   */
  export type CategoryOnArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a CategoryOnArticle.
     */
    data: XOR<CategoryOnArticleCreateInput, CategoryOnArticleUncheckedCreateInput>
  }

  /**
   * CategoryOnArticle createMany
   */
  export type CategoryOnArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CategoryOnArticles.
     */
    data: CategoryOnArticleCreateManyInput | CategoryOnArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CategoryOnArticle createManyAndReturn
   */
  export type CategoryOnArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * The data used to create many CategoryOnArticles.
     */
    data: CategoryOnArticleCreateManyInput | CategoryOnArticleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CategoryOnArticle update
   */
  export type CategoryOnArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a CategoryOnArticle.
     */
    data: XOR<CategoryOnArticleUpdateInput, CategoryOnArticleUncheckedUpdateInput>
    /**
     * Choose, which CategoryOnArticle to update.
     */
    where: CategoryOnArticleWhereUniqueInput
  }

  /**
   * CategoryOnArticle updateMany
   */
  export type CategoryOnArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CategoryOnArticles.
     */
    data: XOR<CategoryOnArticleUpdateManyMutationInput, CategoryOnArticleUncheckedUpdateManyInput>
    /**
     * Filter which CategoryOnArticles to update
     */
    where?: CategoryOnArticleWhereInput
    /**
     * Limit how many CategoryOnArticles to update.
     */
    limit?: number
  }

  /**
   * CategoryOnArticle updateManyAndReturn
   */
  export type CategoryOnArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * The data used to update CategoryOnArticles.
     */
    data: XOR<CategoryOnArticleUpdateManyMutationInput, CategoryOnArticleUncheckedUpdateManyInput>
    /**
     * Filter which CategoryOnArticles to update
     */
    where?: CategoryOnArticleWhereInput
    /**
     * Limit how many CategoryOnArticles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CategoryOnArticle upsert
   */
  export type CategoryOnArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the CategoryOnArticle to update in case it exists.
     */
    where: CategoryOnArticleWhereUniqueInput
    /**
     * In case the CategoryOnArticle found by the `where` argument doesn't exist, create a new CategoryOnArticle with this data.
     */
    create: XOR<CategoryOnArticleCreateInput, CategoryOnArticleUncheckedCreateInput>
    /**
     * In case the CategoryOnArticle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryOnArticleUpdateInput, CategoryOnArticleUncheckedUpdateInput>
  }

  /**
   * CategoryOnArticle delete
   */
  export type CategoryOnArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
    /**
     * Filter which CategoryOnArticle to delete.
     */
    where: CategoryOnArticleWhereUniqueInput
  }

  /**
   * CategoryOnArticle deleteMany
   */
  export type CategoryOnArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoryOnArticles to delete
     */
    where?: CategoryOnArticleWhereInput
    /**
     * Limit how many CategoryOnArticles to delete.
     */
    limit?: number
  }

  /**
   * CategoryOnArticle.article
   */
  export type CategoryOnArticle$articleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    where?: ArticleWhereInput
  }

  /**
   * CategoryOnArticle.category
   */
  export type CategoryOnArticle$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * CategoryOnArticle without action
   */
  export type CategoryOnArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryOnArticle
     */
    select?: CategoryOnArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CategoryOnArticle
     */
    omit?: CategoryOnArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryOnArticleInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ArticleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    image: 'image',
    base_views: 'base_views',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const AdminScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const Session_audit_trailScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    event_type: 'event_type',
    device_type: 'device_type',
    ip_address: 'ip_address',
    success: 'success',
    failure_session: 'failure_session',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Session_audit_trailScalarFieldEnum = (typeof Session_audit_trailScalarFieldEnum)[keyof typeof Session_audit_trailScalarFieldEnum]


  export const CategoryOnArticleScalarFieldEnum: {
    category_id: 'category_id',
    article_id: 'article_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CategoryOnArticleScalarFieldEnum = (typeof CategoryOnArticleScalarFieldEnum)[keyof typeof CategoryOnArticleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ArticleWhereInput = {
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    id?: IntFilter<"Article"> | number
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    image?: StringNullableFilter<"Article"> | string | null
    base_views?: IntFilter<"Article"> | number
    created_at?: DateTimeFilter<"Article"> | Date | string
    updated_at?: DateTimeFilter<"Article"> | Date | string
    category?: CategoryOnArticleListRelationFilter
  }

  export type ArticleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    image?: SortOrderInput | SortOrder
    base_views?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    category?: CategoryOnArticleOrderByRelationAggregateInput
  }

  export type ArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    image?: StringNullableFilter<"Article"> | string | null
    base_views?: IntFilter<"Article"> | number
    created_at?: DateTimeFilter<"Article"> | Date | string
    updated_at?: DateTimeFilter<"Article"> | Date | string
    category?: CategoryOnArticleListRelationFilter
  }, "id">

  export type ArticleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    image?: SortOrderInput | SortOrder
    base_views?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ArticleCountOrderByAggregateInput
    _avg?: ArticleAvgOrderByAggregateInput
    _max?: ArticleMaxOrderByAggregateInput
    _min?: ArticleMinOrderByAggregateInput
    _sum?: ArticleSumOrderByAggregateInput
  }

  export type ArticleScalarWhereWithAggregatesInput = {
    AND?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    OR?: ArticleScalarWhereWithAggregatesInput[]
    NOT?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Article"> | number
    title?: StringWithAggregatesFilter<"Article"> | string
    content?: StringWithAggregatesFilter<"Article"> | string
    image?: StringNullableWithAggregatesFilter<"Article"> | string | null
    base_views?: IntWithAggregatesFilter<"Article"> | number
    created_at?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Article"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    created_at?: DateTimeFilter<"Category"> | Date | string
    updated_at?: DateTimeFilter<"Category"> | Date | string
    article?: CategoryOnArticleListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    article?: CategoryOnArticleOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    name?: StringFilter<"Category"> | string
    created_at?: DateTimeFilter<"Category"> | Date | string
    updated_at?: DateTimeFilter<"Category"> | Date | string
    article?: CategoryOnArticleListRelationFilter
  }, "id">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
    created_at?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: StringFilter<"Admin"> | string
    email?: StringFilter<"Admin"> | string
    password?: StringNullableFilter<"Admin"> | string | null
    created_at?: DateTimeFilter<"Admin"> | Date | string
    updated_at?: DateTimeFilter<"Admin"> | Date | string
    authlogs?: Session_audit_trailListRelationFilter
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    authlogs?: Session_audit_trailOrderByRelationAggregateInput
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    password?: StringNullableFilter<"Admin"> | string | null
    created_at?: DateTimeFilter<"Admin"> | Date | string
    updated_at?: DateTimeFilter<"Admin"> | Date | string
    authlogs?: Session_audit_trailListRelationFilter
  }, "id" | "email">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Admin"> | string
    email?: StringWithAggregatesFilter<"Admin"> | string
    password?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
  }

  export type Session_audit_trailWhereInput = {
    AND?: Session_audit_trailWhereInput | Session_audit_trailWhereInput[]
    OR?: Session_audit_trailWhereInput[]
    NOT?: Session_audit_trailWhereInput | Session_audit_trailWhereInput[]
    id?: IntFilter<"Session_audit_trail"> | number
    admin_id?: StringFilter<"Session_audit_trail"> | string
    event_type?: StringFilter<"Session_audit_trail"> | string
    device_type?: StringFilter<"Session_audit_trail"> | string
    ip_address?: StringFilter<"Session_audit_trail"> | string
    success?: BoolFilter<"Session_audit_trail"> | boolean
    failure_session?: StringNullableFilter<"Session_audit_trail"> | string | null
    created_at?: DateTimeFilter<"Session_audit_trail"> | Date | string
    updated_at?: DateTimeFilter<"Session_audit_trail"> | Date | string
    admin?: XOR<AdminNullableScalarRelationFilter, AdminWhereInput> | null
  }

  export type Session_audit_trailOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    event_type?: SortOrder
    device_type?: SortOrder
    ip_address?: SortOrder
    success?: SortOrder
    failure_session?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    admin?: AdminOrderByWithRelationInput
  }

  export type Session_audit_trailWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: Session_audit_trailWhereInput | Session_audit_trailWhereInput[]
    OR?: Session_audit_trailWhereInput[]
    NOT?: Session_audit_trailWhereInput | Session_audit_trailWhereInput[]
    admin_id?: StringFilter<"Session_audit_trail"> | string
    event_type?: StringFilter<"Session_audit_trail"> | string
    device_type?: StringFilter<"Session_audit_trail"> | string
    ip_address?: StringFilter<"Session_audit_trail"> | string
    success?: BoolFilter<"Session_audit_trail"> | boolean
    failure_session?: StringNullableFilter<"Session_audit_trail"> | string | null
    created_at?: DateTimeFilter<"Session_audit_trail"> | Date | string
    updated_at?: DateTimeFilter<"Session_audit_trail"> | Date | string
    admin?: XOR<AdminNullableScalarRelationFilter, AdminWhereInput> | null
  }, "id">

  export type Session_audit_trailOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    event_type?: SortOrder
    device_type?: SortOrder
    ip_address?: SortOrder
    success?: SortOrder
    failure_session?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: Session_audit_trailCountOrderByAggregateInput
    _avg?: Session_audit_trailAvgOrderByAggregateInput
    _max?: Session_audit_trailMaxOrderByAggregateInput
    _min?: Session_audit_trailMinOrderByAggregateInput
    _sum?: Session_audit_trailSumOrderByAggregateInput
  }

  export type Session_audit_trailScalarWhereWithAggregatesInput = {
    AND?: Session_audit_trailScalarWhereWithAggregatesInput | Session_audit_trailScalarWhereWithAggregatesInput[]
    OR?: Session_audit_trailScalarWhereWithAggregatesInput[]
    NOT?: Session_audit_trailScalarWhereWithAggregatesInput | Session_audit_trailScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Session_audit_trail"> | number
    admin_id?: StringWithAggregatesFilter<"Session_audit_trail"> | string
    event_type?: StringWithAggregatesFilter<"Session_audit_trail"> | string
    device_type?: StringWithAggregatesFilter<"Session_audit_trail"> | string
    ip_address?: StringWithAggregatesFilter<"Session_audit_trail"> | string
    success?: BoolWithAggregatesFilter<"Session_audit_trail"> | boolean
    failure_session?: StringNullableWithAggregatesFilter<"Session_audit_trail"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Session_audit_trail"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Session_audit_trail"> | Date | string
  }

  export type CategoryOnArticleWhereInput = {
    AND?: CategoryOnArticleWhereInput | CategoryOnArticleWhereInput[]
    OR?: CategoryOnArticleWhereInput[]
    NOT?: CategoryOnArticleWhereInput | CategoryOnArticleWhereInput[]
    category_id?: IntFilter<"CategoryOnArticle"> | number
    article_id?: IntFilter<"CategoryOnArticle"> | number
    created_at?: DateTimeFilter<"CategoryOnArticle"> | Date | string
    updated_at?: DateTimeFilter<"CategoryOnArticle"> | Date | string
    article?: XOR<ArticleNullableScalarRelationFilter, ArticleWhereInput> | null
    category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
  }

  export type CategoryOnArticleOrderByWithRelationInput = {
    category_id?: SortOrder
    article_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    article?: ArticleOrderByWithRelationInput
    category?: CategoryOrderByWithRelationInput
  }

  export type CategoryOnArticleWhereUniqueInput = Prisma.AtLeast<{
    category_id_article_id?: CategoryOnArticleCategory_idArticle_idCompoundUniqueInput
    AND?: CategoryOnArticleWhereInput | CategoryOnArticleWhereInput[]
    OR?: CategoryOnArticleWhereInput[]
    NOT?: CategoryOnArticleWhereInput | CategoryOnArticleWhereInput[]
    category_id?: IntFilter<"CategoryOnArticle"> | number
    article_id?: IntFilter<"CategoryOnArticle"> | number
    created_at?: DateTimeFilter<"CategoryOnArticle"> | Date | string
    updated_at?: DateTimeFilter<"CategoryOnArticle"> | Date | string
    article?: XOR<ArticleNullableScalarRelationFilter, ArticleWhereInput> | null
    category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
  }, "category_id_article_id">

  export type CategoryOnArticleOrderByWithAggregationInput = {
    category_id?: SortOrder
    article_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: CategoryOnArticleCountOrderByAggregateInput
    _avg?: CategoryOnArticleAvgOrderByAggregateInput
    _max?: CategoryOnArticleMaxOrderByAggregateInput
    _min?: CategoryOnArticleMinOrderByAggregateInput
    _sum?: CategoryOnArticleSumOrderByAggregateInput
  }

  export type CategoryOnArticleScalarWhereWithAggregatesInput = {
    AND?: CategoryOnArticleScalarWhereWithAggregatesInput | CategoryOnArticleScalarWhereWithAggregatesInput[]
    OR?: CategoryOnArticleScalarWhereWithAggregatesInput[]
    NOT?: CategoryOnArticleScalarWhereWithAggregatesInput | CategoryOnArticleScalarWhereWithAggregatesInput[]
    category_id?: IntWithAggregatesFilter<"CategoryOnArticle"> | number
    article_id?: IntWithAggregatesFilter<"CategoryOnArticle"> | number
    created_at?: DateTimeWithAggregatesFilter<"CategoryOnArticle"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"CategoryOnArticle"> | Date | string
  }

  export type ArticleCreateInput = {
    title: string
    content: string
    image?: string | null
    base_views?: number
    created_at?: Date | string
    updated_at?: Date | string
    category?: CategoryOnArticleCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateInput = {
    id?: number
    title: string
    content: string
    image?: string | null
    base_views?: number
    created_at?: Date | string
    updated_at?: Date | string
    category?: CategoryOnArticleUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    base_views?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryOnArticleUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    base_views?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryOnArticleUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCreateManyInput = {
    id?: number
    title: string
    content: string
    image?: string | null
    base_views?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ArticleUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    base_views?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    base_views?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    article?: CategoryOnArticleCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
    article?: CategoryOnArticleUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: CategoryOnArticleUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: CategoryOnArticleUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminCreateInput = {
    id?: string
    email: string
    password?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    authlogs?: Session_audit_trailCreateNestedManyWithoutAdminInput
  }

  export type AdminUncheckedCreateInput = {
    id?: string
    email: string
    password?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    authlogs?: Session_audit_trailUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    authlogs?: Session_audit_trailUpdateManyWithoutAdminNestedInput
  }

  export type AdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    authlogs?: Session_audit_trailUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type AdminCreateManyInput = {
    id?: string
    email: string
    password?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Session_audit_trailCreateInput = {
    event_type: string
    device_type: string
    ip_address: string
    success: boolean
    failure_session?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    admin?: AdminCreateNestedOneWithoutAuthlogsInput
  }

  export type Session_audit_trailUncheckedCreateInput = {
    id?: number
    admin_id: string
    event_type: string
    device_type: string
    ip_address: string
    success: boolean
    failure_session?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type Session_audit_trailUpdateInput = {
    event_type?: StringFieldUpdateOperationsInput | string
    device_type?: StringFieldUpdateOperationsInput | string
    ip_address?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    failure_session?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin?: AdminUpdateOneWithoutAuthlogsNestedInput
  }

  export type Session_audit_trailUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    device_type?: StringFieldUpdateOperationsInput | string
    ip_address?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    failure_session?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Session_audit_trailCreateManyInput = {
    id?: number
    admin_id: string
    event_type: string
    device_type: string
    ip_address: string
    success: boolean
    failure_session?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type Session_audit_trailUpdateManyMutationInput = {
    event_type?: StringFieldUpdateOperationsInput | string
    device_type?: StringFieldUpdateOperationsInput | string
    ip_address?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    failure_session?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Session_audit_trailUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: StringFieldUpdateOperationsInput | string
    event_type?: StringFieldUpdateOperationsInput | string
    device_type?: StringFieldUpdateOperationsInput | string
    ip_address?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    failure_session?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryOnArticleCreateInput = {
    created_at?: Date | string
    updated_at?: Date | string
    article?: ArticleCreateNestedOneWithoutCategoryInput
    category?: CategoryCreateNestedOneWithoutArticleInput
  }

  export type CategoryOnArticleUncheckedCreateInput = {
    category_id: number
    article_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryOnArticleUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneWithoutCategoryNestedInput
    category?: CategoryUpdateOneWithoutArticleNestedInput
  }

  export type CategoryOnArticleUncheckedUpdateInput = {
    category_id?: IntFieldUpdateOperationsInput | number
    article_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryOnArticleCreateManyInput = {
    category_id: number
    article_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryOnArticleUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryOnArticleUncheckedUpdateManyInput = {
    category_id?: IntFieldUpdateOperationsInput | number
    article_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CategoryOnArticleListRelationFilter = {
    every?: CategoryOnArticleWhereInput
    some?: CategoryOnArticleWhereInput
    none?: CategoryOnArticleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CategoryOnArticleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    image?: SortOrder
    base_views?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticleAvgOrderByAggregateInput = {
    id?: SortOrder
    base_views?: SortOrder
  }

  export type ArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    image?: SortOrder
    base_views?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    image?: SortOrder
    base_views?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticleSumOrderByAggregateInput = {
    id?: SortOrder
    base_views?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Session_audit_trailListRelationFilter = {
    every?: Session_audit_trailWhereInput
    some?: Session_audit_trailWhereInput
    none?: Session_audit_trailWhereInput
  }

  export type Session_audit_trailOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AdminNullableScalarRelationFilter = {
    is?: AdminWhereInput | null
    isNot?: AdminWhereInput | null
  }

  export type Session_audit_trailCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    event_type?: SortOrder
    device_type?: SortOrder
    ip_address?: SortOrder
    success?: SortOrder
    failure_session?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type Session_audit_trailAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Session_audit_trailMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    event_type?: SortOrder
    device_type?: SortOrder
    ip_address?: SortOrder
    success?: SortOrder
    failure_session?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type Session_audit_trailMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    event_type?: SortOrder
    device_type?: SortOrder
    ip_address?: SortOrder
    success?: SortOrder
    failure_session?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type Session_audit_trailSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ArticleNullableScalarRelationFilter = {
    is?: ArticleWhereInput | null
    isNot?: ArticleWhereInput | null
  }

  export type CategoryNullableScalarRelationFilter = {
    is?: CategoryWhereInput | null
    isNot?: CategoryWhereInput | null
  }

  export type CategoryOnArticleCategory_idArticle_idCompoundUniqueInput = {
    category_id: number
    article_id: number
  }

  export type CategoryOnArticleCountOrderByAggregateInput = {
    category_id?: SortOrder
    article_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoryOnArticleAvgOrderByAggregateInput = {
    category_id?: SortOrder
    article_id?: SortOrder
  }

  export type CategoryOnArticleMaxOrderByAggregateInput = {
    category_id?: SortOrder
    article_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoryOnArticleMinOrderByAggregateInput = {
    category_id?: SortOrder
    article_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoryOnArticleSumOrderByAggregateInput = {
    category_id?: SortOrder
    article_id?: SortOrder
  }

  export type CategoryOnArticleCreateNestedManyWithoutArticleInput = {
    create?: XOR<CategoryOnArticleCreateWithoutArticleInput, CategoryOnArticleUncheckedCreateWithoutArticleInput> | CategoryOnArticleCreateWithoutArticleInput[] | CategoryOnArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: CategoryOnArticleCreateOrConnectWithoutArticleInput | CategoryOnArticleCreateOrConnectWithoutArticleInput[]
    createMany?: CategoryOnArticleCreateManyArticleInputEnvelope
    connect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
  }

  export type CategoryOnArticleUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<CategoryOnArticleCreateWithoutArticleInput, CategoryOnArticleUncheckedCreateWithoutArticleInput> | CategoryOnArticleCreateWithoutArticleInput[] | CategoryOnArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: CategoryOnArticleCreateOrConnectWithoutArticleInput | CategoryOnArticleCreateOrConnectWithoutArticleInput[]
    createMany?: CategoryOnArticleCreateManyArticleInputEnvelope
    connect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CategoryOnArticleUpdateManyWithoutArticleNestedInput = {
    create?: XOR<CategoryOnArticleCreateWithoutArticleInput, CategoryOnArticleUncheckedCreateWithoutArticleInput> | CategoryOnArticleCreateWithoutArticleInput[] | CategoryOnArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: CategoryOnArticleCreateOrConnectWithoutArticleInput | CategoryOnArticleCreateOrConnectWithoutArticleInput[]
    upsert?: CategoryOnArticleUpsertWithWhereUniqueWithoutArticleInput | CategoryOnArticleUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: CategoryOnArticleCreateManyArticleInputEnvelope
    set?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    disconnect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    delete?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    connect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    update?: CategoryOnArticleUpdateWithWhereUniqueWithoutArticleInput | CategoryOnArticleUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: CategoryOnArticleUpdateManyWithWhereWithoutArticleInput | CategoryOnArticleUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: CategoryOnArticleScalarWhereInput | CategoryOnArticleScalarWhereInput[]
  }

  export type CategoryOnArticleUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<CategoryOnArticleCreateWithoutArticleInput, CategoryOnArticleUncheckedCreateWithoutArticleInput> | CategoryOnArticleCreateWithoutArticleInput[] | CategoryOnArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: CategoryOnArticleCreateOrConnectWithoutArticleInput | CategoryOnArticleCreateOrConnectWithoutArticleInput[]
    upsert?: CategoryOnArticleUpsertWithWhereUniqueWithoutArticleInput | CategoryOnArticleUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: CategoryOnArticleCreateManyArticleInputEnvelope
    set?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    disconnect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    delete?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    connect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    update?: CategoryOnArticleUpdateWithWhereUniqueWithoutArticleInput | CategoryOnArticleUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: CategoryOnArticleUpdateManyWithWhereWithoutArticleInput | CategoryOnArticleUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: CategoryOnArticleScalarWhereInput | CategoryOnArticleScalarWhereInput[]
  }

  export type CategoryOnArticleCreateNestedManyWithoutCategoryInput = {
    create?: XOR<CategoryOnArticleCreateWithoutCategoryInput, CategoryOnArticleUncheckedCreateWithoutCategoryInput> | CategoryOnArticleCreateWithoutCategoryInput[] | CategoryOnArticleUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: CategoryOnArticleCreateOrConnectWithoutCategoryInput | CategoryOnArticleCreateOrConnectWithoutCategoryInput[]
    createMany?: CategoryOnArticleCreateManyCategoryInputEnvelope
    connect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
  }

  export type CategoryOnArticleUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<CategoryOnArticleCreateWithoutCategoryInput, CategoryOnArticleUncheckedCreateWithoutCategoryInput> | CategoryOnArticleCreateWithoutCategoryInput[] | CategoryOnArticleUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: CategoryOnArticleCreateOrConnectWithoutCategoryInput | CategoryOnArticleCreateOrConnectWithoutCategoryInput[]
    createMany?: CategoryOnArticleCreateManyCategoryInputEnvelope
    connect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
  }

  export type CategoryOnArticleUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<CategoryOnArticleCreateWithoutCategoryInput, CategoryOnArticleUncheckedCreateWithoutCategoryInput> | CategoryOnArticleCreateWithoutCategoryInput[] | CategoryOnArticleUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: CategoryOnArticleCreateOrConnectWithoutCategoryInput | CategoryOnArticleCreateOrConnectWithoutCategoryInput[]
    upsert?: CategoryOnArticleUpsertWithWhereUniqueWithoutCategoryInput | CategoryOnArticleUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: CategoryOnArticleCreateManyCategoryInputEnvelope
    set?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    disconnect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    delete?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    connect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    update?: CategoryOnArticleUpdateWithWhereUniqueWithoutCategoryInput | CategoryOnArticleUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: CategoryOnArticleUpdateManyWithWhereWithoutCategoryInput | CategoryOnArticleUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: CategoryOnArticleScalarWhereInput | CategoryOnArticleScalarWhereInput[]
  }

  export type CategoryOnArticleUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<CategoryOnArticleCreateWithoutCategoryInput, CategoryOnArticleUncheckedCreateWithoutCategoryInput> | CategoryOnArticleCreateWithoutCategoryInput[] | CategoryOnArticleUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: CategoryOnArticleCreateOrConnectWithoutCategoryInput | CategoryOnArticleCreateOrConnectWithoutCategoryInput[]
    upsert?: CategoryOnArticleUpsertWithWhereUniqueWithoutCategoryInput | CategoryOnArticleUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: CategoryOnArticleCreateManyCategoryInputEnvelope
    set?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    disconnect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    delete?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    connect?: CategoryOnArticleWhereUniqueInput | CategoryOnArticleWhereUniqueInput[]
    update?: CategoryOnArticleUpdateWithWhereUniqueWithoutCategoryInput | CategoryOnArticleUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: CategoryOnArticleUpdateManyWithWhereWithoutCategoryInput | CategoryOnArticleUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: CategoryOnArticleScalarWhereInput | CategoryOnArticleScalarWhereInput[]
  }

  export type Session_audit_trailCreateNestedManyWithoutAdminInput = {
    create?: XOR<Session_audit_trailCreateWithoutAdminInput, Session_audit_trailUncheckedCreateWithoutAdminInput> | Session_audit_trailCreateWithoutAdminInput[] | Session_audit_trailUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: Session_audit_trailCreateOrConnectWithoutAdminInput | Session_audit_trailCreateOrConnectWithoutAdminInput[]
    createMany?: Session_audit_trailCreateManyAdminInputEnvelope
    connect?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
  }

  export type Session_audit_trailUncheckedCreateNestedManyWithoutAdminInput = {
    create?: XOR<Session_audit_trailCreateWithoutAdminInput, Session_audit_trailUncheckedCreateWithoutAdminInput> | Session_audit_trailCreateWithoutAdminInput[] | Session_audit_trailUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: Session_audit_trailCreateOrConnectWithoutAdminInput | Session_audit_trailCreateOrConnectWithoutAdminInput[]
    createMany?: Session_audit_trailCreateManyAdminInputEnvelope
    connect?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
  }

  export type Session_audit_trailUpdateManyWithoutAdminNestedInput = {
    create?: XOR<Session_audit_trailCreateWithoutAdminInput, Session_audit_trailUncheckedCreateWithoutAdminInput> | Session_audit_trailCreateWithoutAdminInput[] | Session_audit_trailUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: Session_audit_trailCreateOrConnectWithoutAdminInput | Session_audit_trailCreateOrConnectWithoutAdminInput[]
    upsert?: Session_audit_trailUpsertWithWhereUniqueWithoutAdminInput | Session_audit_trailUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: Session_audit_trailCreateManyAdminInputEnvelope
    set?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
    disconnect?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
    delete?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
    connect?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
    update?: Session_audit_trailUpdateWithWhereUniqueWithoutAdminInput | Session_audit_trailUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: Session_audit_trailUpdateManyWithWhereWithoutAdminInput | Session_audit_trailUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: Session_audit_trailScalarWhereInput | Session_audit_trailScalarWhereInput[]
  }

  export type Session_audit_trailUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: XOR<Session_audit_trailCreateWithoutAdminInput, Session_audit_trailUncheckedCreateWithoutAdminInput> | Session_audit_trailCreateWithoutAdminInput[] | Session_audit_trailUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: Session_audit_trailCreateOrConnectWithoutAdminInput | Session_audit_trailCreateOrConnectWithoutAdminInput[]
    upsert?: Session_audit_trailUpsertWithWhereUniqueWithoutAdminInput | Session_audit_trailUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: Session_audit_trailCreateManyAdminInputEnvelope
    set?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
    disconnect?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
    delete?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
    connect?: Session_audit_trailWhereUniqueInput | Session_audit_trailWhereUniqueInput[]
    update?: Session_audit_trailUpdateWithWhereUniqueWithoutAdminInput | Session_audit_trailUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: Session_audit_trailUpdateManyWithWhereWithoutAdminInput | Session_audit_trailUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: Session_audit_trailScalarWhereInput | Session_audit_trailScalarWhereInput[]
  }

  export type AdminCreateNestedOneWithoutAuthlogsInput = {
    create?: XOR<AdminCreateWithoutAuthlogsInput, AdminUncheckedCreateWithoutAuthlogsInput>
    connectOrCreate?: AdminCreateOrConnectWithoutAuthlogsInput
    connect?: AdminWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AdminUpdateOneWithoutAuthlogsNestedInput = {
    create?: XOR<AdminCreateWithoutAuthlogsInput, AdminUncheckedCreateWithoutAuthlogsInput>
    connectOrCreate?: AdminCreateOrConnectWithoutAuthlogsInput
    upsert?: AdminUpsertWithoutAuthlogsInput
    disconnect?: AdminWhereInput | boolean
    delete?: AdminWhereInput | boolean
    connect?: AdminWhereUniqueInput
    update?: XOR<XOR<AdminUpdateToOneWithWhereWithoutAuthlogsInput, AdminUpdateWithoutAuthlogsInput>, AdminUncheckedUpdateWithoutAuthlogsInput>
  }

  export type ArticleCreateNestedOneWithoutCategoryInput = {
    create?: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutCategoryInput
    connect?: ArticleWhereUniqueInput
  }

  export type CategoryCreateNestedOneWithoutArticleInput = {
    create?: XOR<CategoryCreateWithoutArticleInput, CategoryUncheckedCreateWithoutArticleInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutArticleInput
    connect?: CategoryWhereUniqueInput
  }

  export type ArticleUpdateOneWithoutCategoryNestedInput = {
    create?: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutCategoryInput
    upsert?: ArticleUpsertWithoutCategoryInput
    disconnect?: ArticleWhereInput | boolean
    delete?: ArticleWhereInput | boolean
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutCategoryInput, ArticleUpdateWithoutCategoryInput>, ArticleUncheckedUpdateWithoutCategoryInput>
  }

  export type CategoryUpdateOneWithoutArticleNestedInput = {
    create?: XOR<CategoryCreateWithoutArticleInput, CategoryUncheckedCreateWithoutArticleInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutArticleInput
    upsert?: CategoryUpsertWithoutArticleInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutArticleInput, CategoryUpdateWithoutArticleInput>, CategoryUncheckedUpdateWithoutArticleInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CategoryOnArticleCreateWithoutArticleInput = {
    created_at?: Date | string
    updated_at?: Date | string
    category?: CategoryCreateNestedOneWithoutArticleInput
  }

  export type CategoryOnArticleUncheckedCreateWithoutArticleInput = {
    category_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryOnArticleCreateOrConnectWithoutArticleInput = {
    where: CategoryOnArticleWhereUniqueInput
    create: XOR<CategoryOnArticleCreateWithoutArticleInput, CategoryOnArticleUncheckedCreateWithoutArticleInput>
  }

  export type CategoryOnArticleCreateManyArticleInputEnvelope = {
    data: CategoryOnArticleCreateManyArticleInput | CategoryOnArticleCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type CategoryOnArticleUpsertWithWhereUniqueWithoutArticleInput = {
    where: CategoryOnArticleWhereUniqueInput
    update: XOR<CategoryOnArticleUpdateWithoutArticleInput, CategoryOnArticleUncheckedUpdateWithoutArticleInput>
    create: XOR<CategoryOnArticleCreateWithoutArticleInput, CategoryOnArticleUncheckedCreateWithoutArticleInput>
  }

  export type CategoryOnArticleUpdateWithWhereUniqueWithoutArticleInput = {
    where: CategoryOnArticleWhereUniqueInput
    data: XOR<CategoryOnArticleUpdateWithoutArticleInput, CategoryOnArticleUncheckedUpdateWithoutArticleInput>
  }

  export type CategoryOnArticleUpdateManyWithWhereWithoutArticleInput = {
    where: CategoryOnArticleScalarWhereInput
    data: XOR<CategoryOnArticleUpdateManyMutationInput, CategoryOnArticleUncheckedUpdateManyWithoutArticleInput>
  }

  export type CategoryOnArticleScalarWhereInput = {
    AND?: CategoryOnArticleScalarWhereInput | CategoryOnArticleScalarWhereInput[]
    OR?: CategoryOnArticleScalarWhereInput[]
    NOT?: CategoryOnArticleScalarWhereInput | CategoryOnArticleScalarWhereInput[]
    category_id?: IntFilter<"CategoryOnArticle"> | number
    article_id?: IntFilter<"CategoryOnArticle"> | number
    created_at?: DateTimeFilter<"CategoryOnArticle"> | Date | string
    updated_at?: DateTimeFilter<"CategoryOnArticle"> | Date | string
  }

  export type CategoryOnArticleCreateWithoutCategoryInput = {
    created_at?: Date | string
    updated_at?: Date | string
    article?: ArticleCreateNestedOneWithoutCategoryInput
  }

  export type CategoryOnArticleUncheckedCreateWithoutCategoryInput = {
    article_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryOnArticleCreateOrConnectWithoutCategoryInput = {
    where: CategoryOnArticleWhereUniqueInput
    create: XOR<CategoryOnArticleCreateWithoutCategoryInput, CategoryOnArticleUncheckedCreateWithoutCategoryInput>
  }

  export type CategoryOnArticleCreateManyCategoryInputEnvelope = {
    data: CategoryOnArticleCreateManyCategoryInput | CategoryOnArticleCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type CategoryOnArticleUpsertWithWhereUniqueWithoutCategoryInput = {
    where: CategoryOnArticleWhereUniqueInput
    update: XOR<CategoryOnArticleUpdateWithoutCategoryInput, CategoryOnArticleUncheckedUpdateWithoutCategoryInput>
    create: XOR<CategoryOnArticleCreateWithoutCategoryInput, CategoryOnArticleUncheckedCreateWithoutCategoryInput>
  }

  export type CategoryOnArticleUpdateWithWhereUniqueWithoutCategoryInput = {
    where: CategoryOnArticleWhereUniqueInput
    data: XOR<CategoryOnArticleUpdateWithoutCategoryInput, CategoryOnArticleUncheckedUpdateWithoutCategoryInput>
  }

  export type CategoryOnArticleUpdateManyWithWhereWithoutCategoryInput = {
    where: CategoryOnArticleScalarWhereInput
    data: XOR<CategoryOnArticleUpdateManyMutationInput, CategoryOnArticleUncheckedUpdateManyWithoutCategoryInput>
  }

  export type Session_audit_trailCreateWithoutAdminInput = {
    event_type: string
    device_type: string
    ip_address: string
    success: boolean
    failure_session?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type Session_audit_trailUncheckedCreateWithoutAdminInput = {
    id?: number
    event_type: string
    device_type: string
    ip_address: string
    success: boolean
    failure_session?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type Session_audit_trailCreateOrConnectWithoutAdminInput = {
    where: Session_audit_trailWhereUniqueInput
    create: XOR<Session_audit_trailCreateWithoutAdminInput, Session_audit_trailUncheckedCreateWithoutAdminInput>
  }

  export type Session_audit_trailCreateManyAdminInputEnvelope = {
    data: Session_audit_trailCreateManyAdminInput | Session_audit_trailCreateManyAdminInput[]
    skipDuplicates?: boolean
  }

  export type Session_audit_trailUpsertWithWhereUniqueWithoutAdminInput = {
    where: Session_audit_trailWhereUniqueInput
    update: XOR<Session_audit_trailUpdateWithoutAdminInput, Session_audit_trailUncheckedUpdateWithoutAdminInput>
    create: XOR<Session_audit_trailCreateWithoutAdminInput, Session_audit_trailUncheckedCreateWithoutAdminInput>
  }

  export type Session_audit_trailUpdateWithWhereUniqueWithoutAdminInput = {
    where: Session_audit_trailWhereUniqueInput
    data: XOR<Session_audit_trailUpdateWithoutAdminInput, Session_audit_trailUncheckedUpdateWithoutAdminInput>
  }

  export type Session_audit_trailUpdateManyWithWhereWithoutAdminInput = {
    where: Session_audit_trailScalarWhereInput
    data: XOR<Session_audit_trailUpdateManyMutationInput, Session_audit_trailUncheckedUpdateManyWithoutAdminInput>
  }

  export type Session_audit_trailScalarWhereInput = {
    AND?: Session_audit_trailScalarWhereInput | Session_audit_trailScalarWhereInput[]
    OR?: Session_audit_trailScalarWhereInput[]
    NOT?: Session_audit_trailScalarWhereInput | Session_audit_trailScalarWhereInput[]
    id?: IntFilter<"Session_audit_trail"> | number
    admin_id?: StringFilter<"Session_audit_trail"> | string
    event_type?: StringFilter<"Session_audit_trail"> | string
    device_type?: StringFilter<"Session_audit_trail"> | string
    ip_address?: StringFilter<"Session_audit_trail"> | string
    success?: BoolFilter<"Session_audit_trail"> | boolean
    failure_session?: StringNullableFilter<"Session_audit_trail"> | string | null
    created_at?: DateTimeFilter<"Session_audit_trail"> | Date | string
    updated_at?: DateTimeFilter<"Session_audit_trail"> | Date | string
  }

  export type AdminCreateWithoutAuthlogsInput = {
    id?: string
    email: string
    password?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AdminUncheckedCreateWithoutAuthlogsInput = {
    id?: string
    email: string
    password?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type AdminCreateOrConnectWithoutAuthlogsInput = {
    where: AdminWhereUniqueInput
    create: XOR<AdminCreateWithoutAuthlogsInput, AdminUncheckedCreateWithoutAuthlogsInput>
  }

  export type AdminUpsertWithoutAuthlogsInput = {
    update: XOR<AdminUpdateWithoutAuthlogsInput, AdminUncheckedUpdateWithoutAuthlogsInput>
    create: XOR<AdminCreateWithoutAuthlogsInput, AdminUncheckedCreateWithoutAuthlogsInput>
    where?: AdminWhereInput
  }

  export type AdminUpdateToOneWithWhereWithoutAuthlogsInput = {
    where?: AdminWhereInput
    data: XOR<AdminUpdateWithoutAuthlogsInput, AdminUncheckedUpdateWithoutAuthlogsInput>
  }

  export type AdminUpdateWithoutAuthlogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateWithoutAuthlogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCreateWithoutCategoryInput = {
    title: string
    content: string
    image?: string | null
    base_views?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ArticleUncheckedCreateWithoutCategoryInput = {
    id?: number
    title: string
    content: string
    image?: string | null
    base_views?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ArticleCreateOrConnectWithoutCategoryInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput>
  }

  export type CategoryCreateWithoutArticleInput = {
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryUncheckedCreateWithoutArticleInput = {
    id?: number
    name: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryCreateOrConnectWithoutArticleInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutArticleInput, CategoryUncheckedCreateWithoutArticleInput>
  }

  export type ArticleUpsertWithoutCategoryInput = {
    update: XOR<ArticleUpdateWithoutCategoryInput, ArticleUncheckedUpdateWithoutCategoryInput>
    create: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutCategoryInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutCategoryInput, ArticleUncheckedUpdateWithoutCategoryInput>
  }

  export type ArticleUpdateWithoutCategoryInput = {
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    base_views?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    base_views?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUpsertWithoutArticleInput = {
    update: XOR<CategoryUpdateWithoutArticleInput, CategoryUncheckedUpdateWithoutArticleInput>
    create: XOR<CategoryCreateWithoutArticleInput, CategoryUncheckedCreateWithoutArticleInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutArticleInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutArticleInput, CategoryUncheckedUpdateWithoutArticleInput>
  }

  export type CategoryUpdateWithoutArticleInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateWithoutArticleInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryOnArticleCreateManyArticleInput = {
    category_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryOnArticleUpdateWithoutArticleInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneWithoutArticleNestedInput
  }

  export type CategoryOnArticleUncheckedUpdateWithoutArticleInput = {
    category_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryOnArticleUncheckedUpdateManyWithoutArticleInput = {
    category_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryOnArticleCreateManyCategoryInput = {
    article_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CategoryOnArticleUpdateWithoutCategoryInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneWithoutCategoryNestedInput
  }

  export type CategoryOnArticleUncheckedUpdateWithoutCategoryInput = {
    article_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryOnArticleUncheckedUpdateManyWithoutCategoryInput = {
    article_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Session_audit_trailCreateManyAdminInput = {
    id?: number
    event_type: string
    device_type: string
    ip_address: string
    success: boolean
    failure_session?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type Session_audit_trailUpdateWithoutAdminInput = {
    event_type?: StringFieldUpdateOperationsInput | string
    device_type?: StringFieldUpdateOperationsInput | string
    ip_address?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    failure_session?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Session_audit_trailUncheckedUpdateWithoutAdminInput = {
    id?: IntFieldUpdateOperationsInput | number
    event_type?: StringFieldUpdateOperationsInput | string
    device_type?: StringFieldUpdateOperationsInput | string
    ip_address?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    failure_session?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Session_audit_trailUncheckedUpdateManyWithoutAdminInput = {
    id?: IntFieldUpdateOperationsInput | number
    event_type?: StringFieldUpdateOperationsInput | string
    device_type?: StringFieldUpdateOperationsInput | string
    ip_address?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    failure_session?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}