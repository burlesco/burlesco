import { fromTargetSections } from '../../core/ir.mjs';
import folha from './sites/folha.js';
import veja from './sites/veja.js';
import exame from './sites/exame.js';
import jota from './sites/jota.js';
import diariopopular from './sites/diariopopular.js';
import gauchazh from './sites/gauchazh.js';

export const sites = [folha, veja, exame, jota, diariopopular, gauchazh].map(fromTargetSections);
