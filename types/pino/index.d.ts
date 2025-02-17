// Type definitions for pino 6.3
// Project: https://github.com/pinojs/pino.git, http://getpino.io
// Definitions by: Peter Snider <https://github.com/psnider>
//                 BendingBender <https://github.com/BendingBender>
//                 Christian Rackerseder <https://github.com/screendriver>
//                 GP <https://github.com/paambaati>
//                 Alex Ferrando <https://github.com/alferpal>
//                 Oleksandr Sidko <https://github.com/mortiy>
//                 Harris Lummis <https://github.com/lummish>
//                 Raoul Jaeckel <https://github.com/raoulus>
//                 Cory Donkin <https://github.com/Cooryd>
//                 Adam Vigneaux <https://github.com/AdamVig>
//                 Austin Beer <https://github.com/austin-beer>
//                 Michel Nemnom <https://github.com/Pegase745>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/// <reference types="node"/>

import stream = require('stream');
import http = require('http');
import { EventEmitter } from 'events';
import SonicBoom from 'sonic-boom';
import * as pinoStdSerializers from 'pino-std-serializers';
import * as PinoPretty from 'pino-pretty';

export = P;

/**
 * @param [optionsOrStream]: an options object or a writable stream where the logs will be written. It can also receive some log-line metadata, if the
 * relative protocol is enabled. Default: process.stdout
 * @returns a new logger instance.
 */
declare function P(optionsOrStream?: P.LoggerOptions | P.DestinationStream): P.Logger;

/**
 * @param [options]: an options object
 * @param [stream]: a writable stream where the logs will be written. It can also receive some log-line metadata, if the
 * relative protocol is enabled. Default: process.stdout
 * @returns a new logger instance.
 */
declare function P(options: P.LoggerOptions, stream: P.DestinationStream): P.Logger;

declare namespace P {
    /**
     * Holds the current log format version (as output in the v property of each log record).
     */
    const LOG_VERSION: number;
    const levels: LevelMapping;
    const symbols: {
        readonly setLevelSym: unique symbol;
        readonly getLevelSym: unique symbol;
        readonly levelValSym: unique symbol;
        readonly useLevelLabelsSym: unique symbol;
        readonly mixinSym: unique symbol;
        readonly lsCacheSym: unique symbol;
        readonly chindingsSym: unique symbol;
        readonly parsedChindingsSym: unique symbol;
        readonly asJsonSym: unique symbol;
        readonly writeSym: unique symbol;
        readonly serializersSym: unique symbol;
        readonly redactFmtSym: unique symbol;
        readonly timeSym: unique symbol;
        readonly timeSliceIndexSym: unique symbol;
        readonly streamSym: unique symbol;
        readonly stringifySym: unique symbol;
        readonly stringifiersSym: unique symbol;
        readonly endSym: unique symbol;
        readonly formatOptsSym: unique symbol;
        readonly messageKeySym: unique symbol;
        readonly nestedKeySym: unique symbol;
        readonly wildcardFirstSym: unique symbol;
        readonly needsMetadataGsym: unique symbol;
        readonly useOnlyCustomLevelsSym: unique symbol;
        readonly formattersSym: unique symbol;
        readonly hooksSym: unique symbol;
    };
    /**
     * Exposes the Pino package version. Also available on the logger instance.
     */
    const version: string;

    type SerializedError = pinoStdSerializers.SerializedError;
    type SerializedResponse = pinoStdSerializers.SerializedResponse;
    type SerializedRequest = pinoStdSerializers.SerializedRequest;

