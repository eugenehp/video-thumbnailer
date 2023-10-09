import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { parseTimestamp } from "./utils";

const FFMPEG_CORE_VERSION = `0.12.3`;
const DEFAULT_EXTENSION = "mp4";
const DEFAULT_TIMEOUT = 30 * 10000; // timeout for ffmpeg.exec

type Options = {
  file: File | undefined;
  url: string | undefined;
  timestamp: string;
  width: number;
  outputExtension: "jpg" | "png";
  extension: "mp4";
  timeout: number;
};

const defaultOptions: Partial<Options> = {
  timestamp: "00:00:01.000",
  width: 360,
  outputExtension: "png",
  extension: DEFAULT_EXTENSION,
  timeout: DEFAULT_TIMEOUT,
};

export class VideoThumbnailer {
  private ffmpeg: FFmpeg;
  //@ts-ignore
  private message = "";
  //@ts-ignore
  private loaded = false;

  constructor() {
    this.ffmpeg = new FFmpeg();
  }

  /** Loads FFMPEG instance into the WebWorker inside WASM using `unpkg.com` CDN */
  load = async () => {
    const baseURL = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/esm`;

    // this.ffmpeg.on("progress", ({ progress, time }) => {
    //   console.log(`${progress * 100} % (transcoded time: ${time / 1000000} s)`);
    // });

    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    this.loaded = true;
  };

  /** Terminates WebWorker and WASM FFMPEG, to use the library again, you'll need to call `load()` again */
  unload = () => {
    this.loaded = false;
    this.ffmpeg.terminate();
  };

  /** Adds a file that can be later pulled by FFMPEG as an input */
  addFile = async (fileOrURL: File | string, input: string) => {
    let file = await fetchFile(fileOrURL);
    // console.log("getThumbnail -> fetchFile", file);
    try {
      await this.ffmpeg.deleteFile(input);
    } catch (err) {}
    await this.ffmpeg.writeFile(input, file);
    // console.log("getThumbnail -> writeFile");
  };

  /** rename given input name to `input.ext` where `ext` taken from the input */
  private getInputName = (fileName: string, extension = DEFAULT_EXTENSION) => {
    const ext = fileName.split(".").pop() || extension;
    return `input.${ext}`;
  };

  /** get duration of the video input */
  getMetadata = async (input: string) => {
    let logs: string[] = [];
    let streams: any[] = [];
    let durations: number[] = [];

    const onLog = ({ message }: any) => {
      logs.push(message);
    };

    this.ffmpeg.on("log", onLog);
    await this.ffmpeg.exec(["-i", input]);
    this.ffmpeg.off("log", onLog);

    // console.log("getMetadata", logs);

    logs.map((line) => {
      // Duration: 00:00:05.50, start: 0.000000, bitrate: 7895 kb/s
      // HH:mm::ss.ms
      if (line.includes(" Duration: ")) {
        let array = line.trim().split(" ");
        durations.push(parseTimestamp(array[1].slice(0, -1)));
      }

      if (line.trim().startsWith("Stream #")) {
        streams.push(line.trim());
      }
    });

    // from  "Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(progressive), 1920x1080 [SAR 1:1 DAR 16:9], 24559 kb/s, 30 fps, 3…"
    // to { width: 1920, height: 1080 }
    const dimensions = streams.map((s) => {
      const [w, h] = s
        .split(": ")
        .slice(-1)[0]
        .split(", ")[2]
        .split(" ")[0]
        .split("x");
      const width = parseInt(w);
      const height = parseInt(h);
      return { width, height };
    });

    // console.log("getMetadata", streams);
    const { width, height } = dimensions[0];

    return {
      duration: durations[0], // in milliseconds
      width,
      height,
    };
  };

  /** get thumbnail for an earlier provided input.
   * @param options @type Options
   * @returns a `Blob` of an image (PNG or JPG, PNG is default)
   */
  getThumbnail = async (
    options: Partial<Options> = defaultOptions
  ): Promise<Blob> => {
    const opts = { ...defaultOptions, ...options } as Options;
    const { outputExtension, file, url, extension, timeout, timestamp, width } =
      opts;
    const output = `output.${outputExtension}`;
    const input = this.getInputName(file ? file.name : url!, extension);
    await this.addFile(file || url!, input);
    // const metadata = await this.getMetadata(input);
    // console.log({ metadata });

    const ok =
      0 ==
      (await this.ffmpeg.exec(
        [
          ["-i", input],
          ["-ss", timestamp],
          ["-vframes", "1"],
          ["-vf", `scale=${width}:-1`],
          output,
        ].flat(),
        timeout
      ));

    if (!ok) {
      throw new Error("ffmpeg command failed");
    }

    // console.log("ffmpeg -> getThumbnail", ok);
    // ffmpeg -ss 00:00:01.00 -i input.mp4 -vf 'scale=320:320:force_original_aspect_ratio=decrease' -vframes 1 output.jpg

    const data = await this.ffmpeg.readFile(output);
    // let blob = URL.createObjectURL(new Blob([data], { type: "image/png" }));
    const blob = new Blob([data], { type: "image/png" });

    return blob;
  };
}
