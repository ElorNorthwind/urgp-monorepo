// const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
// const { join } = require('path');

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     join(
//       __dirname,
//       '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
//     ),
//     ...createGlobPatternsForDependencies(__dirname),
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

// // eslint-disable-next-line @nx/enforce-module-boundaries
// import { buildConfig } from '../../libs/util/tailwind.config';

// export default buildConfig(__dirname);

const buildConfig = require('../../libs/util/tailwind.config');
module.exports = buildConfig(__dirname);