    /**
     * Provides functions for serializing objects common to many projects.
     */
    const stdSerializers: {
        /**
         * Generates a JSONifiable object from the HTTP `request` object passed to the `createServer` callback of Node's HTTP server.
         */
        req: typeof pinoStdSerializers.req;
        /**
         * Generates a JSONifiable object from the HTTP `response` object passed to the `createServer` callback of Node's HTTP server.
         */
        res: typeof pinoStdSerializers.res;
        /**
         * Serializes an Error object.
         */
        err: typeof pinoStdSerializers.err;
        /**
         * Returns an object:
         * ```
         * {
         *   req: {}
         * }
         * ```
         * where req is the request as serialized by the standard request serializer.
         * @param req The request to serialize
         * @return An object
         */
        mapHttpRequest: typeof pinoStdSerializers.mapHttpRequest;
        /**
         * Returns an object:
         * ```
         * {
         *   res: {}
         * }
         * ```
         * where res is the response as serialized by the standard response serializer.
         * @param res The response to serialize.
         * @return An object.
         */
        mapHttpResponse: typeof pinoStdSerializers.mapHttpResponse;
        /**
         * A utility method for wrapping the default error serializer. Allows custom serializers to work with the
         * already serialized object.
         * @param customSerializer The custom error serializer. Accepts a single parameter: the newly serialized
         * error object. Returns the new (or updated) error object.
         * @return A new error serializer.
         */
        wrapErrorSerializer: typeof pinoStdSerializers.wrapErrorSerializer;
        /**
         * A utility method for wrapping the default request serializer. Allows custom serializers to work with the
         * already serialized object.
         * @param customSerializer The custom request serializer. Accepts a single parameter: the newly serialized
         * request object. Returns the new (or updated) request object.
         * @return A new error serializer.
         */
        wrapRequestSerializer: typeof pinoStdSerializers.wrapRequestSerializer;
        /**
         * A utility method for wrapping the default response serializer. Allows custom serializers to work with the
         * already serialized object.
         * @param customSerializer The custom response serializer. Accepts a single parameter: the newly serialized
         * response object. Returns the new (or updated) response object.
         * @return A new error serializer.
         */
        wrapResponseSerializer: typeof pinoStdSerializers.wrapResponseSerializer;
    };
    /**
     * Provides functions for generating the timestamp property in the log output. You can set the `timestamp` option during
     * initialization to one of these functions to adjust the output format. Alternatively, you can specify your own time function.
     * A time function must synchronously return a string that would be a valid component of a JSON string. For example,
     * the default function returns a string like `,"time":1493426328206`.
     */
    const stdTimeFunctions: {
        /**
         * The default time function for Pino. Returns a string like `,"time":1493426328206`.
         */
        epochTime: TimeFn;
        /*
         * Returns the seconds since Unix epoch
         */
        unixTime: TimeFn;
        /**
         * Returns an empty string. This function is used when the `timestamp` option is set to `false`.
         */
        nullTime: TimeFn;
        /*
         * Returns ISO 8601-formatted time in UTC
         */
        isoTime: TimeFn;
    };

    /**
     * Equivalent of SonicBoom constructor options object
     */
    // TODO: use SonicBoom constructor options interface when available
    interface DestinationObjectOptions {
        fd?: string | number | undefined;
        dest?: string | undefined;
        minLength?: number | undefined;
        sync?: boolean | undefined;
    }

    /**
     * Create a Pino Destination instance: a stream-like object with significantly more throughput (over 30%) than a standard Node.js stream.
     * @param [dest]: The `destination` parameter, at a minimum must be an object with a `write` method. An ordinary Node.js
     *                `stream` can be passed as the destination (such as the result of `fs.createWriteStream`) but for peak log
     *                writing performance it is strongly recommended to use `pino.destination` to create the destination stream.
     * @returns A Sonic-Boom  stream to be used as destination for the pino function
     */
    function destination(
        dest?: string | number | DestinationObjectOptions | DestinationStream | NodeJS.WritableStream,
    ): SonicBoom;

    /**
     * Create an extreme mode destination. This yields an additional 60% performance boost.
     * There are trade-offs that should be understood before usage.
     * @param [fileDescriptor]: File path or numerical file descriptor, by default 1
     * @returns A Sonic-Boom  stream to be used as destination for the pino function
     */
    function extreme(fileDescriptor?: string | number): SonicBoom;

