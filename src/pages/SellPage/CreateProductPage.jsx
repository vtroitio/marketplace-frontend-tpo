import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftArrowIcon } from "../../components/icons";
import { ProductForm } from "../../components/products";
import { AppLink, Spinner } from "../../components/ui";
import {
  createProduct,
  getProductById,
  uploadVariantImages,
  setCoverImage,
  getCategories,
  getAttributes,
} from "../../api/products";
import { mapFormToProductRequest } from "../../helpers/productFormMapper";

export function CreateProductPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, attributesData] = await Promise.all([
          getCategories(),
          getAttributes(),
        ]);

        setFormData({
          _categories: categoriesData,
          _attributes: attributesData,
        });
      } catch (err) {
        setError("Ocurrió un error al cargar el formulario.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (product) => {
    try {
      const dto = mapFormToProductRequest(product);
      const created = await createProduct(dto);

      const fullProduct = await getProductById(created.id);

      let coverImageId = null;

      for (const group of product.variantGroups) {
        const newImages = group.images.filter((img) => img.file);
        if (newImages.length === 0) continue;

        const matchingVariant = fullProduct.variants?.find((v) =>
          v.attributeValues.some((av) => av.id === group.colorAttributeValueId)
        );

        if (!matchingVariant) continue;

        const files = newImages.map((img) => img.file);
        const uploaded = await uploadVariantImages(created.id, matchingVariant.id, files);

        if (coverImageId === null && uploaded.length > 0) {
          coverImageId = uploaded[0].id;
        }
      }

      if (coverImageId !== null) {
        await setCoverImage(created.id, coverImageId);
      }

      navigate("/sell");
    } catch (error) {
      // error al crear
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
          <h1>Error al cargar el formulario</h1>
        </div>
      </section>
    );
  }

  return (
    <div className="container mx-auto py-32">
      <div className="pb-4 border-b border-secondary">
        <AppLink to="/sell">
          <LeftArrowIcon />
          <span>Ir al panel de venta</span>
        </AppLink>
        <h2>Publicar Nueva Prenda</h2>
      </div>
      <ProductForm
        data={formData}
        onSubmit={handleSubmit}
        submitLabel="Publicar Prenda"
      />
    </div>
  );
}