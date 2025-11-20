declare module 'hanzi-writer' {
  export interface HanziWriterOptions {
    charDataLoader?: (char: string, onComplete: (data: any) => void) => void;
    width?: number;
    height?: number;
    padding?: number;
    showOutline?: boolean;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
    radicalColor?: string;
    strokeColor?: string;
    outlineColor?: string;
    drawingWidth?: number;
    showCharacter?: boolean;
    showHintAfterMisses?: number;
    highlightOnComplete?: boolean;
    highlightCompleteColor?: string;
  }

  export default class HanziWriter {
    static create(element: HTMLElement | string, character: string, options?: HanziWriterOptions): HanziWriter;
    animateCharacter(options?: { onComplete?: () => void }): void;
    quiz(options?: { onComplete?: (summary: any) => void; onMistake?: (strokeData: any) => void; onCorrectStroke?: (strokeData: any) => void }): void;
    hideCharacter(): void;
    showCharacter(): void;
    showOutline(): void;
    hideOutline(): void;
    setCharacter(character: string): void;
  }
}
