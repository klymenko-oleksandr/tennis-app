// jsdom doesn't provide TextEncoder/TextDecoder, which react-router needs.
import { TextDecoder, TextEncoder } from 'node:util';

Object.assign(globalThis, { TextEncoder, TextDecoder });
