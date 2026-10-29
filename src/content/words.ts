import { alphabet } from './alphabet'

export type WordGuide = { word: string; width: number; paths: Array<{ d: string; offsetX: number; scaleX: number }> }

// Keep this order stable: local progress records refer to these activity indexes.
const commonWords = ['cat', 'dog', 'sun', 'hat', 'car', 'red', 'bus', 'cup', 'bed', 'mom', 'dad', 'fish'] as const

export const words: WordGuide[] = commonWords.map((word) => ({
  word,
  width: word.length * 80,
  paths: [...word].flatMap((character, index) => {
    const template = alphabet.find((item) => item.letter.toLowerCase() === character)
    if (!template) throw new Error(`Missing letter template for ${character}`)
    return template.lowercase.map((d) => ({ d, offsetX: index * 80, scaleX: 0.8 }))
  }),
}))
