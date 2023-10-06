import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const FFMPEG_CORE_VERSION = `0.12.3`;
const DEFAULT_EXTENSION = "mp4";
const DEFAULT_TIMEOUT = 30 * 10000; // timeout for ffmpeg.exec

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

    this.ffmpeg.on("progress", ({ progress, time }) => {
      console.log(`${progress * 100} % (transcoded time: ${time / 1000000} s)`);
    });

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
    // console.log("getThumbnail -> fetchFile");
    await this.ffmpeg.writeFile(input, file);
    // console.log("getThumbnail -> writeFile");
  };

  /** rename given input name to `input.ext` where `ext` taken from the input */
  private getInputName = (
    fileOrURL: File | string,
    extension = DEFAULT_EXTENSION
  ) => {
    const ext =
      (typeof fileOrURL == "string"
        ? fileOrURL.split(".").pop()
        : fileOrURL.name.split(".").pop()) || extension;
    return `input.${ext}`;
  };

  /** get duration of the video input */
  getMetadata = async (input: string) => {
    let logs: string[] = [];

    const onLog = ({ message }: any) => {
      logs.push(message);
    };

    this.ffmpeg.on("log", onLog);
    await this.ffmpeg.exec(["-i", input]);
    this.ffmpeg.off("log", onLog);

    // console.log("getMetadata", logs);

    let duration_str = "";
    logs.map((line) => {
      // Duration: 00:00:05.50, start: 0.000000, bitrate: 7895 kb/s
      // HH:mm::ss.ms
      if (line.includes(" Duration: ")) {
        let array = line.trim().split(" ");
        duration_str = array[1].slice(0, -1);
      }
    });

    let duration = duration_str.includes(".")
      ? parseInt(duration_str.split(".")[1])
      : 0;

    let [HH, mm, ss]: number[] = duration_str
      .split(".")[0]
      .split(":")
      .map((s) => parseInt(s));

    const seconds = 1000; // in milliseconds
    const minutes = 60 * seconds; // in milliseconds
    const hours = 60 * minutes; // in milliseconds

    duration += ss * seconds; // seconds
    duration += mm * minutes; // minutes
    duration += HH * hours; // hours

    return {
      duration, // in milliseconds
    };
  };

  /** get thumbnail for an earlier provided input.
   *
   * @returns a `Blob` of an image (PNG or JPG, PNG is default)
   */
  getThumbnail = async (
    fileOrURL: File | string,
    timestamp: string = "00:00:01.000",
    outputExtension: "jpg" | "png" = "png",
    extension = DEFAULT_EXTENSION,
    timeout = DEFAULT_TIMEOUT
  ): Promise<Blob> => {
    const output = `output.${outputExtension}`;
    const input = this.getInputName(fileOrURL, extension);
    await this.addFile(fileOrURL, input);
    // const metadata = await this.getMetadata(input);
    // console.log({ metadata });

    const ok =
      0 ==
      (await this.ffmpeg.exec(
        [["-i", input], ["-ss", timestamp], ["-vframes", "1"], output].flat(),
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
