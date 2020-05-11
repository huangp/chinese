export interface Score {
    character: string;
    correct: number;
    incorrect: number;
    firstSeen?: Date;
}

export interface HasClassName {
    className?: string
}

export interface User {
    username: string;
    name: string
}