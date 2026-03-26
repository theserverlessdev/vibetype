import type { Theme } from '../types';
import { midnight } from './midnight';
import { cleanLight } from './clean-light';
import { artifact } from './artifact';
import { terminal } from './terminal';

export const themes: Theme[] = [midnight, cleanLight, artifact, terminal];

export const getTheme = (id: string): Theme =>
  themes.find((t) => t.id === id) ?? midnight;

export { midnight, cleanLight, artifact, terminal };
