// Image pixels stay in this worker. Only model/runtime files are fetched remotely.
// https://huggingface.co/docs/transformers.js/v3.8.1/en/api/pipelines
// https://huggingface.co/Xenova/clip-vit-base-patch32/tree/main/onnx
const MODEL_ID = "Xenova/clip-vit-base-patch32";
const CANDIDATES = [
  { label: "a T-shirt", display: "T-shirt", category: "tshirt" },
  {
    label: "a pair of pants, trousers or jeans",
    display: "Pants",
    category: "pants",
  },
  {
    label: "a pair of underwear briefs or boxer shorts",
    display: "Underwear: briefs or boxers",
    category: "underwear",
  },
  {
    label: "a bra or bralette",
    display: "Bra — outside this catalog",
    category: null,
  },
  { label: "a dress or a skirt", display: "Dress or skirt", category: null },
  { label: "a jacket or a coat", display: "Jacket or coat", category: null },
  { label: "a pair of socks", display: "Socks", category: null },
  { label: "shoes or footwear", display: "Shoes", category: null },
  {
    label: "a bottle or jar of skincare cream",
    display: "Skincare product",
    category: null,
  },
  {
    label: "a bottle of laundry detergent",
    display: "Laundry detergent",
    category: null,
  },
  { label: "a toothbrush", display: "Toothbrush", category: null },
  {
    label: "a drinking water bottle or cup",
    display: "Bottle or cup",
    category: null,
  },
  {
    label: "a food storage container or lunch box",
    display: "Food container",
    category: null,
  },
  {
    label: "a phone or electronic device",
    display: "Electronic device",
    category: null,
  },
  { label: "a bag or backpack", display: "Bag", category: null },
  {
    label: "a person, skin or a body part",
    display: "Person or skin — use a garment photo",
    category: null,
  },
  { label: "an animal", display: "Animal", category: null },
  {
    label: "a landscape or a building",
    display: "Landscape or building",
    category: null,
  },
  {
    label: "a book or a document",
    display: "Book or document",
    category: null,
  },
  { label: "food on a plate", display: "Food or dish", category: null },
];
let library = null;
let classifierPromise = null;
let active = false;
let currentId = null;
let lastProgressTime = 0;

async function loadClassifier() {
  library ??= await import(
    "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js"
  );
  const { env, pipeline } = library;
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  // A single WASM thread works without cross-origin isolation headers.
  env.backends.onnx.wasm.numThreads = 1;
  env.backends.onnx.wasm.proxy = false;
  classifierPromise ??= pipeline("zero-shot-image-classification", MODEL_ID, {
    device: "wasm",
    dtype: "q8",
    progress_callback: (progress) => {
      const now = performance.now();
      if (progress.status === "progress" && now - lastProgressTime > 200) {
        lastProgressTime = now;
        self.postMessage({
          type: "progress",
          id: currentId,
          phase: "download",
          progress: progress.progress,
        });
      }
    },
  });
  return classifierPromise;
}

self.addEventListener("message", async ({ data }) => {
  if (data?.type !== "analyze" || active) return;
  const { id, image } = data;
  active = true;
  currentId = id;
  try {
    if (
      !(image instanceof Blob) ||
      image.size === 0 ||
      image.size > 8 * 1024 * 1024
    )
      throw new Error("Invalid image input.");
    const classifier = await loadClassifier();
    const pixels = await library.RawImage.fromBlob(image);
    self.postMessage({ type: "progress", id, phase: "inference" });
    const predictions = await classifier(
      pixels,
      CANDIDATES.map((candidate) => candidate.label),
    );
    const normalized = predictions
      .map((prediction) => {
        const candidate = CANDIDATES.find(
          (item) => item.label === prediction.label,
        );
        return {
          label: candidate?.display ?? "Unrecognized item",
          category: candidate?.category ?? null,
          score: prediction.score,
        };
      })
      .filter((prediction) => Number.isFinite(prediction.score))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    self.postMessage({ type: "result", id, predictions: normalized });
  } catch {
    classifierPromise = null;
    self.postMessage({ type: "error", id });
  } finally {
    active = false;
  }
});
