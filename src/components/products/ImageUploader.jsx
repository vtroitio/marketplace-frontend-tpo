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

  const moveToFirst = (index) => {
    const nextImages = [...images];
    const [moved] = nextImages.splice(index, 1);
    nextImages.unshift(moved);
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
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveToFirst(index)}
                      title="Hacer portada"
                      className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span style={{ fontSize: "0.65rem", background: "rgba(0,0,0,0.6)", color: "white", padding: "2px 4px" }}>
                        Hacer portada
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon />
                  </button>
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