    /**
     * The pino.final method can be used to create an exit listener function.
     * This listener function can be supplied to process exit events.
     * The exit listener function will call the handler with
     * @param [logger]: pino logger that serves as reference for the final logger
     * @param [handler]: Function that will be called by the handler returned from this function
     * @returns Exit listener function that can be supplied to process exit events and will call the supplied handler function
     */
    function final(
        logger: Logger,
        handler: (error: Error, finalLogger: Logger, ...args: any[]) => void,
    ): (error: Error | null, ...args: any[]) => void;

    /**
     * The pino.final method can be used to acquire a final logger instance that synchronously flushes on every write.
     * @param [logger]: pino logger that serves as reference for the final logger
     * @returns Final, synchronous logger
     */
    function final(logger: Logger): Logger;

    interface LevelMapping {
        /**
         * Returns the mappings of level names to their respective internal number representation.
         */
        values: { [level: string]: number };
        /**
         * Returns the mappings of level internal level numbers to their string representations.
         */
        labels: { [level: number]: string };
    }
    type TimeFn = () => string;
    type MixinFn = () => object;

    interface DestinationStream {
        write(msg: string): void;
    }

    interface LoggerOptions {
        /**
         * Avoid error causes by circular references in the object tree. Default: `true`.
         */
        safe?: boolean | undefined;
        /**
         * The name of the logger. Default: `undefined`.
         */
        name?: string | undefined;
        /**
         * an object containing functions for custom serialization of objects.
         * These functions should return an JSONifiable object and they should never throw. When logging an object,
         * each top-level property matching the exact key of a serializer will be serialized using the defined serializer.
         */
        serializers?: { [key: string]: SerializerFn } | undefined;
        /**
         * Enables or disables the inclusion of a timestamp in the log message. If a function is supplied, it must
         * synchronously return a JSON string representation of the time. If set to `false`, no timestamp will be included in the output.
         * See stdTimeFunctions for a set of available functions for passing in as a value for this option.
         * Caution: any sort of formatted time will significantly slow down Pino's performance.
         */
        timestamp?: TimeFn | boolean | undefined;
        /**
         * One of the supported levels or `silent` to disable logging. Any other value defines a custom level and
         * requires supplying a level value via `levelVal`. Default: 'info'.
         */
        level?: LevelWithSilent | string | undefined;
        /**
         * Outputs the level as a string instead of integer. Default: `false`.
         */
        useLevelLabels?: boolean | undefined;
        /**
         * Changes the property `level` to any string value you pass in. Default: 'level'
         */
        levelKey?: string | undefined;
        /**
         * (DEPRECATED, use `levelKey`) Changes the property `level` to any string value you pass in. Default: 'level'
         */
        changeLevelName?: string | undefined;
        /**
         * Use this option to define additional logging levels.
         * The keys of the object correspond the namespace of the log level, and the values should be the numerical value of the level.
         */
        customLevels?: { [key: string]: number } | undefined;
        /**
         * Use this option to only use defined `customLevels` and omit Pino's levels.
         * Logger's default `level` must be changed to a value in `customLevels` in order to use `useOnlyCustomLevels`
         * Warning: this option may not be supported by downstream transports.
         */
        useOnlyCustomLevels?: boolean | undefined;

        /**
         * If provided, the `mixin` function is called each time one of the active logging methods
         * is called. The function must synchronously return an object. The properties of the
         * returned object will be added to the logged JSON.
         */
        mixin?: MixinFn | undefined;

        /**
         * As an array, the redact option specifies paths that should have their values redacted from any log output.
         *
         * Each path must be a string using a syntax which corresponds to JavaScript dot and bracket notation.
         *
         * If an object is supplied, three options can be specified:
         *
         *      paths (String[]): Required. An array of paths
         *      censor (String): Optional. A value to overwrite key which are to be redacted. Default: '[Redacted]'
         *      remove (Boolean): Optional. Instead of censoring the value, remove both the key and the value. Default: false
         */
        redact?: string[] | redactOptions | undefined;

