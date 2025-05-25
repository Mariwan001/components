// // for handling video into typescript

// - create a src folder within your project pannel.
// - within the src folder create another folder and name it -> Types.
// - into the Types folder create a TypeScript index file, and name it -> custom.d.ts

// - within the file type this short code: 👇

declare module '*.mp4' {
const src: string;
export default src
}
