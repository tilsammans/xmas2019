/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ROOT  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Main entry point for client-side JavaScript, bundled as IIFE.      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

// DEPENDENCIES
require('dotenv').config();

// modules
import { smooth } from 'modules/scroll';

// components
import header from 'headers/1/_';
import nav from 'navigation/1/_';
import pinPad from 'forms/2/_';

// EXECUTION
document.addEventListener('DOMContentLoaded', () => {

    nav();
    smooth();
    header();

    pinPad(document.querySelector('.pinpad'));
});
