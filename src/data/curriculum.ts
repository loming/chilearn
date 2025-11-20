export interface CharacterData {
    char: string;
    pinyin: string;
    meaning: string;
    strokes: number;
    story: string;
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
            {
                char: '山',
                pinyin: 'shān',
                meaning: 'Mountain',
                strokes: 3,
                story: 'The mountain (山) stands tall and strong. Birds fly over the high mountain peaks.'
            },
            {
                char: '水',
                pinyin: 'shuǐ',
                meaning: 'Water',
                strokes: 4,
                story: 'Cool water (水) flows in the river. Fish swim happily in the clear water.'
            },
            {
                char: '火',
                pinyin: 'huǒ',
                meaning: 'Fire',
                strokes: 4,
                story: 'The fire (火) is warm and bright. We sit by the fire to stay warm at night.'
            },
            {
                char: '木',
                pinyin: 'mù',
                meaning: 'Wood',
                strokes: 4,
                story: 'The tree gives us wood (木). We use wood to build houses and make furniture.'
            },
            {
                char: '日',
                pinyin: 'rì',
                meaning: 'Sun',
                strokes: 4,
                story: 'The sun (日) rises in the morning. It gives us light and warmth all day long.'
            },
            {
                char: '月',
                pinyin: 'yuè',
                meaning: 'Moon',
                strokes: 4,
                story: 'The moon (月) shines at night. Sometimes it is round like a ball, sometimes like a boat.'
            },
        ],
    },
    {
        id: 'chap_2',
        title: 'Chapter 2: People',
        isLocked: true,
        characters: [
            {
                char: '人',
                pinyin: 'rén',
                meaning: 'Person',
                strokes: 2,
                story: 'Every person (人) has a story. A person can walk, run, and jump.'
            },
            {
                char: '口',
                pinyin: 'kǒu',
                meaning: 'Mouth',
                strokes: 3,
                story: 'We use our mouth (口) to eat and speak. Open your mouth to say hello!'
            },
            {
                char: '手',
                pinyin: 'shǒu',
                meaning: 'Hand',
                strokes: 4,
                story: 'I have two hands (手). My hand can hold a pencil and wave goodbye.'
            },
            {
                char: '足',
                pinyin: 'zú',
                meaning: 'Foot',
                strokes: 7,
                story: 'My foot (足) helps me stand. I use my foot to kick the ball.'
            },
            {
                char: '目',
                pinyin: 'mù',
                meaning: 'Eye',
                strokes: 5,
                story: 'I see with my eye (目). My eye can see many colors and shapes.'
            },
        ],
    },
];