        /**
         * When defining a custom log level via level, set to an integer value to define the new level. Default: `undefined`.
         */
        levelVal?: number | undefined;
        /**
         * The string key for the 'message' in the JSON object. Default: "msg".
         */
        messageKey?: string | undefined;
        /**
         * The string key to place any logged object under.
         */
        nestedKey?: string | undefined;
        /**
         * @deprecated use pino.transport(). See https://getpino.io/#/docs/api?id=pino-transport.
         *
         * Enables pino.pretty. This is intended for non-production configurations. This may be set to a configuration
         * object as outlined in http://getpino.io/#/docs/API?id=pretty. Default: `false`.
         */
        prettyPrint?: boolean | PrettyOptions | undefined;
        /**
         * Allows to optionally define which prettifier module to use.
         */
        // TODO: use type definitions from 'pino-pretty' when available.
        prettifier?: any;
        /**
         * This function will be invoked during process shutdown when `extreme` is set to `true`. If you do not specify
         * a function, Pino will invoke `process.exit(0)` when no error has occurred, and `process.exit(1)` otherwise.
         * If you do specify a function, it is up to you to terminate the process; you must perform only synchronous
         * operations at this point. See http://getpino.io/#/docs/extreme for more detail.
         */
        onTerminated?(eventName: string, err: any): void;
        /**
         * Enables logging. Default: `true`.
         */
        enabled?: boolean | undefined;
        /**
         * Browser only, see http://getpino.io/#/docs/browser.
         */
        browser?:
            | {
                  /**
                   * The `asObject` option will create a pino-like log object instead of passing all arguments to a console
                   * method. When `write` is set, `asObject` will always be true.
                   *
                   * @example
                   * pino.info('hi') // creates and logs {msg: 'hi', level: 30, time: <ts>}
                   */
                  asObject?: boolean | undefined;
                  /**
                   * Instead of passing log messages to `console.log` they can be passed to a supplied function. If `write` is
                   * set to a single function, all logging objects are passed to this function. If `write` is an object, it
                   * can have methods that correspond to the levels. When a message is logged at a given level, the
                   * corresponding method is called. If a method isn't present, the logging falls back to using the `console`.
                   *
                   * @example
                   * const pino = require('pino')({
                   *   browser: {
                   *     write: (o) => {
                   *       // do something with o
                   *     }
                   *   }
                   * })
                   *
                   * @example
                   * const pino = require('pino')({
                   *   browser: {
                   *     write: {
                   *       info: function (o) {
                   *         //process info log object
                   *       },
                   *       error: function (o) {
                   *         //process error log object
                   *       }
                   *     }
                   *   }
                   * })
                   */
                  write?:
                      | WriteFn
                      | ({
                            fatal?: WriteFn | undefined;
                            error?: WriteFn | undefined;
                            warn?: WriteFn | undefined;
                            info?: WriteFn | undefined;
                            debug?: WriteFn | undefined;
                            trace?: WriteFn | undefined;
                        } & { [logLevel: string]: WriteFn })
                      | undefined;

                  /**
                   * The serializers provided to `pino` are ignored by default in the browser, including the standard
                   * serializers provided with Pino. Since the default destination for log messages is the console, values
                   * such as `Error` objects are enhanced for inspection, which they otherwise wouldn't be if the Error
                   * serializer was enabled. We can turn all serializers on or we can selectively enable them via an array.
                   *
                   * When `serialize` is `true` the standard error serializer is also enabled (see
                   * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#pino-stdserializers}). This is a global
                   * serializer which will apply to any `Error` objects passed to the logger methods.
                   *
                   * If `serialize` is an array the standard error serializer is also automatically enabled, it can be
                   * explicitly disabled by including a string in the serialize array: `!stdSerializers.err` (see example).
                   *
                   * The `serialize` array also applies to any child logger serializers (see
                   * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#bindingsserializers-object} for how to
                   * set child-bound serializers).
                   *
                   * Unlike server pino the serializers apply to every object passed to the logger method, if the `asObject`
                   * option is `true`, this results in the serializers applying to the first object (as in server pino).
                   *
                   * For more info on serializers see
                   * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#serializers-object}.
                   *
                   * @example
                   * const pino = require('pino')({
                   *   browser: {
                   *     serialize: true
                   *   }
                   * })
                   *
                   * @example
                   * const pino = require('pino')({
                   *   serializers: {
                   *     custom: myCustomSerializer,
                   *     another: anotherSerializer
                   *   },
                   *   browser: {
                   *     serialize: ['custom']
                   *   }
                   * })
                   * // following will apply myCustomSerializer to the custom property,
                   * // but will not apply anotherSerializer to another key
                   * pino.info({custom: 'a', another: 'b'})
                   *
                   * @example
                   * const pino = require('pino')({
                   *   serializers: {
                   *     custom: myCustomSerializer,
                   *     another: anotherSerializer
                   *   },
                   *   browser: {
                   *     serialize: ['!stdSerializers.err', 'custom'] //will not serialize Errors, will serialize `custom` keys
                   *   }
                   * })
                   */
                  serialize?: boolean | string[] | undefined;

                  /**
                   * Options for transmission of logs.
                   *
                   * @example
                   * const pino = require('pino')({
                   *   browser: {
                   *     transmit: {
                   *       level: 'warn',
                   *       send: function (level, logEvent) {
                   *         if (level === 'warn') {
                   *           // maybe send the logEvent to a separate endpoint
                   *           // or maybe analyse the messages further before sending
                   *         }
                   *         // we could also use the `logEvent.level.value` property to determine
                   *         // numerical value
                   *         if (logEvent.level.value >= 50) { // covers error and fatal
                   *
                   *           // send the logEvent somewhere
                   *         }
                   *       }
                   *     }
                   *   }
                   * })
                   */
                  transmit?:
                      | {
                            /**
                             * Specifies the minimum level (inclusive) of when the `send` function should be called, if not supplied
                             * the `send` function will be called based on the main logging `level` (set via `options.level`,
                             * defaulting to `info`).
                             */
                            level?: Level | string | undefined;
                            /**
                             * Remotely record log messages.
                             *
                             * @description Called after writing the log message.
                             */
                            send: (level: Level, logEvent: LogEvent) => void;
                        }
                      | undefined;
              }
            | undefined;
        /**
         * key-value object added as child logger to each log line. If set to null the base child logger is not added
         */
        base?: { [key: string]: any } | null | undefined;

