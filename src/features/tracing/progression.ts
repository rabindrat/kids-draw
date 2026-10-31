// Continue from the next unfinished step, wrapping after z when needed.
export function nextIncompleteStep(currentIndex: number, completed: number[], totalSteps: number): number | null {
  const done = new Set(completed)
  for (let distance = 1; distance <= totalSteps; distance++) {
    const next = (currentIndex + distance) % totalSteps
    if (!done.has(next)) return next
  }
  return null
}

// Restart at a chosen item: preserve earlier progress and practice forward from here again.
export function progressFromStep(completed: number[], step: number): number[] {
  return completed.filter((completedStep) => completedStep < step)
}
