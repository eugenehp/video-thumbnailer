<script lang="ts">
  import { videos } from "$lib";
  import { onMount } from "svelte";
  import { VideoThumbnailer } from "video-thumbnailer";

  const thumbnailer = new VideoThumbnailer();
  let src: string = "";
  let loaded = false;
  let working = false;
  let diff_loading = 0;
  let diff_thumbnail = 0;
  $: total = diff_loading + diff_thumbnail;

  const now = () => new Date().getTime();
  const getDiff = (start: number) => Math.round((now() - start) / 1000);

  const load = async () => {
    let start = now();
    // console.log("before load");
    await thumbnailer.load();
    // console.log("after load");
    loaded = true;
    diff_loading = getDiff(start);
  };

  onMount(load);

  const convertURL = async () => {
    working = true;
    let start = now();
    const data = await thumbnailer.getThumbnail({ url: videos[0] });
    const blob = URL.createObjectURL(new Blob([data], { type: "image/png" }));
    src = blob;
    diff_thumbnail = getDiff(start);
    working = false;
  };

  const convertFile = async (e: Event) => {
    //@ts-ignore
    const file = e.target!.files[0];

    working = true;
    let start = now();
    const data = await thumbnailer.getThumbnail({ file });
    const blob = URL.createObjectURL(new Blob([data], { type: "image/png" }));
    src = blob;
    diff_thumbnail = getDiff(start);
    working = false;
  };
</script>

<h1>Welcome to 🎥 Video Thumbnailer</h1>

{#if loaded}
  {#if working}
    <p>FFMPEG is working...</p>
  {:else}
    <div>
      <button on:click={() => convertURL()}>Convert URL</button>
      <input
        type="file"
        name="Convert File"
        on:change={(e) => convertFile(e)}
        accept=".mp4"
      />
    </div>
  {/if}
{:else}
  <p>loading FFMPEG...</p>
{/if}

<br />

{#if total > 0}
  <div>
    <p>FFMPEG loaded in {diff_loading} seconds</p>
    {#if diff_thumbnail > 0}
      <p>Thumbnail generation took {diff_thumbnail} seconds</p>
      <p>Total: {total} seconds</p>
    {/if}
  </div>
{/if}

{#if src.length > 0}
  <img {src} alt="thumbnail" />
{/if}
