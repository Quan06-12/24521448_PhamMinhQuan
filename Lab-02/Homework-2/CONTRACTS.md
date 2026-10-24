# Audio queue contracts

The typed boundary is [`src/contracts.d.ts`](src/contracts.d.ts). Runtime code uses native JavaScript ES modules and the Web Audio API; there is no JSX compilation or UI framework dependency.

## State and ordering

1. Every enqueue receives a monotonic task ID and sequence, including repeats of the same track.
2. Up to three tasks prepare concurrently by default. A preparation slot covers both fetch and decode.
3. Playback is strictly FIFO by enqueue sequence among tasks that have not completed, failed or been cancelled. A ready later task cannot overtake an earlier preparation.
4. Only one `AudioBufferSourceNode` plays at a time. Each task creates at most one source.
5. State transitions are `queued → downloading → decoding → ready → playing → completed`. Failure or cancellation can terminate any pending/playing task. Terminal states never return to a live state.
6. Starting playback requires a user gesture to resume the AudioContext. Preparation can run while playback is suspended.

## Cancellation and ownership

- Each task owns one AbortController. Fetch receives its signal.
- Browser `decodeAudioData` is not abortable. Cancellation invalidates its result; a post-decode signal check discards stale buffers. A decode slot remains occupied until the browser operation settles.
- Cancellation detaches `onended`, stops/disconnects any active source, nulls its buffer and releases owned decoded buffers. Natural completion performs the same cleanup without a second stop.
- A source-start failure is terminal and must release the source. The next eligible task may proceed.
- `dispose()` is idempotent and aborts work, releases sources, disconnects graph nodes and drops listeners. The application owns and closes the AudioContext.
- Completed, failed and cancelled task history contains metadata only. Clearing finished history cannot affect live work.

## Analyser and rendering

- The control specifies **frequency bins**: 256 bins use `fftSize = 512`; 512 bins use `fftSize = 1024` (`frequencyBinCount = fftSize / 2`).
- One requestAnimationFrame loop draws the canvas at the display cadence, targeting about 60fps on a 60Hz display. It reads a reused Uint8Array, never publishes queue state or rebuilds DOM per frame.
- Queue subscribers receive immutable metadata snapshots on meaningful state changes. Canvas dimensions update on resize, outside the frame loop.
- All UI text enters the DOM through text nodes/textContent. A delegated action listener handles dynamic buttons; terminal rows remain accessible as history.

## Failure handling

HTTP failure, unreadable/invalid audio and playback failure become human-readable task errors. Failed head tasks do not block later tracks. AudioContext resume failures are reported by the application and can be retried with another gesture.
