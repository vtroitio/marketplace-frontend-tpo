import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLink, Spinner } from "../../components/ui";
import { LeftArrowIcon } from "../../components/icons";
import { ProductForm } from "../../components/products";
import {
  getProductForEdit,
  getCategories,
  getAttributes,
  updateProduct,
  uploadVariantImages,
  deleteVariantImage,
  reorderVariantImages,
  setCoverImage,
} from "../../api/products";
import {
  normalizeProductForForm,
  mapFormToProductRequest,
} from "../../helpers/productFormMapper";

export function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialImagesRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productData, categoriesData, attributesData] = await Promise.all(
          [getProductForEdit(productId), getCategories(), getAttributes()],
        );

        const normalized = normalizeProductForForm(productData, categoriesData, attributesData);

        // Snapshot existing images per group so we can detect deletions on submit
        initialImagesRef.current = new Map(
          normalized.variantGroups.map((g) => [
            g.colorAttributeValueId,
            g.images.filter((img) => img.id).map((img) => ({ id: img.id, variantId: img.variantId })),
          ])
        );

        setProduct(normalized);
      } catch (err) {
        setError("Ocurrió un error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const dto = mapFormToProductRequest(updatedProduct);
      await updateProduct(productId, dto);

      let coverImageId = null;

      for (const group of updatedProduct.variantGroups) {
        // Delete images that were removed by the user
        const initialImages = initialImagesRef.current?.get(group.colorAttributeValueId) ?? [];
        const currentImageIds = new Set(group.images.filter((img) => img.id).map((img) => img.id));
        for (const img of initialImages) {
          if (!currentImageIds.has(img.id)) {
            await deleteVariantImage(productId, img.variantId, img.id);
          }
        }

        const variantId = group.sizes[0]?.variantId;
        if (!variantId) continue;

        // Upload new images
        const newImages = group.images.filter((img) => img.file);
        if (newImages.length > 0) {
          const files = newImages.map((img) => img.file);
          const uploaded = await uploadVariantImages(productId, variantId, files);

          if (coverImageId === null && uploaded.length > 0) {
            coverImageId = uploaded[0].id;
          }
        }

        // Reorder existing images to match current frontend order
        const existingImageIds = group.images
          .filter((img) => img.id)
          .map((img) => img.id);
        if (existingImageIds.length > 0) {
          await reorderVariantImages(productId, variantId, existingImageIds);
        }

        if (coverImageId === null && group.images[0]?.id) {
          coverImageId = group.images[0].id;
        }
      }

      if (coverImageId !== null) {
        await setCoverImage(productId, coverImageId);
      }

      navigate("/sell");
    } catch (error) {
      // error al actualizar
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto py-64">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <Spinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-64">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <h1>Acceso denegado</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-32">
      <AppLink to="/sell">
        <LeftArrowIcon />
        <span>Ir al panel de venta</span>
      </AppLink>
      <div className="border-b border-secondary pb-4">
        <h2>Editar Prenda</h2>
      </div>
      <ProductForm
        data={product}
        onSubmit={handleUpdateProduct}
        submitLabel="Actualizar Prenda"
      />
    </section>
  );
}
