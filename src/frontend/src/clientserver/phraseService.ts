let counter = 0

export const nextPhrase = (phrases: string[]): string => {
    if (phrases.length === 0) {
        return ""
    }
    if (counter < phrases.length) {
        return phrases[counter++]
    } else {
        counter = 0
        return nextPhrase(phrases)
    }
}

