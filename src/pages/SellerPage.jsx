import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { CheckIcon, DiamondIcon, EyeIcon } from "../components/icons";

export function SellerPage() {
  const [formData, setFormData] = useState({
    brandName: "",
    portfolioLink1: "",
    portfolioLink2: "",
    brandConcept: "",
    motivation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Formulario enviado:", formData);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        brandName: "",
        portfolioLink1: "",
        portfolioLink2: "",
        brandConcept: "",
        motivation: "",
      });
      alert("¡Solicitud enviada correctamente! Te contactaremos pronto.");
    }, 1000);
  };

  return (
    <div className="bg-secondary text-neutral">
      <div className="mx-auto max-w-295 px-8 py-20 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Sección Izquierda - Información */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1>Vender en Skindex.</h1>

              <p>
                En Skindex valoramos la visión única. No somos un marketplace genérico. Buscamos diseñadores que entiendan el poder del minimalismo y la estética geek elevada.
              </p>

              <p>
                Si tienes una perspectiva distintiva y colecciones que reflejen esa visión, queremos conocerte. El equilibrio entre la economía minimalista y la presencia técnica imprescindible. Es tu momento de ser parte de algo especial.
              </p>
            </div>

            <div className="space-y-4 border-l-2 border-primary pl-6">
              <div className="flex items-start gap-3">
                <CheckIcon size={22} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm uppercase font-semibold tracking-wider">
                  Estándares de calidad rigurosos
                </span>
              </div>

              <div className="flex items-start gap-3">
                <DiamondIcon size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm uppercase font-semibold tracking-wider">
                  Exclusividad y curaduría
                </span>
              </div>

              <div className="flex items-start gap-3">
                <EyeIcon size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm uppercase font-semibold tracking-wider">
                  Visibilidad ante una audiencia sofisticada
                </span>
              </div>
            </div>
          </div>

          {/* Sección Derecha - Formulario */}
          <div
            className="
              bg-black/40 border border-primary/20 p-8 lg:p-10
              [&_span]:text-neutral
              [&_.inline-flex]:border-neutral/30
              [&_input]:text-neutral
              [&_input::placeholder]:text-neutral/40
              [&_textarea]:text-neutral
              [&_textarea::placeholder]:text-neutral/40
              [&_.inline-flex:focus-within]:ring-neutral/40
            "
          >
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <Input
                  label="Nombre de marca"
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="Ej. Studio Graphene"
                  required
                />
              </div>

              <div className="space-y-4">
                <span className="text-base font-bold uppercase leading-3 tracking-[1.2px] block">
                  Link a portafolio / redes
                </span>
                <Input
                  type="url"
                  name="portfolioLink1"
                  value={formData.portfolioLink1}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <Input
                  type="url"
                  name="portfolioLink2"
                  value={formData.portfolioLink2}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Input
                  label="Marca / Concepto"
                  type="text"
                  name="brandConcept"
                  value={formData.brandConcept}
                  onChange={handleChange}
                  placeholder="Describe brevemente la identidad visual de tus creaciones..."
                  required
                />
              </div>

              <div>
                <Textarea
                  label="Motivación"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  placeholder="¿Por qué Skindex? ¿Qué aportaría tu trabajo a nuestra colección?"
                  rows="5"
                  required
                />
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}