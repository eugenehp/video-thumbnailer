/**  parses input string like `00:00:05.50` to 5500 ms
 * @returns number of milliseconds
 */
export const parseTimestamp = (input: string) => {
  let duration = input.includes(".") ? parseInt(input.split(".")[1]) : 0;

  let [HH, mm, ss]: number[] = input
    .split(".")[0]
    .split(":")
    .map((s) => parseInt(s));

  const seconds = 1000; // in milliseconds
  const minutes = 60 * seconds; // in milliseconds
  const hours = 60 * minutes; // in milliseconds

  duration += ss * seconds; // seconds
  duration += mm * minutes; // minutes
  duration += HH * hours; // hours

  return duration;
};
