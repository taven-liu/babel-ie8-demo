export function log () {
  if (console && typeof console.log === 'function') {
    console.log.apply(null, arguments)
  }
}
