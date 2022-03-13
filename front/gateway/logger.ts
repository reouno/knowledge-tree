/**
 * Logger
 * TODO: Replace all implementations with logging to Firebase analytics
 */
export class Logger {
  static debug(msg: string, obj: any = {}): void {
    // TODO: replace with sending log to firebase analytics
    console.log(msg, obj)
  }

  static info(msg: string, obj: any = {}): void {
    // TODO: replace with sending log to firebase analytics
    console.log(msg, obj)
  }

  static warn(msg: string, obj: any = {}): void {
    // TODO: replace with sending log to firebase analytics
    console.warn(msg, obj)
  }

  static error(msg: string, obj: any = {}): void {
    // TODO: replace with sending log to firebase analytics
    console.error(msg, obj)
  }
}
