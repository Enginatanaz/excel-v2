/**
 * Curriculum Lesson Catalog
 * Stage 4: Universal Lesson Registry supporting multiple lesson types
 */

import { excelIntroductionLesson } from './excelIntroduction.ts';
import { sumFunctionLesson } from './sumFunction.ts';
import { cellFormattingLesson } from './cellFormatting.ts';
import type { Lesson } from '../../modules/learning/lessonTypes.ts';

export const allLessons: Lesson[] = [
  excelIntroductionLesson,
  sumFunctionLesson,
  cellFormattingLesson,
];

export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export { excelIntroductionLesson, sumFunctionLesson, cellFormattingLesson };
