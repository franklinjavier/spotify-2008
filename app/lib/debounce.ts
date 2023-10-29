export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor = 300) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }
}
