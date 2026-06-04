export function ImageUploader({ images = [], onChange, maxImages = 4 }) {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

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

  return (
    <div className="flex flex-col gap-3">
      <p className="font-bold uppercase">Imágenes (max {maxImages})</p>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: maxImages }).map((_, index) => {
          const image = images[index];

          return (
            <div
              key={index}
              className="relative h-32 border border-dashed border-secondary flex items-center justify-center overflow-hidden"
            >
              {image ? (
                <>
                  <img
                    src={image.preview}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-gray-500 text-white w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 font-bold text-sm uppercase">
                  ↑<span>Subir Imagen</span>
                  <input
                    type="file"
                    accept="image/*"
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
