# Video Thumbnailer

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

![Demo](./docs/demo.png)

## License

[MIT](./LICENSE)

Copyright © 2023 [Eugene Hauptmann](http://twitter.com/eugenehp)
