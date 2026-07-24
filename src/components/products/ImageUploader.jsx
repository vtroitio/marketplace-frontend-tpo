import { TrashIcon, PlusIcon } from "../icons";

const MAX_FILE_SIZE_MB = 5;
const API_URL = import.meta.env.VITE_API_URL;

function resolveImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

export function ImageUploader({ images = [], onChange, maxImages = 4 }) {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const oversized = files.filter(
      (f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );

    if (oversized.length > 0) {
      alert(`Las imágenes no pueden superar los ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const nextImages = [...images, ...newImages].slice(0, maxImages);
    onChange(nextImages);
  };

  const removeImage = (indexToRemove) => {
    const nextImages = images.filter((_, index) => index !== indexToRemove);
    onChange(nextImages);
  };

  const moveImage = (index, direction) => {
    const nextImages = [...images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextImages.length) return;
    [nextImages[index], nextImages[targetIndex]] = [nextImages[targetIndex], nextImages[index]];
    onChange(nextImages);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span>Imágenes (max {maxImages})</span>
        <span>— La primera imagen será la portada</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: maxImages }).map((_, index) => {
          const image = images[index];

          return (
            <div
              key={index}
              className="relative h-32 border border-dashed border-secondary flex items-center justify-center overflow-hidden group"
            >
              {image ? (
                <>
                  <img
                    src={resolveImageUrl(image.path) || image.preview}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center py-1">
                      <span style={{ color: "white", fontSize: "0.7rem" }}>PORTADA</span>
                    </div>
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-black/60 p-1 rounded"
                      >
                        <TrashIcon size={14} color="white" />
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className={`bg-black/60 text-white text-base leading-none px-2 py-0.5 rounded ${index === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === images.length - 1}
                        className={`bg-black/60 text-white text-base leading-none px-2 py-0.5 rounded ${index === images.length - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2">
                  <PlusIcon />
                  <span>Subir Imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
