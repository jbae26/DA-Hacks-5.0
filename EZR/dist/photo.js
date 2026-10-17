const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const CATEGORY_NAMES = {
  tshirt: "T-shirt",
  pants: "Pants",
  underwear: "Underwear (briefs or boxers)",
};
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

/** Wires the photo tab without uploading or persisting images or entered details. */
export function initPhoto({ onConfirm }) {
  if (typeof onConfirm !== "function")
    throw new TypeError("Photo confirmation callback is required.");
  const byId = (id) => document.getElementById(id);
  const input = byId("photo-input");
  const cameraInput = byId("camera-input");
  const takePhoto = byId("take-photo");
  const choosePhoto = byId("choose-photo");
  const dropZone = byId("upload-zone");
  const preview = byId("photo-preview");
  const previewImage = byId("uploaded-photo");
  const remove = byId("remove-photo");
  const analyze = byId("analyze-photo");
  const cancel = byId("cancel-analysis");
  const status = byId("photo-status");
  const confirmation = byId("photo-confirmation");
  const suggestions = byId("photo-suggestions");
  const form = byId("photo-form");
  const categoryInput = byId("photo-category");
  if (
    ![
      input,
      dropZone,
      preview,
      previewImage,
      remove,
      analyze,
      cancel,
      status,
      confirmation,
      suggestions,
      form,
      categoryInput,
    ].every(Boolean)
  )
    return { destroy() {} };

  let selectedFile = null;
  let previewURL = null;
  let previewReady = false;
  let worker = null;
  let busy = false;
  let requestId = 0;
  let timeout = null;
  let destroyed = false;
  let lastProgressStep = -1;
  let sampleController = null;
  let sampleLoadId = 0;
  const events = new AbortController();
  const listen = (target, type, handler) =>
    target.addEventListener(type, handler, { signal: events.signal });
  const announce = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle("photo-error", error);
  };
  const setBusy = (value) => {
    busy = value;
    analyze.disabled = value || !selectedFile || !previewReady;
    analyze.setAttribute("aria-busy", String(value));
    cancel.hidden = !value;
    byId("panel-photo").setAttribute("aria-busy", String(value));
  };
  const stopWorker = () => {
    requestId += 1;
    clearTimeout(timeout);
    timeout = null;
    worker?.terminate();
    worker = null;
    setBusy(false);
  };
  const resetPreview = () => {
    sampleLoadId += 1;
    sampleController?.abort();
    sampleController = null;
    sampleButton.disabled = false;
    sampleCaption.hidden = true;
    stopWorker();
    selectedFile = null;
    previewReady = false;
    previewImage.onload = null;
    previewImage.onerror = null;
    previewImage.removeAttribute("src");
    if (previewURL) URL.revokeObjectURL(previewURL);
    previewURL = null;
    preview.hidden = true;
    input.value = "";
    if (cameraInput) cameraInput.value = "";
    suggestions.replaceChildren();
    form.reset();
    setBusy(false);
  };
  const manualMessage = () => {
    suggestions.innerHTML =
      '<p class="photo-manual-note">Use a photo of the garment laid flat or on a hanger to choose a search category. You can also search T-shirts, pants, or underwear (briefs and boxers) below without downloading the image model. Bras are not in this catalog. Add optional fabric keywords to narrow your search; the photo cannot verify them.</p>';
  };

  // Manual confirmation remains available even offline or on unsupported devices.
  confirmation.hidden = false;
  manualMessage();
  dropZone.tabIndex = 0;
  dropZone.setAttribute("role", "button");
  dropZone.setAttribute(
    "aria-label",
    "Choose a garment photo, laid flat or on a hanger. JPEG, PNG or WebP, up to 8 megabytes.",
  );
  for (const button of [remove, analyze, cancel]) button.type = "button";
  const downloadNotice = document.createElement("p");
  downloadNotice.className = "photo-download-note";
  downloadNotice.textContent =
    "Optional analysis downloads about 154 MB of model weights plus runtime files on first use. Downloads come from Hugging Face and jsDelivr; the photo stays on this device. Model files may be cached by your browser.";
  analyze.before(downloadNotice);
  const sampleButton = document.createElement("button");
  sampleButton.id = "try-sample-photo";
  sampleButton.type = "button";
  sampleButton.className = "text-link photo-sample-button";
  sampleButton.textContent = "Try a sample photo";
  const sampleCaption = document.createElement("small");
  sampleCaption.className = "photo-sample-note";
  sampleCaption.textContent =
    "Sample photo: Terra Thread cotton T-shirt from our catalog. The product name and fabric come from its catalog listing, not photo analysis. This manufacturer image is not your uploaded photo. Click Analyze photo to run the same on-device model.";
  sampleCaption.hidden = true;
  downloadNotice.before(sampleButton, sampleCaption);

  async function acceptFile(file, { sample = false, fromCamera = false } = {}) {
    // A canceled picker must not erase a photo already selected for analysis.
    if (!file) return;
    resetPreview();
    manualMessage();
    if (!ALLOWED_TYPES.has(file.type)) {
      announce(
        fromCamera
          ? "This camera photo format is not supported. HEIC/HEIF files cannot be read here. Choose a JPEG, PNG or WebP from photos, or select the garment type manually below."
          : "Choose a JPEG, PNG or WebP image. HEIC/HEIF files are not supported. You can also choose the garment type manually below.",
        true,
      );
      return;
    }
    if (!file.size || file.size > MAX_BYTES) {
      announce(
        "Use an image smaller than or equal to 8 MB. Manual garment selection is still available below.",
        true,
      );
      return;
    }
    selectedFile = file;
    sampleCaption.hidden = !sample;
    previewImage.alt = sample
      ? "Sample catalog photo of a Terra Thread T-shirt"
      : fromCamera
        ? "Your garment photo from the camera picker"
        : "Your uploaded garment";
    previewURL = URL.createObjectURL(file);
    const currentURL = previewURL;
    preview.hidden = false;
    announce("Reading your photo locally…");
    previewImage.onload = () => {
      if (previewURL !== currentURL || destroyed) return;
      if (
        !previewImage.naturalWidth ||
        previewImage.naturalWidth * previewImage.naturalHeight > 40_000_000
      ) {
        resetPreview();
        manualMessage();
        announce(
          "This image is too large to process safely. Use a photo below 40 megapixels, or select the garment manually.",
          true,
        );
        return;
      }
      previewReady = true;
      setBusy(false);
      announce(
        `${sample ? "Sample photo" : "Garment photo"} ready. Analyze it on this device, or confirm the garment type below. Fiber composition, finishes, latex and seam construction cannot be verified from this photo. The model does not assess skin or predict personal comfort.`,
      );
    };
    previewImage.onerror = () => {
      if (previewURL !== currentURL || destroyed) return;
      resetPreview();
      manualMessage();
      announce(
        "This file could not be read as an image. Try another photo, or choose the garment type manually.",
        true,
      );
    };
    previewImage.src = currentURL;
  }

  function renderSuggestions(predictions) {
    const valid = Array.isArray(predictions)
      ? predictions
          .filter(
            (prediction) =>
              typeof prediction?.label === "string" &&
              Number.isFinite(prediction.score),
          )
          .slice(0, 3)
      : [];
    if (!valid.length) throw new Error("No image suggestions returned.");
    const topCategory = valid[0].category;
    const uncertain =
      valid[0].score < 0.42 ||
      (valid.length > 1 && valid[0].score - valid[1].score < 0.08);
    // Selecting a suggested value is never equivalent to user confirmation.
    categoryInput.value =
      !uncertain && Object.hasOwn(CATEGORY_NAMES, topCategory)
        ? topCategory
        : "";
    suggestions.innerHTML = `<div class="photo-match"><h3>Possible visual matches</h3><p>These are relative similarity scores among a limited set of labels—not confidence, identification certainty, fabric analysis or a medical assessment. Folded clothing and similar shapes can make garment types difficult to distinguish.</p><ol class="photo-match-list">${valid
      .map((prediction) => {
        const category = Object.hasOwn(CATEGORY_NAMES, prediction.category)
          ? prediction.category
          : null;
        const percentage = Math.max(0, Math.min(100, prediction.score * 100));
        return `<li><div><strong>${escapeHTML(prediction.label)}</strong><span>${percentage.toFixed(1)}% relative similarity</span></div>${category ? `<button class="text-link" type="button" data-photo-category="${escapeHTML(category)}">Choose ${escapeHTML(CATEGORY_NAMES[category])}</button>` : "<small>Outside our current catalog</small>"}</li>`;
      })
      .join(
        "",
      )}</ol><p>${!Object.hasOwn(CATEGORY_NAMES, topCategory) ? "The leading match is outside this catalog. Choose a category only if it accurately describes your garment." : uncertain ? "The visual match is uncertain. Choose and confirm the actual garment type below." : "Confirm or correct the garment type below."} Fabric composition, finishes and construction remain unverified. Check the label and product details. A photo cannot establish whether a garment will suit your skin.</p></div>`;
  }

  function failAnalysis(message) {
    stopWorker();
    manualMessage();
    announce(message, true);
  }

  function startAnalysis() {
    if (!selectedFile || !previewReady || busy || destroyed) return;
    if (!globalThis.Worker || !globalThis.WebAssembly) {
      announce(
        "On-device image analysis is not supported by this browser. Choose the garment type below to continue.",
        true,
      );
      return;
    }
    const jobId = ++requestId;
    lastProgressStep = -1;
    setBusy(true);
    suggestions.replaceChildren();
    announce(
      "Starting the local image model. The first run downloads about 154 MB plus runtime files; you can cancel or use manual selection below.",
    );
    try {
      worker ??= new Worker(
        new URL("./vision-worker.js?v=clothing1", import.meta.url),
        {
          type: "module",
        },
      );
      worker.onmessage = ({ data }) => {
        if (destroyed || data?.id !== requestId || !busy) return;
        if (data.type === "progress") {
          if (data.phase === "inference")
            announce(
              "Comparing your photo with garment categories on this device…",
            );
          else if (Number.isFinite(data.progress)) {
            const step = Math.floor(data.progress / 5) * 5;
            if (step !== lastProgressStep) {
              lastProgressStep = step;
              announce(
                `Downloading model file: ${Math.max(0, Math.min(100, step))}%. More files may follow. Your photo remains on this device; manual selection is available below.`,
              );
            }
          }
          return;
        }
        if (data.type === "result") {
          clearTimeout(timeout);
          timeout = null;
          setBusy(false);
          try {
            renderSuggestions(data.predictions);
            announce(
              "Visual suggestions are ready. Confirm or correct the garment type to search the catalog. The model cannot verify fibers, finishes, latex or individual skin tolerance.",
            );
          } catch {
            failAnalysis(
              "No usable visual suggestion was returned. Choose the garment type manually below.",
            );
          }
        } else if (data.type === "error") {
          failAnalysis(
            "The local image model could not finish. A download, memory, or browser limitation may be responsible. Retry, or choose the garment type below.",
          );
        }
      };
      worker.onerror = (event) => {
        event.preventDefault();
        if (jobId !== requestId || destroyed) return;
        failAnalysis(
          "Image analysis could not load in this browser. Your photo was not uploaded. Choose a garment type below, or retry.",
        );
      };
      worker.onmessageerror = () => {
        if (jobId === requestId && !destroyed)
          failAnalysis(
            "The browser could not read the analysis result. Choose the garment type below.",
          );
      };
      timeout = setTimeout(() => {
        if (jobId === requestId)
          failAnalysis(
            "Analysis timed out after 3 minutes. It has been stopped. Try again on a faster connection, or select the garment type below.",
          );
      }, 180_000);
      worker.postMessage({ type: "analyze", id: jobId, image: selectedFile });
    } catch {
      failAnalysis(
        "This browser could not start local image analysis. Choose the garment type manually below.",
      );
    }
  }

  listen(input, "change", () => acceptFile(input.files?.[0]));
  if (cameraInput && takePhoto) {
    listen(takePhoto, "click", () => {
      // Keep this synchronous: mobile browsers require a user gesture.
      // Clearing only the input permits a retake with the same filename.
      cameraInput.value = "";
      cameraInput.click();
    });
    listen(cameraInput, "change", () =>
      acceptFile(cameraInput.files?.[0], { fromCamera: true }),
    );
  }
  if (choosePhoto) listen(choosePhoto, "click", () => input.click());
  listen(sampleButton, "click", async () => {
    resetPreview();
    manualMessage();
    const loadId = ++sampleLoadId;
    sampleController = new AbortController();
    sampleButton.disabled = true;
    announce("Loading the sample garment photo from this website…");
    try {
      const response = await fetch("/assets/terra-tee.jpg", {
        signal: sampleController.signal,
      });
      if (!response.ok) throw new Error("Sample image unavailable.");
      const blob = await response.blob();
      if (destroyed || loadId !== sampleLoadId) return;
      await acceptFile(
        new File([blob], "sample-terra-thread-tshirt.jpg", {
          type: "image/jpeg",
        }),
        { sample: true },
      );
    } catch (error) {
      if (destroyed || loadId !== sampleLoadId || error?.name === "AbortError")
        return;
      announce(
        "The sample photo could not load. Try again, choose your own photo, or select a garment type manually below.",
        true,
      );
    } finally {
      if (loadId === sampleLoadId) {
        sampleController = null;
        sampleButton.disabled = false;
      }
    }
  });
  listen(dropZone, "keydown", (event) => {
    if (event.target !== dropZone) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      input.click();
    }
  });
  for (const eventName of ["dragenter", "dragover"])
    listen(dropZone, eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("drag-over");
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    });
  listen(dropZone, "dragleave", () => dropZone.classList.remove("drag-over"));
  listen(dropZone, "drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");
    const files = event.dataTransfer?.files;
    if (files?.length !== 1) {
      announce("Choose one garment photo at a time.", true);
      return;
    }
    acceptFile(files[0]);
  });
  listen(analyze, "click", startAnalysis);
  listen(cancel, "click", () => {
    stopWorker();
    manualMessage();
    announce(
      "Analysis canceled and the model worker stopped. Your photo remains only in this preview. Select a garment type below or try again.",
    );
    analyze.focus();
  });
  listen(remove, "click", () => {
    resetPreview();
    manualMessage();
    announce(
      "Photo removed. Choose another photo, or select the garment type manually.",
    );
    dropZone.focus();
  });
  listen(suggestions, "click", (event) => {
    const button = event.target.closest("[data-photo-category]");
    if (!button || !Object.hasOwn(CATEGORY_NAMES, button.dataset.photoCategory))
      return;
    categoryInput.value = button.dataset.photoCategory;
    categoryInput.focus();
  });
  listen(form, "submit", (event) => {
    event.preventDefault();
    if (
      !form.reportValidity() ||
      !Object.hasOwn(CATEGORY_NAMES, categoryInput.value)
    )
      return;
    sampleLoadId += 1;
    sampleController?.abort();
    sampleController = null;
    sampleButton.disabled = false;
    stopWorker();
    const materials = String(new FormData(form).get("materials") ?? "")
      .trim()
      .slice(0, 220);
    const category = categoryInput.value;
    onConfirm({
      category,
      materials,
      query: `Photo: ${CATEGORY_NAMES[category]}`,
    });
    announce(
      "Searching the catalog using your confirmed garment type and any fabric keywords you entered. Those keywords remain unverified by the image model. No diagnosis or personal tolerance prediction is made.",
    );
  });
  listen(window, "pagehide", () => {
    resetPreview();
    manualMessage();
  });

  return {
    destroy() {
      destroyed = true;
      events.abort();
      resetPreview();
      downloadNotice.remove();
      sampleButton.remove();
      sampleCaption.remove();
    },
  };
}
