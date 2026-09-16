if (import.meta.env.PROD) {
  const noop = () => {}
  console.error = noop
  console.warn = noop
}
