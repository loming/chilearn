export interface CharacterData {
    char: string;
    pinyin: string;
    meaning: string;
    strokes: number;
}

export interface ChapterData {
    id: string;
    title: string;
    characters: CharacterData[];
    isLocked: boolean;
}

export const CURRICULUM: ChapterData[] = [
    {
        id: 'chap_1',
        title: 'Chapter 1: Nature',
        isLocked: false,
        characters: [
            { char: '山', pinyin: 'shān', meaning: 'Mountain', strokes: 3 },
            { char: '水', pinyin: 'shuǐ', meaning: 'Water', strokes: 4 },
            { char: '火', pinyin: 'huǒ', meaning: 'Fire', strokes: 4 },
            { char: '木', pinyin: 'mù', meaning: 'Wood', strokes: 4 },
            { char: '日', pinyin: 'rì', meaning: 'Sun', strokes: 4 },
            { char: '月', pinyin: 'yuè', meaning: 'Moon', strokes: 4 },
        ],
    },
    {
        id: 'chap_2',
        title: 'Chapter 2: People',
        isLocked: true,
        characters: [
            { char: '人', pinyin: 'rén', meaning: 'Person', strokes: 2 },
            { char: '口', pinyin: 'kǒu', meaning: 'Mouth', strokes: 3 },
            { char: '手', pinyin: 'shǒu', meaning: 'Hand', strokes: 4 },
            { char: '足', pinyin: 'zú', meaning: 'Foot', strokes: 7 },
            { char: '目', pinyin: 'mù', meaning: 'Eye', strokes: 5 },
        ],
    },
];