        /**
         * An object containing functions for formatting the shape of the log lines.
         * These functions should return a JSONifiable object and should never throw.
         * These functions allow for full customization of the resulting log lines.
         * For example, they can be used to change the level key name or to enrich the default metadata.
         */
        formatters?:
            | {
                  /**
                   * Changes the shape of the log level.
                   * The default shape is { level: number }.
                   * The function takes two arguments, the label of the level (e.g. 'info') and the numeric value (e.g. 30).
                   */
                  level?: ((label: string, number: number) => object) | undefined;
                  /**
                   * Changes the shape of the bindings.
                   * The default shape is { pid, hostname }.
                   * The function takes a single argument, the bindings object.
                   * It will be called every time a child logger is created.
                   */
                  bindings?: ((bindings: Bindings) => object) | undefined;
                  /**
                   * Changes the shape of the log object.
                   * This function will be called every time one of the log methods (such as .info) is called.
                   * All arguments passed to the log method, except the message, will be pass to this function.
                   * By default it does not change the shape of the log object.
                   */
                  log?: ((object: Record<string, unknown>) => object) | undefined;
              }
            | undefined;

        /**
         * An object mapping to hook functions. Hook functions allow for customizing internal logger operations.
         * Hook functions must be synchronous functions.
         */
        hooks?:
            | {
                  /**
                   * Allows for manipulating the parameters passed to logger methods. The signature for this hook is
                   * logMethod (args, method, level) {}, where args is an array of the arguments that were passed to the
                   * log method and method is the log method itself, and level is the log level. This hook must invoke the method function by
                   * using apply, like so: method.apply(this, newArgumentsArray).
                   */
                  logMethod?: ((args: any[], method: LogFn, level: number) => void) | undefined;
              }
            | undefined;
    }

