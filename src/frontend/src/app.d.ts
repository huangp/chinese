export interface Score {
    character: string;
    correct: number;
    incorrect: number;
    firstSeen?: Date;
}

export interface HasClassName {
    className?: string
}

