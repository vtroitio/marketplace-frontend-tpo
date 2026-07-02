import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LeftArrowIcon } from "../../components/icons";
import { ProductForm } from "../../components/products";
import { AppLink, Spinner } from "../../components/ui";
import {
  createProductWithImages,
  fetchProductFilterOptions,
  selectFilterOptionsError,
  selectFilterOptionsInitialized,
  selectFilterOptionsLoading,
  selectProductFormDataFromFilterOptions,
} from "../../features/products";

export function CreateProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formData = useSelector(selectProductFormDataFromFilterOptions);
  const filterOptionsLoading = useSelector(selectFilterOptionsLoading);
  const filterOptionsInitialized = useSelector(selectFilterOptionsInitialized);
  const filterOptionsError = useSelector(selectFilterOptionsError);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!filterOptionsInitialized && !filterOptionsLoading) {
      dispatch(fetchProductFilterOptions());
    }
  }, [
    dispatch,
    filterOptionsInitialized,
    filterOptionsLoading,
  ]);

  const handleSubmit = async (product) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      await dispatch(createProductWithImages(product)).unwrap();

      navigate("/sell");
    } catch (error) {
      setSubmitError(error || "Ocurrió un error al crear el producto.");
    } finally {
      setSubmitting(false);
    }
  };

  const loading =
    filterOptionsLoading ||
    (!filterOptionsInitialized && !filterOptionsError);

  if (loading) {
    return (
      <section className="container mx-auto py-64">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <Spinner />
        </div>
      </section>
    );
  }

  if (filterOptionsError) {
    return (
      <section className="container mx-auto py-64">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <h1>Error al cargar el formulario</h1>
          <p>{filterOptionsError}</p>
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

      {submitError && <p className="mt-4 text-red-500">{submitError}</p>}

      <ProductForm
        data={formData}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Publicando..." : "Publicar Prenda"}
      />
    </div>
  );
}