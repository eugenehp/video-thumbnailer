# Video Thumbnailer

[![GitHub license](https://img.shields.io/github/license/eugenehp/video-thumbnailer.svg?color=blue&style=for-the-badge)](./LICENSE)
[![npm](https://img.shields.io/npm/v/video-thumbnailer.svg?color=green&style=for-the-badge)](https://www.npmjs.com/package/video-thumbnailer)
[![npm downloads](https://img.shields.io/npm/dw/video-thumbnailer.svg?label=npm%20downloads&style=for-the-badge)](https://npmcharts.com/compare/video-thumbnailer?minimal=true)
[![total npm downloads](https://img.shields.io/npm/dt/video-thumbnailer.svg?label=total%20npm%20downloads&style=for-the-badge)](https://npmcharts.com/compare/video-thumbnailer?minimal=true)
[![GitHub watchers](https://img.shields.io/github/watchers/eugenehp/video-thumbnailer.svg?style=for-the-badge)](https://github.com/eugenehp/video-thumbnailer/watchers)
[![GitHub stars](https://img.shields.io/github/stars/eugenehp/video-thumbnailer.svg?label=GitHub%20stars&style=for-the-badge)](https://github.com/eugenehp/video-thumbnailer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/eugenehp/video-thumbnailer.svg?style=for-the-badge)](https://github.com/eugenehp/video-thumbnailer/network/members)
[![open bugs](https://img.shields.io/github/issues-raw/eugenehp/video-thumbnailer/bug.svg?color=d73a4a&label=open%20bugs&style=for-the-badge)](https://github.com/eugenehp/video-thumbnailer/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug)
[![total open issues](https://img.shields.io/github/issues-raw/eugenehp/video-thumbnailer.svg?label=total%20open%20issues&style=for-the-badge)](https://github.com/eugenehp/video-thumbnailer/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/eugenehp/video-thumbnailer.svg?style=for-the-badge)](https://github.com/eugenehp/video-thumbnailer/pulls)

Get thumbnails from video files (mp4) in a browser using [ffmpeg](https://ffmpeg.org) via [wasm](https://webassembly.org)

```shell
npm install video-thumbnailer
```

## Getting started

You can find full example in [example/src/routes/+page.svelte](example/src/routes/+page.svelte) built with [SvelteKit](https://kit.svelte.dev)

```typescript
import { VideoThumbnailer } from "video-thumbnailer";

await thumbnailer.load();
// or you can select a File from the browser
const urlOrFile =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// contains a Blob that can be directly set to img.src
const image = await thumbnailer.getThumbnail(urlOrFile);
```

## Demo

To run the demo:

```shell
cd example
npm run dev
# navigate to http://localhost:5173
```

![Demo](./docs/demo.png)

## Development

To build the library:

```shell
cd video-thumbnailer
npm run build
```

## License

[MIT](./LICENSE)

Copyright © 2023 [Eugene Hauptmann](http://twitter.com/eugenehp)