    interface ChildLoggerOptions {
        /**
         * The level property overrides the log level of the child logger.
         * By default the parent log level is inherited.
         * After the creation of the child logger, it is also accessible using the logger.level key.
         * @see {@link LoggerOptions.level} for more information.
         */
        level?: LevelWithSilent | string | undefined;
        /**
         * Setting options.redact to an array or object will override the parent redact options.
         * To remove redact options inherited from the parent logger set this value as an empty array ([]).
         * @see {@link LoggerOptions.redact} for more information.
         */
        redact?: string[] | redactOptions | undefined;
        /**
         * Child loggers inherit the serializers from the parent logger.
         * Setting the serializers key of the options object will override any configured parent serializers.
         * @see {@link LoggerOptions.serializers} for more information.
         */
        serializers?: { [key: string]: SerializerFn } | undefined;
    }

    // Re-export for backward compatibility
    type PrettyOptions = PinoPretty.PrettyOptions & {
        /**
         * Suppress warning on first synchronous flushing.
         */
        suppressFlushSyncWarning?: boolean | undefined;
    };

    type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    type LevelWithSilent = Level | 'silent';

    type SerializerFn = (value: any) => any;
    type WriteFn = (o: object) => void;

    /**
     * Describes a log line.
     */
    type LogDescriptor = Record<string, any>; // TODO replace `any` with `unknown` when TypeScript version >= 3.0

    interface Bindings {
        /**
         * @deprecated use {@link ChildLoggerOptions.level options.level}
         */
        level?: Level | string | undefined;
        /**
         * @deprecated use {@link ChildLoggerOptions.serializers options.serializers}
         */
        serializers?: { [key: string]: SerializerFn } | undefined;
        [key: string]: any;
    }

    /**
     * A data structure representing a log message, it represents the arguments passed to a logger statement, the level
     * at which they were logged and the hierarchy of child bindings.
     *
     * @description By default serializers are not applied to log output in the browser, but they will always be applied
     * to `messages` and `bindings` in the `logEvent` object. This allows  us to ensure a consistent format for all
     * values between server and client.
     */
    interface LogEvent {
        /**
         * Unix epoch timestamp in milliseconds, the time is taken from the moment the logger method is called.
         */
        ts: number;
        /**
         * All arguments passed to logger method, (for instance `logger.info('a', 'b', 'c')` would result in `messages`
         * array `['a', 'b', 'c']`).
         */
        messages: any[];
        /**
         * Represents each child logger (if any), and the relevant bindings.
         *
         * @description For instance, given `logger.child({a: 1}).child({b: 2}).info({c: 3})`, the bindings array would
         * hold `[{a: 1}, {b: 2}]` and the `messages` array would be `[{c: 3}]`. The `bindings` are ordered according to
         * their position in the child logger hierarchy, with the lowest index being the top of the hierarchy.
         */
        bindings: Bindings[];
        /**
         * Holds the `label` (for instance `info`), and the corresponding numerical `value` (for instance `30`).
         * This could be important in cases where client side level values and labels differ from server side.
         */
        level: {
            label: string;
            value: number;
        };
    }

    type Logger = BaseLogger & { [key: string]: LogFn };

    interface BaseLogger extends EventEmitter {
        /**
         * Exposes the current version of Pino.
         */
        readonly pino: string;
        /**
         * Holds the current log format version (as output in the v property of each log record).
         */
        readonly LOG_VERSION: number;
        /**
         * Exposes the Pino package version. Also available on the exported pino function.
         */
        readonly version: string;

