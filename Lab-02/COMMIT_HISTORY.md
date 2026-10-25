# Published atomic implementation history

The original local checkpoints were replayed through the authenticated GitHub connector because the executor had no GitHub push credential. Every row is a separate published commit; no squash or force-push was used. Local IDs are retained to correlate earlier QA notes with the public history.

| Scope | Published commit | Local checkpoint | Change |
| --- | --- | --- | --- |
| Lab 02 documentation | [47fc5b1](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/47fc5b19b628264a82a43bc398ff32c47181daac) | `1ca5605` | docs(lab2): align homework paths and verification workflow |
| Homework 1 | [94572a4](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/94572a4fc9332c7732de3e4aafa23b89f5f612bd) | `04cb838` | docs(grid): define accessible directory contracts and verification plan |
| Homework 1 | [6f7595c](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/6f7595c8dbe590ee0060e9cee23be711f8f4a699) | `10cd6ae` | feat(grid): implement immutable directory query model |
| Homework 2 | [698dd61](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/698dd6185c08658f17ec922f5a0672ae7d3cd451) | `dbdcab5` | docs(audio): define queue contracts and verification slices |
| Homework 2 | [afb6d19](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/afb6d19f1cfce2241ef79e7dcb8ab4f122fca37d) | `f77076a` | feat(audio): add original demo tracks and local server |
| Homework 2 | [961f28b](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/961f28b2f18aa60e131f96247c49799026ffa05b) | `ed9b900` | feat(audio): prepare tracks with guarded cancellation |
| Homework 2 | [f9fb2b4](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/f9fb2b400ae69dacd5ef077f6abfd2ece444384c) | `eebeb1a` | feat(audio): coordinate concurrent preparation and FIFO playback |
| Homework 2 | [46a885e](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/46a885e57150ae5d8aef36a0b8e0be3d7f906b16) | `f4ed490` | feat(audio): draw analyser spectrum with managed animation loop |
| Homework 3 | [2b1d9b5](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/2b1d9b57f28c7430d48cb5540f057023000f723c) | `fd0e470` | docs(hw3): define flash sale contracts and verification slices |
| Homework 3 | [966c2b7](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/966c2b73956ff5cd1536e73a515bfabf52eef728) | `f700a1b` | feat(hw3): add deadline-based animation frame countdown |
| Homework 3 | [6097cbd](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/6097cbddfce4422c33c78dcc602e50091ae9735d) | `74676be` | feat(hw3): enforce versioned reservations and exact lock expiry |
| Homework 3 | [4dbd9d0](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/4dbd9d054307bff6c2eccc824d60118a9f4930cc) | `ad1dffd` | feat(hw3): guard checkout transitions with live attempt tokens |
| Homework 3 | [f22fd04](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/f22fd04dacdd7b72fd979ae68b55dffc88fe0d98) | `70287b9` | feat(hw3): coordinate cancellable simulated checkout payments |
| Homework 3 | [194f379](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/194f3799e07627c167d25eef9cd25c8595683815) | `d9a2a72` | feat(hw3): simulate competing shoppers and safe stock retries |
| Homework 3 | [d8dcd30](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/d8dcd3062b2f8341b4d30b123229f302331c73a4) | `74e2aef` | fix(hw3): stop countdown scheduling for invalid clock samples |
| Homework 3 | [d5ece88](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/d5ece8873dc11d0ec42a29e0f0445d8b9116a53e) | `34a3b4b` | docs(hw3): record observed failures and reproducible verification |
| Homework 2 | [bb9b629](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/bb9b629bc795ae2b491a17206970ec62dfec1cb1) | `60e7414` | feat(audio): connect accessible queue controls and lifecycle |
| Homework 2 | [9441ba9](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/9441ba9675e1d59e965852f270dba61baec56591) | `8bc7503` | style(audio): add responsive queue player layout |
| Homework 2 | [8647b8a](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/8647b8af63bbb1507a9a5d3d28e2f912ed7481db) | `ebab9e9` | docs(audio): record actual browser evidence and performance limits |
| Homework 3 | [4b3c3dc](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/4b3c3dc92fffb3e7edbaf2eb0824e1f3fed689aa) | `0dac250` | feat(hw3): build accessible flash sale storefront and focus lifecycle |
| Homework 3 | [46e98af](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/46e98af40ca0c2f1f6a6b41fbc5324aef133c96d) | `83da7e2` | docs(hw3): record browser workflows and checkout focus repair |
| Homework 1 | [a1afd1b](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/a1afd1bc87da2a086ebd14ebc7fb1bdf1b565239) | `9f4b657` | feat(grid): implement accessible table navigation and focus |
| Homework 1 | [e8046c3](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/e8046c38cd73f86b2c8cfef9079a0dce19d1e7aa) | `a766b7e` | feat(grid): assemble responsive member directory |
| Homework 1 | [b4b552c](https://github.com/Quan06-12/24521448_PhamMinhQuan/commit/b4b552c62d78d0f3151bea9a9bb9adeb69ac36ad) | `d3dceed` | docs(grid): record final browser and Lighthouse verification |

This index covers the implementation and independent-verification checkpoints. Submission-summary documentation is additionally recorded in the repository history. Evidence files are excluded from every commit.
