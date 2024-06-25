import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// Primero, inicializa el entorno de pruebas de Angular.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Luego, encuentra todas las pruebas.
const context = require.context('./', true, /\.spec\.ts$/);
// Y carga los módulos.
context.keys().map(context);