        levels: LevelMapping;

        /**
         * Set this property to the desired logging level. In order of priority, available levels are:
         *
         * - 'fatal'
         * - 'error'
         * - 'warn'
         * - 'info'
         * - 'debug'
         * - 'trace'
         *
         * The logging level is a __minimum__ level. For instance if `logger.level` is `'info'` then all `'fatal'`, `'error'`, `'warn'`,
         * and `'info'` logs will be enabled.
         *
         * You can pass `'silent'` to disable logging.
         */
        level: LevelWithSilent | string;
        /**
         * Outputs the level as a string instead of integer.
         */
        useLevelLabels: boolean;
        /**
         * Define additional logging levels.
         */
        customLevels: { [key: string]: number };
        /**
         * Use only defined `customLevels` and omit Pino's levels.
         */
        useOnlyCustomLevels: boolean;
        /**
         * Returns the integer value for the logger instance's logging level.
         */
        levelVal: number;

        /**
         * Registers a listener function that is triggered when the level is changed.
         * Note: When browserified, this functionality will only be available if the `events` module has been required elsewhere
         * (e.g. if you're using streams in the browser). This allows for a trade-off between bundle size and functionality.
         *
         * @param event: only ever fires the `'level-change'` event
         * @param listener: The listener is passed four arguments: `levelLabel`, `levelValue`, `previousLevelLabel`, `previousLevelValue`.
         */
        on(event: 'level-change', listener: LevelChangeEventListener): this;
        addListener(event: 'level-change', listener: LevelChangeEventListener): this;
        once(event: 'level-change', listener: LevelChangeEventListener): this;
        prependListener(event: 'level-change', listener: LevelChangeEventListener): this;
        prependOnceListener(event: 'level-change', listener: LevelChangeEventListener): this;
        removeListener(event: 'level-change', listener: LevelChangeEventListener): this;

        /**
         * Creates a child logger, setting all key-value pairs in `bindings` as properties in the log lines. All serializers will be applied to the given pair.
         * Child loggers use the same output stream as the parent and inherit the current log level of the parent at the time they are spawned.
         * From v2.x.x the log level of a child is mutable (whereas in v1.x.x it was immutable), and can be set independently of the parent.
         * If a `level` property is present in the object passed to `child` it will override the child logger level.
         *
         * @param bindings: an object of key-value pairs to include in log lines as properties.
         * @param options: An optional options object for child logger. These options will override the parent logger options.
         * @returns a child logger instance.
         */
        child(bindings: Bindings, options?: ChildLoggerOptions): Logger;

        /**
         * Log at `'fatal'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        fatal: LogFn;
        /**
         * Log at `'error'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        error: LogFn;
        /**
         * Log at `'warn'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        warn: LogFn;
        /**
         * Log at `'info'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        info: LogFn;
        /**
         * Log at `'debug'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        debug: LogFn;
        /**
         * Log at `'trace'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        trace: LogFn;
        /**
         * Noop function.
         */
        silent: LogFn;

        /**
         * Flushes the content of the buffer in extreme mode. It has no effect if extreme mode is not enabled.
         */
        flush(): void;

        /**
         * A utility method for determining if a given log level will write to the destination.
         */
        isLevelEnabled(level: LevelWithSilent | string): boolean;

        /**
         * Returns an object containing all the current bindings, cloned from the ones passed in via logger.child().
         */
        bindings(): Bindings;
    }

    type LevelChangeEventListener = (
        lvl: LevelWithSilent | string,
        val: number,
        prevLvl: LevelWithSilent | string,
        prevVal: number,
    ) => void;

    interface LogFn {
        /* tslint:disable:no-unnecessary-generics */
        <T extends object>(obj: T, msg?: string, ...args: any[]): void;
        (msg: string, ...args: any[]): void;
    }

    interface redactOptions {
        paths: string[];
        censor?: string | ((v: any) => any) | undefined;
        remove?: boolean | undefined;
    }
}
